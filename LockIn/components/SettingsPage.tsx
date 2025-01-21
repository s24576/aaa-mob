import React, { useState } from 'react'
import { Text, View, Modal, TextInput, TouchableOpacity } from 'react-native'
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
      setInput1('')
      setInput2('')
      setInput3('')
    }
  }

  const handleSubmitEmailChange = async () => {
    await handleChangeEmail(email, input1, setError)
    if (!error) {
      setEmailModalVisible(false)
      setEmail('')
      setInput1('')
    }
  }

  return (
    <View className="justify-center items-center pt-10">
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
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
            fontFamily: 'Chewy-Regular',
          }}
        >
          {t('changePassword')}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false)
          setInput1('')
          setInput2('')
          setInput3('')
        }}
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
            <Text className="text-lg font-bold text-zoltek mb-2 text-center">
              {t('changePassword')}
            </Text>
            <TextInput
              placeholder={t('oldPassword')}
              placeholderTextColor="#F5F5F5"
              value={input1}
              onChangeText={setInput1}
              secureTextEntry
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
            />
            <TextInput
              placeholder={t('newPassword')}
              placeholderTextColor="#F5F5F5"
              value={input2}
              onChangeText={setInput2}
              secureTextEntry
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
            />
            <TextInput
              placeholder={t('confirmNewPassword')}
              placeholderTextColor="#F5F5F5"
              value={input3}
              onChangeText={setInput3}
              secureTextEntry
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
            />
            <TouchableOpacity
              onPress={handleSubmitPasswordChange}
              style={{
                backgroundColor:
                  input1 && input2 && input3 ? '#F5B800' : '#B0B0B0',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 18,
                alignItems: 'center',
                marginBottom: 15,
              }}
              disabled={!input1 || !input2 || !input3}
            >
              <Text
                style={{
                  color: '#131313',
                  fontSize: 16,
                  fontFamily: 'Chewy-Regular',
                }}
              >
                {t('change')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false)
                setInput1('')
                setInput2('')
                setInput3('')
              }}
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
                  fontFamily: 'Chewy-Regular',
                }}
              >
                {t('close')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => setEmailModalVisible(true)}
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
            fontFamily: 'Chewy-Regular',
          }}
        >
          {t('changeEmail')}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={emailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setEmailModalVisible(false)
          setEmail('')
          setInput1('')
        }}
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
            <Text className="text-lg font-bold text-zoltek mb-2 text-center">
              {t('changeEmail')}
            </Text>
            <TextInput
              placeholder={t('newEmail')}
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
                fontFamily: 'Chewy-Regular',
              }}
            />
            <TextInput
              placeholder={t('password')}
              placeholderTextColor="#F5F5F5"
              value={input1}
              onChangeText={setInput1}
              secureTextEntry
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
            />
            <TouchableOpacity
              onPress={handleSubmitEmailChange}
              style={{
                backgroundColor: email && input1 ? '#F5B800' : '#B0B0B0',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 18,
                alignItems: 'center',
                marginBottom: 15,
              }}
              disabled={!email || !input1}
            >
              <Text
                style={{
                  color: '#131313',
                  fontSize: 16,
                  fontFamily: 'Chewy-Regular',
                }}
              >
                {t('change')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setEmailModalVisible(false)
                setEmail('')
                setInput1('')
              }}
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
                  fontFamily: 'Chewy-Regular',
                }}
              >
                {t('close')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View className="justify-center items-center">
        <LanguageToggleButton />
      </View>
    </View>
  )
}

export default SettingsPage
