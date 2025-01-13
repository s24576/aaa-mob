import EvilIcons from '@expo/vector-icons/EvilIcons'
import {
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { RegisterScreenProps } from '../App'
import { useTranslation } from 'react-i18next'
import { handleRegister } from '../api/user/register'

const RegisterForm = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigation = useNavigation<RegisterScreenProps['navigation']>()

  const { t } = useTranslation()

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
          fontFamily: 'Chewy-Regular',
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
          fontFamily: 'Chewy-Regular',
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
          fontFamily: 'Chewy-Regular',
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
          marginBottom: 30,
          fontFamily: 'Chewy-Regular',
        }}
      />
      <TouchableOpacity
        onPress={() =>
          handleRegister(email, username, password, confirmPassword, navigation)
        }
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
          {t('registerButton')}
        </Text>
      </TouchableOpacity>

      <Text
        style={{ color: '#F5F5F5', fontSize: 16, fontFamily: 'Chewy-Regular' }}
      >
        {t('alreadyHaveAccount')}
      </Text>
      <Text
        style={{
          color: '#F5B800',
          fontSize: 16,
          textDecorationLine: 'underline',
          fontFamily: 'Chewy-Regular',
        }}
        onPress={() => navigation.navigate('Login')}
      >
        {t('clickableLogin')}
      </Text>
    </ScrollView>
  )
}

export default RegisterForm
