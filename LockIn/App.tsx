import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Ionicons'
import Login from './screens/Login'
import Register from './screens/Register'
import Home from './screens/Home'
import MatchDetails from './screens/MatchDetails'
import { UserContextProvider, UserContext } from './context/UserContext'
import { initI18n } from './translations/i18n'
import LanguageToggleButton from './components/LanguageToggleButton'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserContextType } from './types/local/userContext'
import { Button } from 'react-native'
import RiotProfile from './components/RiotProfilePage'
import BuildsBrowser from './components/BuildsBrowserPage'
import UserProfile from './screens/UserProfile'
import Messages from './screens/Messages'
import Notifications from './screens/Notifications'
import AccountsSearch from './screens/AccountsSearch'
import { SocketProvider } from './context/SocketProvider'
import FriendList from './screens/FriendList'
import LockInProfile from './screens/LockInProfile'
import FriendRequests from './screens/FriendRequests'
import BuildDetails from './screens/BuildDetails'
import ChatPage from './components/MessageRoomPage'

initI18n()

type RootStackParamList = {
  Login: undefined
  Register: undefined
  Home: undefined
  RiotSearch: undefined
  RiotProfile: { server?: string; tag?: string; name?: string; puuid?: string }
  MatchDetails: { matchId: string }
  UserProfile: undefined
  Main: undefined
  Messages: undefined
  Notifications: undefined
  Search: undefined
  BuildsBrowser: undefined
  FriendList: undefined
  LockInProfile: { username: string }
  FriendRequests: undefined
  BuildDetails: { buildId: string }
  ChatPage: { chatId: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<RootStackParamList>()

const queryClient = new QueryClient()

export default function App() {
  return (
    <UserContextProvider>
      <SocketProvider>
        <Layout />
      </SocketProvider>
    </UserContextProvider>
  )
}

export const Layout = () => {
  const { userData } = useContext(UserContext) as UserContextType
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token')
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
          <Stack.Navigator>
            <Stack.Screen name="Main" options={{ headerShown: false }}>
              {() => (
                <Tab.Navigator
                  screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                      let iconName

                      switch (route.name) {
                        case 'UserProfile':
                          iconName = 'person'
                          break
                        case 'Search':
                          iconName = 'search'
                          break
                        case 'Home':
                          iconName = 'home'
                          break
                        case 'Messages':
                          iconName = 'chatbubbles'
                          break
                        case 'Notifications':
                          iconName = 'notifications'
                          break
                        default:
                          iconName = 'ellipse'
                      }

                      return <Icon name={iconName} size={size} color={color} />
                    },
                    headerRight: () => (
                      <>
                        <LanguageToggleButton />
                        <Button title="Logout" onPress={handleLogout} />
                      </>
                    ),
                  })}
                >
                  <Tab.Screen name="UserProfile" component={UserProfile} />
                  <Tab.Screen name="Search" component={AccountsSearch} />
                  <Tab.Screen name="Home" component={Home} />
                  <Tab.Screen name="Messages" component={Messages} />
                  <Tab.Screen name="Notifications" component={Notifications} />
                  <Tab.Screen
                    name="RiotProfile"
                    component={RiotProfile}
                    options={{ tabBarButton: () => null }}
                  />
                  <Tab.Screen
                    name="MatchDetails"
                    component={MatchDetails}
                    options={{ tabBarButton: () => null }}
                  />
                  <Tab.Screen
                    name="BuildsBrowser"
                    component={BuildsBrowser}
                    options={{ tabBarButton: () => null }}
                  />
                  <Tab.Screen
                    name="FriendList"
                    component={FriendList}
                    options={{ tabBarButton: () => null }}
                  />
                  <Tab.Screen
                    name="LockInProfile"
                    component={LockInProfile}
                    options={{ tabBarButton: () => null }}
                  />
                  <Tab.Screen
                    name="FriendRequests"
                    component={FriendRequests}
                    options={{ tabBarButton: () => null }}
                  />
                  <Tab.Screen
                    name="BuildDetails"
                    component={BuildDetails}
                    options={{ tabBarButton: () => null }}
                  />
                </Tab.Navigator>
              )}
            </Stack.Screen>
            <Stack.Screen
              name="MatchDetails"
              component={MatchDetails}
              options={{
                tabBarStyle: { display: 'none' },
                unmountOnBlur: true,
              }}
            />
            <Stack.Screen
              name="BuildDetails"
              component={BuildDetails}
              options={{
                tabBarStyle: { display: 'none' },
                unmountOnBlur: true,
              }}
            />
            <Stack.Screen
              name="ChatPage"
              component={ChatPage}
              options={{
                tabBarStyle: { display: 'none' },
                unmountOnBlur: true,
              }}
            />
          </Stack.Navigator>
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
  'RiotProfile'
>
export type MatchDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MatchDetails'
>

export type BuildDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BuildDetails'
>

export type ChatPageScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ChatPage'
>
