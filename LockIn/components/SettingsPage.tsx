import React, { useState } from 'react'
import {
  Text,
  View,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native'
import { handleChangePassword } from '../api/user/changePassword'
import { handleChangeEmail } from '../api/user/changeEmail'
import { useTranslation } from 'react-i18next'
import LanguageToggleButton from './LanguageToggleButton'

const SettingsPage = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [emailModalVisible, setEmailModalVisible] = useState(false)
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const [input3, setInput3] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>('')
  const { t } = useTranslation()

  const handleSubmitPasswordChange = async () => {
    await handleChangePassword(input1, input2, input3, setError)
    if (!error) {
      setModalVisible(false)
    }
  }

  const handleSubmitEmailChange = async () => {
    await handleChangeEmail(email, input1, setError)
    if (!error) {
      setEmailModalVisible(false)
    }
  }

  return (
    <View>
      <Button title="Change password" onPress={() => setModalVisible(true)} />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              width: '80%',
              backgroundColor: '#131313',
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text className="text-lg font-boldd text-zoltek mb-2">
              Change password
            </Text>
            <TextInput
              placeholder="Old password"
              placeholderTextColor="#F5F5F5"
              value={input1}
              onChangeText={setInput1}
              style={{
                borderWidth: 1,
                borderColor: '#F5B800',
                color: '#F5F5F5',
                width: '100%',
                borderRadius: 12,
                marginBottom: 10,
                paddingLeft: 10,
              }}
            />
            <TextInput
              placeholder="New password"
              placeholderTextColor="#F5F5F5"
              value={input2}
              onChangeText={setInput2}
              style={{
                borderWidth: 1,
                borderColor: '#F5B800',
                color: '#F5F5F5',
                width: '100%',
                borderRadius: 12,
                marginBottom: 10,
                paddingLeft: 10,
              }}
            />
            <TextInput
              placeholder="Confirm password"
              placeholderTextColor="#F5F5F5"
              value={input3}
              onChangeText={setInput3}
              style={{
                borderWidth: 1,
                borderColor: '#F5B800',
                color: '#F5F5F5',
                width: '100%',
                borderRadius: 12,
                marginBottom: 10,
                paddingLeft: 10,
              }}
            />
            <TouchableOpacity
              onPress={handleSubmitPasswordChange}
              style={{
                backgroundColor: '#F5B800',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 18,
                alignItems: 'center',
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: '#131313',
                  fontSize: 16,
                }}
              >
                WYŚLIJ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: '#F5B800',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 18,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: '#131313',
                  fontSize: 16,
                }}
              >
                ZAMKNIJ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Button title="Change email" onPress={() => setEmailModalVisible(true)} />
      <Modal
        visible={emailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              width: '80%',
              backgroundColor: '#131313',
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text className="text-lg font-boldd text-zoltek mb-2">
              Change email
            </Text>
            <TextInput
              placeholder="New email"
              placeholderTextColor="#F5F5F5"
              value={email}
              onChangeText={setEmail}
              style={{
                borderWidth: 1,
                borderColor: '#F5B800',
                color: '#F5F5F5',
                width: '100%',
                borderRadius: 12,
                marginBottom: 10,
                paddingLeft: 10,
              }}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#F5F5F5"
              value={input1}
              onChangeText={setInput1}
              style={{
                borderWidth: 1,
                borderColor: '#F5B800',
                color: '#F5F5F5',
                width: '100%',
                borderRadius: 12,
                marginBottom: 10,
                paddingLeft: 10,
              }}
            />
            <TouchableOpacity
              onPress={handleSubmitEmailChange}
              style={{
                backgroundColor: '#F5B800',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 18,
                alignItems: 'center',
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: '#131313',
                  fontSize: 16,
                }}
              >
                WYŚLIJ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEmailModalVisible(false)}
              style={{
                backgroundColor: '#F5B800',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 18,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: '#131313',
                  fontSize: 16,
                }}
              >
                ZAMKNIJ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text className="text-bialas">{t('languageTest')}</Text>
      <LanguageToggleButton />
    </View>
  )
}

export default SettingsPage
