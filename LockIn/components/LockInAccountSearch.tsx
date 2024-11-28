import React, { useState } from 'react'
import { View, TextInput, Button, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ProfileScreenProps } from '../App'

const LockInAccountSearch: React.FC = () => {
  const [username, setUsername] = useState('')
  const navigation = useNavigation<ProfileScreenProps['navigation']>()

  const handleSearch = () => {
    // navigation.navigate('LockInProfile', { username })
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
})

export default LockInAccountSearch
