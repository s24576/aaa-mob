import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  Button,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { UserContext } from '../context/UserContext'
import {
  UserContextType,
  WatchListItem,
  MyAccountItem,
} from '../types/local/userContext'
import { getWatchlistRiotProfiles } from '../api/riot/getWatchlistRiotProfiles'
import { getMyRiotProfiles } from '../api/riot/getMyRiotProfiles'
import { getUserData } from '../api/user/getUserData'
import { ProfileScreenProps } from '../App'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { addBio } from '../api/profile/addBio'
import { manageWatchlist } from '../api/profile/manageWatchlist'
import { manageMyAccount } from '../api/profile/manageMyAccount'
import * as ImagePicker from 'expo-image-picker'
import { addProfilePicture } from '../api/profile/addProfilePicture'
import EvilIcons from '@expo/vector-icons/EvilIcons'

const UserProfile = () => {
  const { userData, setUserData } = useContext(UserContext) as UserContextType
  const [watchList, setWatchList] = useState<WatchListItem[]>([])
  const [myAccounts, setMyAccounts] = useState<MyAccountItem[]>([])
  const [newBio, setNewBio] = useState('')
  const isFocused = useIsFocused()
  const navigation = useNavigation<ProfileScreenProps['navigation']>()
  const [modalVisible, setModalVisible] = useState(false)
  const [emailModalVisible, setEmailModalVisible] = useState(false)
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const [input3, setInput3] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>('')
  const [reload, setReload] = useState(false)

  const rankImages: { [key: string]: any } = {
    IRON: require('../assets/ranks/IRON.png'),
    BRONZE: require('../assets/ranks/BRONZE.png'),
    SILVER: require('../assets/ranks/SILVER.png'),
    GOLD: require('../assets/ranks/GOLD.png'),
    PLATINUM: require('../assets/ranks/PLATINUM.png'),
    DIAMOND: require('../assets/ranks/DIAMOND.png'),
    MASTER: require('../assets/ranks/MASTER.png'),
    GRANDMASTER: require('../assets/ranks/GRANDMASTER.png'),
    CHALLENGER: require('../assets/ranks/CHALLENGER.png'),
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData()
        setUserData(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (isFocused) {
      fetchUserData()

      const fetchData = async () => {
        try {
          const watchListData = await getWatchlistRiotProfiles()
          setWatchList(
            watchListData.map((profile: any) => ({
              id: profile.puuid,
              name: profile.gameName,
              server: profile.server,
              icon: profile.profileIconId,
              tag: profile.tagLine,
              tier: profile.tier,
            }))
          )
          const myAccountsData = await getMyRiotProfiles()
          setMyAccounts(
            myAccountsData.map((account: any) => ({
              id: account.puuid,
              name: account.gameName,
              server: account.server,
              icon: account.profileIconId,
              tag: account.tagLine,
              tier: account.tier,
            }))
          )
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      fetchData()
    }
  }, [isFocused, reload])

  const handleProfilePress = (server: string, puuid: string) => {
    navigation.navigate('RiotProfile', { server, puuid })
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token')
    setUserData(null as any)
  }

  const handleBioChange = async () => {
    try {
      await addBio(newBio)
      setUserData({ ...userData, bio: newBio })
      setNewBio('')
    } catch (error) {
      console.error('Error updating bio:', error)
    }
  }

  const handleRemoveFromWatchlist = async (server: string, puuid: string) => {
    const confirm = window.confirm(
      'Are you sure you want to remove this account from the watchlist?'
    )
    if (confirm) {
      try {
        await manageWatchlist(server + '_' + puuid)
        setWatchList(watchList.filter((item) => item.id !== puuid))
      } catch (error) {
        console.error('Error removing from watchlist:', error)
      }
    }
  }

  const handleRemoveMyAccount = async (server: string, puuid: string) => {
    const confirm = window.confirm(
      'Are you sure you want to remove this account from your accounts?'
    )
    if (confirm) {
      try {
        await manageMyAccount(server + '_' + puuid)
        setMyAccounts(myAccounts.filter((item) => item.id !== puuid))
      } catch (error) {
        console.error('Error removing from my accounts:', error)
      }
    }
  }

  const handleProfilePictureUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!')
      return
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    })

    if (!pickerResult.canceled) {
      const imageUri = pickerResult.assets[0].uri
      const image = {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      }

      try {
        const response = await addProfilePicture(image)
        setUserData({ ...userData, image: response.image })
        setReload(!reload)
      } catch (error) {
        console.error('Error uploading profile picture:', error)
      }
    }
  }

  if (!userData) {
    return <Text className="text-bialas">Loading...</Text>
  }

  const { _id, profileIcon, bio, username, image } = userData

  return (
    <ScrollView
      style={{ padding: 5, backgroundColor: '#wegielek' }}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      {userData.image && userData.image.contentType && userData.image.data ? (
        <Image
          source={{
            uri: `data:${userData.image.contentType};base64,${userData.image.data}`,
          }}
          style={{ width: 160, height: 160, borderRadius: 80 }}
        />
      ) : (
        <EvilIcons
          name="user"
          size={160}
          color="#F5F5F5"
          style={{ width: 160, height: 160, borderRadius: 80 }}
        />
      )}
      <Text
        style={{
          color: '#F5F5F5',
          fontFamily: 'Chewy-Regular',
          fontSize: 24,
        }}
      >
        {username}
      </Text>
      <Text
        style={{
          color: '#F5F5F5',
          fontFamily: 'Chewy-Regular',
        }}
      >
        {bio}
      </Text>
      <TextInput
        className="text-bialas"
        value={newBio}
        onChangeText={setNewBio}
        placeholder="Enter new bio"
        placeholderTextColor="#F5F5F5"
        style={{
          borderWidth: 1,
          borderColor: '#F5B800',
          color: '#F5F5F5',
          width: '100%',
          borderRadius: 12,
          marginBottom: 10,
          paddingLeft: 10,
        }}
      />
      <Button title="Update Bio" onPress={handleBioChange} />
      <Button
        title="Upload Profile Picture"
        onPress={handleProfilePictureUpload}
      />
      <Text
        style={{
          color: '#F5F5F5',
          fontFamily: 'Chewy-Regular',
        }}
      >
        Watchlist:
      </Text>
      <FlatList
        data={watchList}
        keyExtractor={(item, index) => `watchlist-${item.id}-${index}`}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center">
            {item.name && item.name.trim() && (
              <Image
                source={{
                  uri: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${item.icon}.png`,
                }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
            )}
            <Text
              className="text-bialas"
              onPress={() => handleProfilePress(item.server, item.id)}
            >
              {item.name && item.name.trim()
                ? `${item.name} ${item.tag}`
                : 'John Doe'}
            </Text>
            {item.name && item.name.trim() && (
              <Image
                source={rankImages[item.tier] || rankImages['IRON']}
                style={{ width: 50, height: 50 }}
              />
            )}
            <Text className="text-bialas">
              {item.name && item.name.trim() ? `${item.server}` : ''}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveFromWatchlist(item.server, item.id)}
            ></TouchableOpacity>
          </View>
        )}
      />

      <Text
        style={{
          color: '#F5F5F5',
          fontFamily: 'Chewy-Regular',
        }}
      >
        My Accounts:
      </Text>
      <FlatList
        data={myAccounts}
        keyExtractor={(item, index) => `myaccount-${item.id}-${index}`}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center">
            {item.name && item.name.trim() && (
              <Image
                source={{
                  uri: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${item.icon}.png`,
                }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
            )}
            <Text
              className="text-bialas"
              onPress={() => handleProfilePress(item.server, item.id)}
            >
              {item.name && item.name.trim()
                ? `${item.name} #${item.tag}`
                : 'John Doe'}
            </Text>
            {item.name && item.name.trim() && (
              <Image
                source={rankImages[item.tier] || rankImages['IRON']}
                style={{ width: 50, height: 50 }}
              />
            )}
            <Text className="text-bialas">
              {item.name && item.name.trim() ? `${item.server}` : ''}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveMyAccount(item.server, item.id)}
            ></TouchableOpacity>
          </View>
        )}
      />
      <Button
        title="Lista znajomych"
        onPress={() => navigation.navigate('FriendList')}
      />
      <Button title="Logout" onPress={handleLogout} />
    </ScrollView>
  )
}

export default UserProfile
