import React from 'react'
import { View, Text, ScrollView, Button, Image } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { findProfile } from '../api/profile/findProfile'
import { sendFriendRequest } from '../api/profile/sendFriendRequest'

type LockInProfileRouteProp = RouteProp<
  {
    LockInProfile: {
      username: string
    }
  },
  'LockInProfile'
>

const LockInProfilePage: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<LockInProfileRouteProp>()
  const { username } = route.params

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['LockInProfile', { username }],
    queryFn: () => findProfile(username),
    enabled: !!username,
  })

  const handleOnPress = (friendUsername: string) => {
    navigation.navigate('LockInProfile', { username: friendUsername })
  }

  const handleSendFriendRequest = async () => {
    try {
      const targetUsername = username || profile?._id
      if (!targetUsername) {
        alert('Invalid profile data.')
        return
      }
      await sendFriendRequest(targetUsername)
      alert('Friend request sent!')
    } catch (error) {
      console.error(error)
      alert('Failed to send friend request.')
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text className="text-2xl mb-4">LockIn Profile Page</Text>
      {isLoading && <Text>Loading...</Text>}
      {error && (
        <View>
          <Text>Error fetching profile: {error.message}</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      )}
      {profile && (
        <View>
          {profile.image && profile.image.contentType && profile.image.data ? (
            <Image
              source={{
                uri: `data:${profile.image.contentType};base64,${profile.image.data}`,
              }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: '#ddd',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>No Image</Text>
            </View>
          )}
          <Button title="Add Friend" onPress={handleSendFriendRequest} />
          <Text>Username: {profile.username}</Text>
          <Text>Email: {profile.email}</Text>
          <Text>Bio: {profile.bio}</Text>
          <Text>Friends:</Text>
          {profile.friends.map((friend: { _id: string; username: string }) => (
            <Text
              onPress={() => handleOnPress(friend.username)}
              key={friend._id}
            >
              {friend.username}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

export default LockInProfilePage
