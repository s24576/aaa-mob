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
import styles from '../styles/BrowserStyles'

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
    EMERALD: require('../assets/ranks/EMERALD.png'),
    DIAMOND: require('../assets/ranks/DIAMOND.png'),
    MASTER: require('../assets/ranks/MASTER.png'),
    GRANDMASTER: require('../assets/ranks/GRANDMASTER.png'),
    CHALLENGER: require('../assets/ranks/CHALLENGER.png'),
    UNRANKED: require('../assets/ranks/UNRANKED.png'),
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

  const handleProfilePicturePress = async () => {
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
    <ScrollView>
      <TouchableOpacity
        style={styles.profileImageContainer}
        onPress={handleProfilePicturePress}
        activeOpacity={0.7}
      >
        {userData.image && userData.image.contentType && userData.image.data ? (
          <Image
            source={{
              uri: `data:${userData.image.contentType};base64,${userData.image.data}`,
            }}
            style={styles.profileImage}
          />
        ) : (
          <EvilIcons
            name="user"
            size={160}
            color="#F5F5F5"
            style={styles.profileImage}
          />
        )}
        <Text style={styles.username}>{username}</Text>
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>{bio}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.bioContainer}>
        <TextInput
          value={newBio}
          onChangeText={setNewBio}
          placeholder="Enter new bio"
          placeholderTextColor="#F5F5F5"
          style={styles.bioInput}
        />
        <TouchableOpacity
          style={styles.customButton2}
          onPress={handleBioChange}
        >
          <Text style={styles.customButton2Text}>Update Bio</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.customButton2}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.customButton2Text}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customButton2}
          onPress={() => navigation.navigate('FriendList')}
        >
          <Text style={styles.customButton2Text}>Friends List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.customButton,
            { backgroundColor: 'red' },
            { borderColor: 'black' },
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.customButton2Text}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.accountListContainer}>
        <Text style={styles.accountListHeader}>Watchlist:</Text>
        <FlatList
          data={watchList}
          keyExtractor={(item, index) => `watchlist-${item.id}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.listItemContainer}>
              {item.name && item.name.trim() && (
                <Image
                  source={{
                    uri: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${item.icon}.png`,
                  }}
                  style={styles.rankImage}
                />
              )}
              <View style={styles.accountInfo}>
                <Text
                  style={styles.accountName}
                  onPress={() => handleProfilePress(item.server, item.id)}
                >
                  {item.name && item.name.trim()
                    ? `${item.name} ${item.tag}`
                    : 'Unloaded User'}
                </Text>
                <Text style={styles.serverText}>{item.server}</Text>
              </View>
              {item.name && item.name.trim() && (
                <Image
                  source={rankImages[item.tier] || rankImages['UNRANKED']}
                  style={styles.rankImage}
                />
              )}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFromWatchlist(item.server, item.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <View style={styles.accountListContainer}>
        <Text style={styles.accountListHeader}>My Accounts:</Text>
        <FlatList
          data={myAccounts}
          keyExtractor={(item, index) => `myaccount-${item.id}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.listItemContainer}>
              {item.name && item.name.trim() && (
                <Image
                  source={{
                    uri: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${item.icon}.png`,
                  }}
                  style={styles.rankImage}
                />
              )}
              <View style={styles.accountInfo}>
                <Text
                  style={styles.accountName}
                  onPress={() => handleProfilePress(item.server, item.id)}
                >
                  {item.name && item.name.trim()
                    ? `${item.name} #${item.tag}`
                    : 'Unloaded User'}
                </Text>
                <Text style={styles.serverText}>{item.server}</Text>
              </View>
              {item.name && item.name.trim() && (
                <Image
                  source={
                    rankImages[item.tier.toUpperCase()] ||
                    rankImages['UNRANKED']
                  }
                  style={styles.rankImage}
                />
              )}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveMyAccount(item.server, item.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </ScrollView>
  )
}

export default UserProfile
