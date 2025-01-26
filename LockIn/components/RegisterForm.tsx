import EvilIcons from '@expo/vector-icons/EvilIcons'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
} from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import React, { useState } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { RegisterScreenProps } from '../App'
import { useTranslation } from 'react-i18next'
import { handleRegister } from '../api/user/register'

const RegisterForm = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const navigation = useNavigation<RegisterScreenProps['navigation']>()

  const { t } = useTranslation()

  const isDisabled =
    !email.trim() ||
    !username.trim() ||
    !password.trim() ||
    !confirmPassword.trim() ||
    !isChecked

  const handleRegisterPress = async () => {
    try {
      await handleRegister(
        email,
        username,
        password,
        confirmPassword,
        navigation,
        setError
      )
    } catch (err) {
      setError(err.message)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      setError('')
    }, [])
  )

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingTop: 0,
        paddingRight: 20,
        paddingBottom: 0,
        paddingLeft: 20,
      }}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <EvilIcons
        name="lock"
        size={240}
        color="#F5B800"
        style={{ marginBottom: 30 }}
      />
      <TextInput
        placeholder={t('emailPlaceholder')}
        placeholderTextColor="#F5F5F5"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: '#F5B800',
          color: '#F5F5F5',
          width: '90%',
          borderRadius: 12,
          marginBottom: 10,
          fontFamily: 'PoetsenOne-Regular',
          paddingLeft: 10,
        }}
      />
      <TextInput
        placeholder={t('usernamePlaceholder')}
        placeholderTextColor="#F5F5F5"
        value={username}
        onChangeText={setUsername}
        style={{
          borderWidth: 1,
          borderColor: '#F5B800',
          color: '#F5F5F5',
          width: '90%',
          borderRadius: 12,
          marginBottom: 10,
          fontFamily: 'PoetsenOne-Regular',
          paddingLeft: 10,
        }}
      />
      <TextInput
        placeholder={t('passwordPlaceholder')}
        placeholderTextColor="#F5F5F5"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#F5B800',
          color: '#F5F5F5',
          width: '90%',
          borderRadius: 12,
          marginBottom: 10,
          fontFamily: 'PoetsenOne-Regular',
          paddingLeft: 10,
        }}
      />
      <TextInput
        placeholder={t('confirmPasswordPlaceholder')}
        placeholderTextColor="#F5F5F5"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#F5B800',
          color: '#F5F5F5',
          width: '90%',
          borderRadius: 12,
          marginBottom: 10,
          fontFamily: 'PoetsenOne-Regular',
          paddingLeft: 10,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
          flexWrap: 'wrap',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => setIsChecked(!isChecked)}
          style={{
            width: 24,
            height: 24,
            borderWidth: 1,
            borderColor: '#F5B800',
            backgroundColor: isChecked ? '#F5B800' : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
          }}
        >
          {isChecked && (
            <Text style={{ color: '#131313', fontSize: 16 }}>✔</Text>
          )}
        </TouchableOpacity>
        <Text
          style={{
            color: '#F5F5F5',
            fontSize: 16,
            fontFamily: 'PoetsenOne-Regular',
            marginLeft: 10,
          }}
        >
          {t('readAndAccept')}
        </Text>
        <Text
          style={{
            color: '#F5B800',
            fontSize: 16,
            textDecorationLine: 'underline',
            fontFamily: 'PoetsenOne-Regular',
            marginLeft: 5,
          }}
          onPress={() => setModalVisible(true)}
        >
          {t('termsAndConditions')}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleRegisterPress}
        disabled={isDisabled}
        style={{
          backgroundColor: isDisabled ? '#D3D3D3' : '#F5B800',
          paddingVertical: 10,
          paddingHorizontal: 30,
          borderRadius: 18,
          alignItems: 'center',
          marginBottom: 15,
        }}
      >
        <Text
          style={{
            color: isDisabled ? '#A9A9A9' : '#131313',
            fontSize: 16,
            fontFamily: 'PoetsenOne-Regular',
          }}
        >
          {t('registerButton')}
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          color: '#F5F5F5',
          fontSize: 16,
          fontFamily: 'PoetsenOne-Regular',
        }}
      >
        {t('alreadyHaveAccount')}
      </Text>
      <Text
        style={{
          color: '#F5B800',
          fontSize: 16,
          textDecorationLine: 'underline',
          fontFamily: 'PoetsenOne-Regular',
        }}
        onPress={() => navigation.navigate('Login')}
      >
        {t('clickableLogin')}
      </Text>

      {error ? (
        <Text
          style={{
            color: 'red',
            marginTop: 15,
            fontFamily: 'PoetsenOne-Regular',
          }}
        >
          {error}
        </Text>
      ) : null}

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
            <Text
              style={{
                fontFamily: 'PoetsenOne-Regular',
                marginBottom: 20,
                color: '#F5F5F5',
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
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
                  fontFamily: 'PoetsenOne-Regular',
                }}
              >
                {t('close')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default RegisterForm
