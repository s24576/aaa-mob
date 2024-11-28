import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Image, FlatList } from 'react-native'
import { UserContext } from '../context/UserContext'
import {
  UserContextType,
  WatchListItem,
  MyAccountItem,
} from '../types/local/userContext'
import { getWatchList } from '../api/profile/getWatchList'
import { getMyAccounts } from '../api/profile/getMyAccounts'

const UserProfile = () => {
  const { userData } = useContext(UserContext) as UserContextType
  const [watchList, setWatchList] = useState<WatchListItem[]>([])
  const [myAccounts, setMyAccounts] = useState<MyAccountItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const watchListData = await getWatchList()
        console.log('WatchList Data:', watchListData)
        setWatchList(watchListData.map((id: string) => ({ id, name: id })))
        const myAccountsData = await getMyAccounts()
        console.log('My Accounts Data:', myAccountsData)
        setMyAccounts(myAccountsData.map((id: string) => ({ id, name: id })))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text key={item.id}>{item.name}</Text>}
      />
      <Text>My Accounts:</Text>
      <FlatList
        data={myAccounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text key={item.id}>{item.name}</Text>}
      />
    </View>
  )
}

export default UserProfile
