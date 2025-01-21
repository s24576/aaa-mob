import React, { useContext } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { findProfile } from '../api/profile/findProfile'
import { sendFriendRequest } from '../api/profile/sendFriendRequest'
import styles from '../styles/BrowserStyles'
import { EvilIcons } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'

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
  const { userData } = useContext(UserContext) as UserContextType

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

  const isAlreadyFriend = () => {
    if (!profile?.friends || !userData) return false
    return profile.friends.some(
      (friend) =>
        (friend.username === userData._id &&
          friend.username2 === profile._id) ||
        (friend.username === profile._id && friend.username2 === userData._id)
    )
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }

  return (
    <ScrollView>
      <View style={styles.profileImageContainer}>
        {profile.image && profile.image.contentType && profile.image.data ? (
          <Image
            source={{
              uri: `data:${profile.image.contentType};base64,${profile.image.data}`,
            }}
            style={styles.profileImage}
          />
        ) : (
          <EvilIcons
            name="user"
            size={160}
            color="#F5F5F5"
            style={styles.profileImage}
          />
        )}
        <Text style={styles.username}>{profile.username || profile._id}</Text>
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>
            {profile.bio || 'No bio available'}
          </Text>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        {!isAlreadyFriend() && (
          <TouchableOpacity
            style={styles.customButton2}
            onPress={handleSendFriendRequest}
          >
            <FontAwesome name="user-plus" size={20} color="#131313" />
            <Text style={styles.customButton2Text}> Add Friend</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.accountListContainer}>
        <Text style={styles.accountListHeader}>Friends:</Text>
        {profile.friends && profile.friends.length > 0 ? (
          profile.friends.map((friend) => (
            <TouchableOpacity
              key={
                friend._id +
                (profile._id === friend.username
                  ? friend.username2
                  : friend.username)
              }
              onPress={() =>
                handleOnPress(
                  profile._id === friend.username
                    ? friend.username2
                    : friend.username
                )
              }
              style={styles.friendItem}
            >
              <Text style={styles.friendName}>
                {profile._id === friend.username
                  ? friend.username2
                  : friend.username}
              </Text>
              <FontAwesome name="chevron-right" size={20} color="#F5B800" />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyListText}>No friends yet</Text>
        )}
      </View>
    </ScrollView>
  )
}

export default LockInProfilePage
