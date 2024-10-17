import { View, TextInput, Button } from 'react-native'
import React, { useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios, { AxiosError } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LoginScreenProps } from '../App'
import { UserData, Friend, UserContextType } from '../types/local/userContext'
import { UserContext } from '../context/UserContext'
import { useTranslation } from 'react-i18next'
import { encryptToken } from '../security/TokenEncryption' // Update the path as necessary
import { decryptToken } from '../security/TokenDecryption' // Update the path as necessary

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation<LoginScreenProps['navigation']>()

  const { t } = useTranslation()

  const { setUserData } = useContext(UserContext) as UserContextType

  const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS

  const getUserData = async (token: string) => {
    try {
      const response = await axios.get(`${BACKEND_ADDRESS}/user/getUserData`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': 'en',
        },
      })
      console.log('User Data:', response.data)

      // Parse the user data and set it in the context
      const userData = new UserData(
        response.data._id,
        response.data.profileIcon,
        response.data.bio,
        response.data.friends.map(
          (friend: any) =>
            new Friend(friend._id, friend.username, friend.username2)
        ),
        response.data.username
      )
      setUserData(userData)
    } catch (error) {
      handleError(error)
    }
  }

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

  const handleLogin = async () => {
    try {
      console.log('Backend Address:', BACKEND_ADDRESS)
      const response = await axios.post(
        `${BACKEND_ADDRESS}/user/login`,
        { username, password },
        { headers: { 'Accept-Language': 'en' } }
      )

      const token: string = response.data
      const encryptedToken = encryptToken(token) // Encrypt the token before storing
      await AsyncStorage.setItem('token', encryptedToken)
      console.log('Encrypted Token:', encryptedToken)

      getUserData(token) // Use the raw token to get user data

      navigation.navigate('Home')
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <View>
      <TextInput
        placeholder={t('loginForm.usernameInput')}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder={t('loginForm.passwordInput')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={t('loginForm.loginButton')} onPress={handleLogin} />
      <Button
        title={t('loginForm.toRegistrerButton')}
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  )
}

export default LoginForm
