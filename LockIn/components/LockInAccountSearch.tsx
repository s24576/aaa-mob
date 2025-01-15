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
        style={{
          borderWidth: 1,
          borderColor: '#F5B800',
          color: '#F5F5F5',
          width: '100%',
          borderRadius: 12,
          marginBottom: 10,
          paddingLeft: 10,
          fontFamily: 'Chewy-Regular',
        }}
        placeholder="Username"
        placeholderTextColor="#F5F5F5"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  )
}

export default LockInAccountSearch
