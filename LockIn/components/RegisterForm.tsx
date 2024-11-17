import { View, TextInput, Button } from 'react-native'
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
    <View>
      <TextInput
        placeholder={t('emailInput')}
        value={email}
        onChangeText={setEmail}
      />
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
      <Button
        title={t('registerButton')}
        onPress={() =>
          handleRegister(email, username, password, confirmPassword, navigation)
        }
      />
      <Button
        title={t('toLoginButton')}
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  )
}

export default RegisterForm
