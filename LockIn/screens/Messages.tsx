import { View, Text, Button } from 'react-native'
import React from 'react'
import { sendFriendRequest } from '../api/profile/sendFriendRequest'

const Messages = () => {
  const handleSendFriendRequest = async () => {
    try {
      const response = await sendFriendRequest('Oriol')
    } catch (error) {
      console.error('Error sending friend request:', error)
    }
  }

  return (
    <View>
      <Text>Messages</Text>
      <Button
        title="Send Friend Request to Oriol"
        onPress={handleSendFriendRequest}
      />
    </View>
  )
}

export default Messages
