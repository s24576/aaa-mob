import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import Login from './screens/Login'
import Register from './screens/Register'
import Home from './screens/Home'
import Profile from './screens/Profile'
import MatchDetails from './screens/MatchDetails'
import { UserContextProvider, UserContext } from './context/UserContext'
import { initI18n } from './translations/i18n'
import LanguageToggleButton from './components/LanguageToggleButton'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createDrawerNavigator } from '@react-navigation/drawer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserContextType } from './types/local/userContext'
import { Button } from 'react-native'

initI18n()

type RootStackParamList = {
  Login: undefined
  Register: undefined
  Home: undefined
  Profile: undefined
  MatchDetails: { matchId: string }
}

const Drawer = createDrawerNavigator<RootStackParamList>()
const Stack = createNativeStackNavigator<RootStackParamList>()

const queryClient = new QueryClient()

export default function App() {
  return (
    <UserContextProvider>
      <Layout />
    </UserContextProvider>
  )
}

export const Layout = () => {
  const { userData, setUserData } = useContext(UserContext) as UserContextType
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token')
      console.log('Token:', token)
      setIsLoggedIn(!!token)
    }
    checkLoginStatus()
  }, [userData])

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        {!isLoggedIn ? (
          <Stack.Navigator screenOptions={{ headerBackVisible: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Home" component={Home} />
            {/* nie usuawać home stad bo jest error*/}
          </Stack.Navigator>
        ) : (
          <Drawer.Navigator
            screenOptions={({ navigation }) => ({
              headerRight: () => (
                <>
                  <LanguageToggleButton />
                  <Button title="Logout" onPress={handleLogout} />
                </>
              ),
            })}
          >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Profile" component={Profile} />
            <Drawer.Screen
              name="MatchDetails"
              component={MatchDetails}
              options={{
                drawerLabel: () => null,
                drawerItemStyle: { height: 0 },
                unmountOnBlur: true,
              }}
            />
            {/* match details musi być na samym dole */}
          </Drawer.Navigator>
        )}
      </QueryClientProvider>
    </NavigationContainer>
  )
}

export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>
export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>

export type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Profile'
>

export type MatchDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MatchDetails'
>
