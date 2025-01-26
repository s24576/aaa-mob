import React, { useState } from 'react'
import {
  View,
  TextInput,
  Modal,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ProfileScreenProps } from '../App'
import servers from '../assets/servers.json'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../styles/BrowserStyles'
import { useTranslation } from 'react-i18next'

const RiotSearchPage: React.FC = () => {
  const [server, setServer] = useState('eun1')
  const [tag, setTag] = useState('BBB')
  const [name, setName] = useState('BlingBlingBoi')
  const [modalVisible, setModalVisible] = useState(false)
  const navigation = useNavigation<ProfileScreenProps['navigation']>()
  const { t } = useTranslation()

  const getServerName = (code: string) => {
    const serverObj = servers.find((s) => s.code === code)
    return serverObj ? serverObj.name : code
  }

  const handleSearch = () => {
    navigation.navigate('RiotProfile', { server, tag, name })
  }

  const handleServerSelect = (selectedServer: string) => {
    setServer(selectedServer)
    setModalVisible(false)
  }

  return (
    <View style={styles.searchContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextInput
          style={styles.serverSelector}
          placeholder="Server"
          placeholderTextColor="#787878"
          value={getServerName(server)}
          editable={false}
        />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[styles.searchInput, { flex: 3, marginRight: 10 }]}
          placeholder={t('name')}
          placeholderTextColor="#787878"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.searchInput, { flex: 1 }]}
          placeholder="Tag"
          placeholderTextColor="#787878"
          value={tag}
          onChangeText={setTag}
        />
        <TouchableOpacity
          onPress={handleSearch}
          disabled={!tag.trim() || !name.trim() || !server.trim()}
          style={[
            styles.searchButton,
            (!tag.trim() || !name.trim() || !server.trim()) &&
              styles.searchButtonDisabled,
          ]}
        >
          <Icon
            name="search"
            size={24}
            color={
              !tag.trim() || !name.trim() || !server.trim()
                ? '#787878'
                : '#131313'
            }
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={servers}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOptionContainer}
                  onPress={() => handleServerSelect(item.code)}
                >
                  <Text style={styles.modalOptionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default RiotSearchPage
