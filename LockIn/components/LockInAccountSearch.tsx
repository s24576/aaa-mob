import React, { useState } from 'react'
import { View, TextInput, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ProfileScreenProps } from '../App'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'

const LockInAccountSearch: React.FC = () => {
  const [username, setUsername] = useState('inzynierka')
  const navigation = useNavigation<ProfileScreenProps['navigation']>()
  const handleSearch = () => {
    navigation.navigate('LockInProfile', { username })
  }

  return (
    <View className="flex-row justify-center items-center mb-3 pt-5  w-full px-10">
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#F5B800',
          color: '#F5F5F5',
          width: '100%',
          borderRadius: 12,
          paddingLeft: 10,
          fontFamily: 'Chewy-Regular',
        }}
        placeholder="Username"
        placeholderTextColor="#F5F5F5"
        value={username}
        onChangeText={setUsername}
      />
      <TouchableOpacity
        onPress={handleSearch}
        disabled={!username.trim()}
        className={`ml-2 p-3 rounded-lg ${
          !username.trim() ? 'bg-gray-300' : 'bg-zoltek'
        }`}
      >
        <Icon
          name="search"
          size={24}
          color={!username.trim() ? '#A9A9A9' : '#131313'}
        />
      </TouchableOpacity>
    </View>
  )
}

export default LockInAccountSearch
