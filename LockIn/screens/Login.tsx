import { View, Text } from 'react-native'
import React from 'react'
import LoginForm from '../components/LoginForm'
import { styled } from 'nativewind'

const StyledView = styled(View)

const Login = () => {
  return (
    <StyledView className="flex-1 bg-pink-500">
      <LoginForm />
    </StyledView>
  )
}

export default Login
