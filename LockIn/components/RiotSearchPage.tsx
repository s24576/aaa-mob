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
        placeholder="Server"
        placeholderTextColor="#F5F5F5"
        value={server}
        onChangeText={setServer}
      />
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
        placeholder="Tag"
        placeholderTextColor="#F5F5F5"
        value={tag}
        onChangeText={setTag}
      />
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
        placeholder="Name"
        placeholderTextColor="#F5F5F5"
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
