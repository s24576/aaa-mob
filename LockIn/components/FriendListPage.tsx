import React, { useContext } from 'react'
import { View, Text, FlatList, Button } from 'react-native'
import { UserContext } from '../context/UserContext'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { UserContextType } from '../types/local/userContext'
import { ProfileScreenProps } from '../App'

const FriendListPage = () => {
  const { userData } = useContext(UserContext) as UserContextType
  const navigation = useNavigation<ProfileScreenProps['navigation']>()

  if (!userData || !userData.friends) {
    return <Text>Loading...</Text>
  }

  return (
    <View>
      <Button
        title="Zaproszenia do znajomych"
        onPress={() => navigation.navigate('FriendRequests')}
      />
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
