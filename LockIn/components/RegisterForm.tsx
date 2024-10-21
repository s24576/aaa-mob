import { View, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { RegisterScreenProps } from '../App'
import { useTranslation } from 'react-i18next'

const RegisterForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigation = useNavigation<RegisterScreenProps['navigation']>()

  const { t } = useTranslation()

  const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error:', error.response.data)
      } else if (error.request) {
        console.error('Error:', error.request)
      } else {
        console.error('Error:', error.message)
      }
    } else if (error instanceof Error) {
      console.error('Unexpected Error:', error.message)
    } else {
      console.error('Unknown Error:', error)
    }
  }

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      console.error('Passwords do not match')
      return
    }

    try {
      console.log('Backend Address:', BACKEND_ADDRESS)
      await axios.post(
        `${BACKEND_ADDRESS}/user/register`,
        { username, password },
        { headers: { 'Accept-Language': 'en' } }
      )

      // After successful registration, navigate to the login screen
      navigation.navigate('Login')
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <View>
      <TextInput
        placeholder={t('usernameInput')}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder={t('passwordInput')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder={t('confirmPasswordInput')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title={t('registerButton')} onPress={handleRegister} />
      <Button
        title={t('toLoginButton')}
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  )
}

export default RegisterForm
