import React from 'react'
import { View, Text, ScrollView, Button, Image } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { findProfile } from '../api/profile/findProfile'

type LockInProfileRouteProp = RouteProp<
  {
    LockInProfile: {
      username: string
    }
  },
  'LockInProfile'
>

const LockInProfile: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<LockInProfileRouteProp>()
  const { username } = route.params

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['lockInProfile', { username }],
    queryFn: () => findProfile(username),
    enabled: !!username,
  })

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
          <Image
            source={{
              uri: `data:${profile.image.contentType};base64,${profile.image.data}`,
            }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text>Username: {profile.username}</Text>
          <Text>Email: {profile.email}</Text>
          <Text>Bio: {profile.bio}</Text>
          <Text>Friends:</Text>
          {profile.friends.map((friend: { _id: string; username: string }) => (
            <Text key={friend._id}>{friend.username}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

export default LockInProfile
