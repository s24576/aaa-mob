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

  const handleAutoComplete = (usernameValue: string, passwordValue: string) => {
    setUsername(usernameValue)
    setPassword(passwordValue)
    handleLogin(usernameValue, passwordValue, setUserData, navigation)
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
      <Button
        title={t('loginButton')}
        onPress={() => handleLogin(username, password, setUserData, navigation)}
      />
      <Button
        title={t('toRegistrerButton')}
        onPress={() => navigation.navigate('Register')}
      />
      <Button
        title="Test1234"
        onPress={() => handleAutoComplete('Test1234', 'Test1234')}
      />
      <Button
        title="test1000"
        onPress={() => handleAutoComplete('test1000', 'test1000')}
      />
      <Button
        title="test2000"
        onPress={() => handleAutoComplete('test2000', 'test2000')}
      />
      <Button
        title="test3000"
        onPress={() => handleAutoComplete('test3000', 'test3000')}
      />
    </View>
  )
}

export default LoginForm
