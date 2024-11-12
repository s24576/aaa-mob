import React, { useState } from 'react'
import { View, TextInput, Button, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ProfileScreenProps } from '../App'

const RiotSearchPage: React.FC = () => {
  const [server, setServer] = useState('EUW1')
  const [tag, setTag] = useState('ECPU')
  const [name, setName] = useState('Oriol')
  const navigation = useNavigation<ProfileScreenProps['navigation']>()

  const handleSearch = () => {
    navigation.navigate('RiotProfile', { server, tag, name })
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Server"
        value={server}
        onChangeText={setServer}
      />
      <TextInput
        style={styles.input}
        placeholder="Tag"
        value={tag}
        onChangeText={setTag}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
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

export default RiotSearchPage
