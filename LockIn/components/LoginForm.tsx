import { View, TextInput, Button } from 'react-native'
import React, { useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { LoginScreenProps } from '../App'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'
import { useTranslation } from 'react-i18next'
import { handleLogin } from '../api/user/login'

const LoginForm = () => {
  const [username, setUsername] = useState('Test1234')
  const [password, setPassword] = useState('Test1234')
  const navigation = useNavigation<LoginScreenProps['navigation']>()

  const { t } = useTranslation()

  const { setUserData } = useContext(UserContext) as UserContextType

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
      <Button
        title={t('loginButton')}
        onPress={() => handleLogin(username, password, setUserData, navigation)}
      />
      <Button
        title={t('toRegistrerButton')}
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  )
}

export default LoginForm
