import { View, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

const RegisterForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation()

  const { t } = useTranslation()

  return (
    <View>
      {/* <Image /> */}
      <View>
        <TextInput
          placeholder={t('registerForm.usernameInput')}
          value={email}
          onChangeText={setEmail}
        ></TextInput>
        <TextInput
          placeholder={t('registerForm.passwordInput')}
          value={password}
          onChangeText={setPassword}
        ></TextInput>
        <Button title={t('registerForm.registerButton')} />
        <Button
          title={t('registerForm.toLoginButton')}
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </View>
  )
}

export default RegisterForm
