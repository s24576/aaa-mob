import EvilIcons from '@expo/vector-icons/EvilIcons'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Button,
  Modal,
} from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { LoginScreenProps } from '../App'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'
import { useTranslation } from 'react-i18next'
import { handleLogin } from '../api/user/login'
import { handleResetPassword } from '../api/user/resetPassword'

const LoginForm = () => {
  const [username, setUsername] = useState('Test1234')
  const [password, setPassword] = useState('Test1234')
  const [error, setError] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetError, setResetError] = useState('')
  const navigation = useNavigation<LoginScreenProps['navigation']>()
  const { t } = useTranslation()
  const { setUserData } = useContext(UserContext) as UserContextType

  const isDisabled = !username.trim() || !password.trim()

  const handleAutoComplete = (usernameValue: string, passwordValue: string) => {
    setUsername(usernameValue)
    setPassword(passwordValue)
    handleLogin(usernameValue, passwordValue, setUserData, navigation, setError)
  }

  const handleResetPasswordPress = async () => {
    try {
      await handleResetPassword(resetEmail, setResetError)
      setModalVisible(false)
    } catch (err) {
      setResetError(err.message)
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
        placeholder={t('usernameInput')}
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
          paddingLeft: 10,
        }}
      />
      <TextInput
        placeholder={t('passwordInput')}
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
          marginBottom: 30,
          fontFamily: 'Chewy-Regular',
          paddingLeft: 10,
        }}
      />

      <Text
        style={{
          color: '#F5F5F5',
          fontSize: 16,
          fontFamily: 'Chewy-Regular',
          textDecorationLine: 'underline',
          marginBottom: 15,
        }}
        onPress={() => setModalVisible(true)}
      >
        {t('forgotPassword')}
      </Text>

      <TouchableOpacity
        onPress={() =>
          handleLogin(username, password, setUserData, navigation, setError)
        }
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
            fontFamily: 'Chewy-Regular',
          }}
        >
          {t('loginButton')}
        </Text>
      </TouchableOpacity>

      <Text
        style={{ color: '#F5F5F5', fontSize: 16, fontFamily: 'Chewy-Regular' }}
      >
        {t('noAccount')}
      </Text>
      <Text
        style={{
          color: '#F5B800',
          fontSize: 16,
          textDecorationLine: 'underline',
          fontFamily: 'Chewy-Regular',
        }}
        onPress={() => navigation.navigate('Register')}
      >
        {t('clickableRegister')}
      </Text>

      {error ? (
        <Text
          style={{ color: 'red', marginTop: 15, fontFamily: 'Chewy-Regular' }}
        >
          {error}
        </Text>
      ) : null}

      <Button
        title="Test1234"
        onPress={() => handleAutoComplete('Test1234', 'Test1234')}
      />
      <Button
        title="test500"
        onPress={() => handleAutoComplete('test500', 'test500')}
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
            <TextInput
              placeholder={t('emailPlaceholder')}
              placeholderTextColor="#F5F5F5"
              value={resetEmail}
              onChangeText={setResetEmail}
              style={{
                borderWidth: 1,
                borderColor: '#F5B800',
                color: '#F5F5F5',
                width: '100%',
                borderRadius: 12,
                marginBottom: 10,
                fontFamily: 'Chewy-Regular',
                paddingLeft: 10,
              }}
            />
            {resetError ? (
              <Text
                style={{
                  color: 'red',
                  marginBottom: 10,
                  fontFamily: 'Chewy-Regular',
                }}
              >
                {resetError}
              </Text>
            ) : null}
            <TouchableOpacity
              onPress={handleResetPasswordPress}
              style={{
                backgroundColor: '#F5B800',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 18,
                alignItems: 'center',
                marginBottom: 15,
              }}
            >
              {/* <Text
                style={{
                  color: '#131313',
                  fontSize: 16,
                  fontFamily: 'Chewy-Regular',
                }}
              >
                {t('resetPassword')}
              </Text> */}
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
                  fontFamily: 'Chewy-Regular',
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

export default LoginForm
