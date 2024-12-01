import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Image, FlatList } from 'react-native'
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

const UserProfile = () => {
  const { userData, setUserData } = useContext(UserContext) as UserContextType
  const [watchList, setWatchList] = useState<WatchListItem[]>([])
  const [myAccounts, setMyAccounts] = useState<MyAccountItem[]>([])
  const isFocused = useIsFocused()
  const navigation = useNavigation<ProfileScreenProps['navigation']>()

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
            }))
          )
          const myAccountsData = await getMyRiotProfiles()
          setMyAccounts(
            myAccountsData.map((account: any) => ({
              id: account.puuid,
              name: account.gameName,
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

  if (!userData) {
    return <Text>Loading...</Text>
  }

  const { _id, profileIcon, bio, username } = userData

  return (
    <View>
      {profileIcon && <Image source={{ uri: profileIcon }} />}
      <Text>ID: {_id}</Text>
      <Text>Username: {username}</Text>
      <Text>Bio: {bio}</Text>
      <Text>Watchlist:</Text>
      <FlatList
        data={watchList}
        keyExtractor={(item, index) => `watchlist-${item.id}-${index}`}
        renderItem={({ item }) => (
          <Text onPress={() => handleProfilePress('EUW1', item.id)}>
            {item.name}
          </Text>
        )}
      />
      <Text>My Accounts:</Text>
      <FlatList
        data={myAccounts}
        keyExtractor={(item, index) => `myaccount-${item.id}-${index}`}
        renderItem={({ item }) => (
          <Text onPress={() => handleProfilePress('EUW1', item.id)}>
            {item.name}
          </Text>
        )}
      />
    </View>
  )
}

export default UserProfile
