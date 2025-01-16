import React, { useState } from 'react'
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ProfileScreenProps } from '../App'
import servers from '../assets/servers.json'
import Icon from 'react-native-vector-icons/Ionicons'

const RiotSearchPage: React.FC = () => {
  const [server, setServer] = useState('EUW1')
  const [tag, setTag] = useState('ECPU')
  const [name, setName] = useState('Oriol')
  const [modalVisible, setModalVisible] = useState(false)
  const navigation = useNavigation<ProfileScreenProps['navigation']>()

  const handleSearch = () => {
    navigation.navigate('RiotProfile', { server, tag, name })
  }

  const handleServerSelect = (selectedServer: string) => {
    setServer(selectedServer)
    setModalVisible(false)
  }

  return (
    <View className="flex-row justify-center items-center mb-3 pt-5 px-10">
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#F5B800',
            color: '#F5F5F5',
            width: '100%',
            borderRadius: 12,
            padding: 10,
            fontFamily: 'Chewy-Regular',
          }}
          placeholder="Server"
          placeholderTextColor="#F5F5F5"
          value={server}
          editable={false}
        />
      </TouchableOpacity>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#F5B800',
          color: '#F5F5F5',
          width: '60%',
          borderRadius: 12,
          paddingLeft: 10,
          fontFamily: 'Chewy-Regular',
        }}
        placeholder="Name"
        placeholderTextColor="#F5F5F5"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#F5B800',
          color: '#F5F5F5',
          width: '20%',
          borderRadius: 12,
          paddingLeft: 10,
          fontFamily: 'Chewy-Regular',
        }}
        placeholder="Tag"
        placeholderTextColor="#F5F5F5"
        value={tag}
        onChangeText={setTag}
      />

      <TouchableOpacity
        onPress={handleSearch}
        disabled={!tag.trim() || !name.trim() || !server.trim()}
        className={`ml-2 p-3 rounded-lg ${
          !tag.trim() || !name.trim() || !server.trim()
            ? 'bg-gray-300'
            : 'bg-zoltek'
        }`}
      >
        <Icon
          name="search"
          size={24}
          color={
            !tag.trim() || !name.trim() || !server.trim()
              ? '#A9A9A9'
              : '#131313'
          }
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={servers}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.serverItem}
                  onPress={() => handleServerSelect(item.code)}
                >
                  <Text style={styles.serverText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#131313',
    padding: 20,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    width: '80%',
    maxHeight: '80%',
  },
  serverItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  serverText: {
    color: '#F5F5F5',
    fontSize: 16,
  },
})

export default RiotSearchPage
