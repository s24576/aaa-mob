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
import LanguageToggleButton from './LanguageToggleButton'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { addBio } from '../api/profile/addBio'
import { handleChangePassword } from '../api/user/changePassword'
import { handleChangeEmail } from '../api/user/changeEmail'
import { manageWatchlist } from '../api/profile/manageWatchlist'
import { manageMyAccount } from '../api/profile/manageMyAccount'

const UserProfile = () => {
  const { userData, setUserData } = useContext(UserContext) as UserContextType
  const [watchList, setWatchList] = useState<WatchListItem[]>([])
  const [myAccounts, setMyAccounts] = useState<MyAccountItem[]>([])
  const [newBio, setNewBio] = useState('')
  const isFocused = useIsFocused()
  const navigation = useNavigation<ProfileScreenProps['navigation']>()
  const { t } = useTranslation()
  const [modalVisible, setModalVisible] = useState(false)
  const [emailModalVisible, setEmailModalVisible] = useState(false)
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const [input3, setInput3] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>('')

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
            }))
          )
          const myAccountsData = await getMyRiotProfiles()
          setMyAccounts(
            myAccountsData.map((account: any) => ({
              id: account.puuid,
              name: account.gameName,
              server: account.server,
            }))
          )
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      fetchData()
    }
  }, [isFocused])

  const handleProfilePress = (server: string, puuid: string) => {
    navigation.navigate('RiotProfile', { server, puuid })
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token')
    setUserData(null)
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

  const handleSubmitPasswordChange = async () => {
    await handleChangePassword(input1, input2, input3, setError)
    if (!error) {
      setModalVisible(false)
    }
  }

  const handleSubmitEmailChange = async () => {
    await handleChangeEmail(email, input1, setError)
    if (!error) {
      setEmailModalVisible(false)
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

  if (!userData) {
    return <Text className="text-bialas">Loading...</Text>
  }

  const { _id, profileIcon, bio, username, image } = userData

  return (
    <View className="p-5 bg-wegielek items-center">
      {image && image.contentType && image.data ? (
        <Image
          source={{
            uri: `data:${image.contentType};base64,${image.data}`,
          }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      ) : (
        <Text className="text-bialas">No profile icon available</Text>
      )}
      <Text className="text-bialas">ID: {_id}</Text>
      <Text className="text-bialas">Username: {username}</Text>
      <Text className="text-bialas">Bio: {bio}</Text>
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
      <Text className="text-bialas">Watchlist:</Text>
      <FlatList
        data={watchList}
        keyExtractor={(item, index) => `watchlist-${item.id}-${index}`}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center">
            <Text
              className="text-bialas"
              onPress={() => handleProfilePress(item.server, item.id)}
            >
              {item.name}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveFromWatchlist(item.server, item.id)}
            >
              <Text className="text-red-500">X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text className="text-bialas">My Accounts:</Text>
      <FlatList
        data={myAccounts}
        keyExtractor={(item, index) => `myaccount-${item.id}-${index}`}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center">
            <Text
              className="text-bialas"
              onPress={() => handleProfilePress(item.server, item.id)}
            >
              {item.name}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveMyAccount(item.server, item.id)}
            >
              <Text className="text-red-500">X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Change password" onPress={() => setModalVisible(true)} />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              width: '80%',
              backgroundColor: '#131313',
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text className="text-lg font-boldd text-zoltek mb-2">
              Change password
            </Text>
            <TextInput
              placeholder="Old password"
              placeholderTextColor="#F5F5F5"
              value={input1}
              onChangeText={setInput1}
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
            <TextInput
              placeholder="New password"
              placeholderTextColor="#F5F5F5"
              value={input2}
              onChangeText={setInput2}
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
            <TextInput
              placeholder="Confirm password"
              placeholderTextColor="#F5F5F5"
              value={input3}
              onChangeText={setInput3}
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
            <TouchableOpacity
              onPress={handleSubmitPasswordChange}
              style={{
                backgroundColor: '#F5B800',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 18,
                alignItems: 'center',
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: '#131313',
                  fontSize: 16,
                }}
              >
                WYŚLIJ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: '#F5B800',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 18,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: '#131313',
                  fontSize: 16,
                }}
              >
                ZAMKNIJ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Button title="Change email" onPress={() => setEmailModalVisible(true)} />
      <Modal
        visible={emailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              width: '80%',
              backgroundColor: '#131313',
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text className="text-lg font-boldd text-zoltek mb-2">
              Change email
            </Text>
            <TextInput
              placeholder="New email"
              placeholderTextColor="#F5F5F5"
              value={email}
              onChangeText={setEmail}
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
            <TextInput
              placeholder="Password"
              placeholderTextColor="#F5F5F5"
              value={input1}
              onChangeText={setInput1}
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
            <TouchableOpacity
              onPress={handleSubmitEmailChange}
              style={{
                backgroundColor: '#F5B800',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 18,
                alignItems: 'center',
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: '#131313',
                  fontSize: 16,
                }}
              >
                WYŚLIJ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEmailModalVisible(false)}
              style={{
                backgroundColor: '#F5B800',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 18,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: '#131313',
                  fontSize: 16,
                }}
              >
                ZAMKNIJ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Button
        title="Lista znajomych"
        onPress={() => navigation.navigate('FriendList')}
      />
      <LanguageToggleButton />
      <Text className="text-bialas">{t('languageTest')}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  )
}

export default UserProfile
