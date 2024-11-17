
import React, { useContext } from 'react'
import { View, Text, Image } from 'react-native'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'

const UserProfile = () => {
  const { userData } = useContext(UserContext) as UserContextType

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
    </View>
  )
}

export default UserProfile