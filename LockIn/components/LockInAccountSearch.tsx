import React, { useState } from 'react'
import { View, TextInput, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ProfileScreenProps } from '../App'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../styles/BrowserStyles'

const LockInAccountSearch: React.FC = () => {
  const [username, setUsername] = useState('inzynierka')
  const navigation = useNavigation<ProfileScreenProps['navigation']>()
  const handleSearch = () => {
    navigation.navigate('LockInProfile', { username })
  }

  return (
    <View style={styles.searchContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[styles.searchInput, { flex: 1 }]}
          placeholder="Username"
          placeholderTextColor="#787878"
          value={username}
          onChangeText={setUsername}
        />
        <TouchableOpacity
          onPress={handleSearch}
          disabled={!username.trim()}
          style={[
            styles.searchButton,
            !username.trim() && styles.searchButtonDisabled,
          ]}
        >
          <Icon
            name="search"
            size={24}
            color={!username.trim() ? '#787878' : '#131313'}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LockInAccountSearch
