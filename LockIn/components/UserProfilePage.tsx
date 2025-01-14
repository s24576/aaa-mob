import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Image, FlatList, Button } from 'react-native'
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

const UserProfile = () => {
  const { userData, setUserData } = useContext(UserContext) as UserContextType
  const [watchList, setWatchList] = useState<WatchListItem[]>([])
  const [myAccounts, setMyAccounts] = useState<MyAccountItem[]>([])
  const isFocused = useIsFocused()
  const navigation = useNavigation<ProfileScreenProps['navigation']>()
  const { t } = useTranslation()

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

  if (!userData) {
    return <Text className="text-bialas">Loading...</Text>
  }

  const { _id, profileIcon, bio, username } = userData

  return (
    <View>
      {profileIcon ? (
        // <Image source={{ uri: profileIcon }} />
        <Text className="text-bialas">Profile icon available</Text>
      ) : (
        <Text className="text-bialas">No profile icon available</Text>
      )}
      <Text className="text-bialas">ID: {_id}</Text>
      <Text className="text-bialas">Username: {username}</Text>
      <Text className="text-bialas">Bio: {bio}</Text>
      <Text className="text-bialas">Watchlist:</Text>
      {/* <FlatList
        data={watchList}
        keyExtractor={(item, index) => `watchlist-${item.id}-${index}`}
        renderItem={({ item }) => (
          <Text
            className="text-bialas"
            onPress={() => handleProfilePress(item.server, item.id)}
          >
            {item.name}
          </Text>
        )}
      />
      <Text className="text-bialas">My Accounts:</Text>
      <FlatList
        data={myAccounts}
        keyExtractor={(item, index) => `myaccount-${item.id}-${index}`}
        renderItem={({ item }) => (
          <Text
            className="text-bialas"
            onPress={() => handleProfilePress(item.server, item.id)}
          >
            {item.name}
          </Text>
        )}
      /> */}
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
