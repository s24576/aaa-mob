import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { Profile } from '../types/riot/profileClass' // Adjust the import path as necessary
import { useNavigation } from '@react-navigation/native'
import { MatchDetailsScreenProps } from '../App'

const ProfileTable: React.FC<{ profile: Profile }> = ({ profile }) => {
  const navigation = useNavigation<MatchDetailsScreenProps['navigation']>()

  const handleMatchPress = (matchId: string) => {
    navigation.navigate('MatchDetails', { matchId })
  }

  return (
    <View className="mt-5">
      <Text className="text-lg mb-2">Profile Information</Text>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text className="flex-1 text-left">PUUID</Text>
        <Text className="flex-1 text-left">{profile.puuid}</Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text className="flex-1 text-left">Game Name</Text>
        <Text className="flex-1 text-left">{profile.gameName}</Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text className="flex-1 text-left">Tag Line</Text>
        <Text className="flex-1 text-left">{profile.tagLine}</Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text className="flex-1 text-left">Server</Text>
        <Text className="flex-1 text-left">{profile.server}</Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text className="flex-1 text-left">Summoner Level</Text>
        <Text className="flex-1 text-left">{profile.summonerLevel}</Text>
      </View>
      <Text className="text-lg mb-2 mt-4">Ranks</Text>
      {profile.ranks.map((rank, index) => (
        <View
          key={index}
          className="flex-row justify-between py-2 border-b border-gray-300"
        >
          <Text className="flex-1 text-left">{rank.queueType}</Text>
          <Text className="flex-1 text-left">
            {rank.tier} {rank.rank}
          </Text>
        </View>
      ))}
      <Text className="text-lg mb-2 mt-4">Mastery</Text>
      {profile.mastery.map((mastery, index) => (
        <View
          key={index}
          className="flex-row justify-between py-2 border-b border-gray-300"
        >
          <Text className="flex-1 text-left">{mastery.championName}</Text>
          <Text className="flex-1 text-left">{mastery.championPoints}</Text>
        </View>
      ))}
      <Text className="text-lg mb-2 mt-4">Matches</Text>
      {profile.matches.map((match, index) => (
        <View
          key={match.matchId}
          className="flex-row justify-between py-2 border-b border-gray-300"
        >
          <Text className="flex-1 text-left">{match.championName}</Text>
          <Text className="flex-1 text-left">
            {match.kills}/{match.deaths}/{match.assists}
          </Text>
          <TouchableOpacity onPress={() => handleMatchPress(match.matchId)}>
            <Text>{match.matchId}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )
}

const ProfilePage: React.FC = () => {
  const [server, setServer] = useState('EUW1')
  const [tag, setTag] = useState('ECPU')
  const [name, setName] = useState('Oriol')
  const [profile, setProfile] = useState<Profile | null>(null)

  const handleSubmit = async () => {
    const url = `${process.env.BACKEND_ADDRESS}/riot/findPlayer?server=${server}&tag=${tag}&name=${name}`
    try {
      const response = await fetch(url)
      const data = await response.json()
      console.log('RIOT URL:', url) // Log the request URL
      console.log('Server Response:', data) // Log the server response
      Alert.alert('Server Response', JSON.stringify(data))

      const profileData = new Profile(data)
      setProfile(profileData)
    } catch (error) {
      console.error('Error fetching data:', error)
      Alert.alert('Error', 'Failed to fetch data from server')
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text className="text-2xl mb-4">Profile Page</Text>
      <View className="mb-3">
        <Text>Server:</Text>
        <TextInput
          className="h-10 border border-gray-400 px-2"
          value={server}
          onChangeText={setServer}
        />
      </View>
      <View className="mb-3">
        <Text>Tag:</Text>
        <TextInput
          className="h-10 border border-gray-400 px-2"
          value={tag}
          onChangeText={setTag}
        />
      </View>
      <View className="mb-3">
        <Text>Name:</Text>
        <TextInput
          className="h-10 border border-gray-400 px-2"
          value={name}
          onChangeText={setName}
        />
      </View>
      <Button title="Search" onPress={handleSubmit} />

      {profile && <ProfileTable profile={profile} />}
    </ScrollView>
  )
}

export default ProfilePage
