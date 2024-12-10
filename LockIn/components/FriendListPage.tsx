import React, { useContext } from 'react'
import { View, Text, FlatList } from 'react-native'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'

const FriendListPage = () => {
  const { userData } = useContext(UserContext) as UserContextType

  if (!userData || !userData.friends) {
    return <Text>Loading...</Text>
  }

  return (
    <View>
      <Text>Lista znajomych:</Text>
      <FlatList
        data={userData.friends}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Text>
            {item.username} ({item.username2})
          </Text>
        )}
      />
    </View>
  )
}

export default FriendListPage
