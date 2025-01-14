import React from 'react'
import {
  View,
  Text,
  ScrollView,
  Button,
  Image,
  ActivityIndicator,
} from 'react-native'
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
  console.log(profile)
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

  if (isLoading) {
    return (
      <View className="bg-wegielek">
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} className="bg-wegielek">
      <Text className="text-bialas text-2xl mb-4">LockIn Profile Page</Text>

      <View className="items-center">
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
            <Text className="text-bialas">No Image</Text>
          </View>
        )}
        <Button title="Add Friend" onPress={handleSendFriendRequest} />
        <Text className="text-bialas mt-2">
          Username: {profile.username || profile._id}
        </Text>
        <Text className="text-bialas mt-2">
          Bio: {profile.bio || 'No bio available'}
        </Text>
        <Text className="text-bialas mt-2">Friends:</Text>
        {profile.friends.map((friend) => (
          <Text
            className="text-zoltek mt-1"
            onPress={() =>
              handleOnPress(
                profile._id === friend.username
                  ? friend.username2
                  : friend.username
              )
            }
            key={
              friend._id +
              (profile._id === friend.username
                ? friend.username2
                : friend.username)
            }
          >
            {profile._id === friend.username
              ? friend.username2
              : friend.username}
          </Text>
        ))}
      </View>
    </ScrollView>
  )
}

export default LockInProfilePage
