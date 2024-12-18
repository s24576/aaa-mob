import React, { useState } from 'react'
import { View, TextInput, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ProfileScreenProps } from '../App'

const LockInAccountSearch: React.FC = () => {
  const [username, setUsername] = useState('inzynierka')
  const navigation = useNavigation<ProfileScreenProps['navigation']>()

  const handleSearch = () => {
    navigation.navigate('LockInProfile', { username })
  }

  return (
    <View className="flex-1 p-5">
      <TextInput
        className="h-10 border border-gray-400 mb-3 px-2"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  )
}

export default LockInAccountSearch
