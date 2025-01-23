import React, { useContext, useEffect, useState } from 'react'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
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
import { Button, TouchableOpacity } from 'react-native'
import RiotProfile from './components/RiotProfilePage'
import BuildsBrowser from './screens/BuildsBrowser'
import UserProfile from './screens/UserProfile'
import Messages from './screens/Messages'
import Notifications from './screens/Notifications'
import AccountsSearch from './screens/AccountsSearch'
import { SocketProvider, useSocket } from './context/SocketProvider'
import FriendList from './screens/FriendList'
import LockInProfile from './screens/LockInProfile'
import FriendRequests from './screens/FriendRequests'
import BuildDetails from './screens/BuildDetails'
import ChatPage from './components/MessageRoomPage'
import { Provider as PaperProvider } from 'react-native-paper'
import Duos from './screens/Duos'
import CoursesBrowser from './screens/CoursesBrowser'
import CourseDetails from './screens/CourseDetails'
import { useFonts } from 'expo-font'
import Settings from './screens/Settings'
import DuoAnswers from './screens/DuoAnswer'
// import { GestureHandlerRootView } from 'react-native-gesture-handler'

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
  Duos: undefined
  CoursesBrowser: undefined
  CourseDetails: { courseId: string }
  Settings: undefined
  DuoAnswers: undefined
}

export { RootStackParamList }

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<RootStackParamList>()

const queryClient = new QueryClient()

export default function App() {
  const [fontsLoaded] = useFonts({
    'Bangers-Regular': require('./assets/fonts/Bangers-Regular.ttf'),
    'Chewy-Regular': require('./assets/fonts/Chewy-Regular.ttf'),
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
    <UserContextProvider>
      <SocketProvider>
        <PaperProvider>
          <Layout />
        </PaperProvider>
      </SocketProvider>
    </UserContextProvider>
    // </GestureHandlerRootView>
  )
}

export const Layout = () => {
  const { userData } = useContext(UserContext) as UserContextType
  const { receivedMessage } = useSocket()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [newNotifications, setNewNotifications] = useState(0)
  const navTheme = DefaultTheme
  navTheme.colors.background = '#131313'

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token')
      setIsLoggedIn(!!token)
    }
    checkLoginStatus()
  }, [userData])

  useEffect(() => {
    if (receivedMessage) {
      setNewNotifications((prev) => prev + 1)
    }
  }, [receivedMessage])

  const handleNotificationsViewed = () => {
    setNewNotifications(0)
  }

  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#131313',
            },
            headerTitle: ' LOCK.IN ',
            headerTitleStyle: {
              color: '#F5B800',
              fontFamily: 'Bangers-Regular',
              fontSize: 82,
            },
            headerTitleAlign: 'center',
            headerBackVisible: false,
          }}
        >
          {!isLoggedIn ? (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="Home" component={Home} />
            </>
          ) : (
            <>
              <Stack.Screen name="Main" options={{ headerShown: false }}>
                {() => (
                  <Tab.Navigator
                    initialRouteName="Home"
                    backBehavior="history"
                    screenOptions={({ route }) => ({
                      tabBarIcon: ({ color, size }) => {
                        let iconName

                        switch (route.name) {
                          case 'UserProfile':
                            iconName = 'person'
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
                          case 'Settings':
                            iconName = 'settings'
                            break
                          default:
                            iconName = 'ellipse'
                        }

                        return (
                          <Icon name={iconName} size={size} color={color} />
                        )
                      },
                      tabBarShowLabel: false,
                      tabBarStyle: {
                        backgroundColor: '#131313',
                        borderTopWidth: 0,
                      },
                      tabBarActiveTintColor: '#F5B800',
                      tabBarInactiveTintColor: '#F5B800',
                      headerStyle: { backgroundColor: '#131313' },
                      headerTintColor: '#fff',
                      headerTitle: ' Lock.In ',
                      headerTitleStyle: {
                        color: '#F5B800',
                        fontFamily: 'Bangers-Regular',
                        fontSize: 32,
                      },
                      headerTitleAlign: 'center',
                      headerRight: () => (
                        <>
                          {/* <LanguageToggleButton /> */}
                          {/* <Button title="Logout" onPress={handleLogout} /> */}
                        </>
                      ),
                    })}
                  >
                    <Tab.Screen name="Home" component={Home} />
                    <Tab.Screen name="UserProfile" component={UserProfile} />
                    <Tab.Screen name="Messages" component={Messages} />
                    <Tab.Screen
                      name="Notifications"
                      component={Notifications}
                      options={{
                        tabBarBadge:
                          newNotifications > 0
                            ? String(newNotifications)
                            : undefined,
                      }}
                      listeners={{
                        tabPress: handleNotificationsViewed,
                      }}
                    />
                    <Tab.Screen
                      name="Settings"
                      component={Settings}
                      options={{ tabBarButton: () => null }}
                    />
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
                    <Tab.Screen
                      name="ChatPage"
                      component={ChatPage}
                      options={{ tabBarButton: () => null }}
                    />
                    <Tab.Screen
                      name="Duos"
                      component={Duos}
                      options={{ tabBarButton: () => null }}
                    />
                    <Tab.Screen
                      name="CoursesBrowser"
                      component={CoursesBrowser}
                      options={{ tabBarButton: () => null }}
                    />
                    <Tab.Screen
                      name="CourseDetails"
                      component={CourseDetails}
                      options={{ tabBarButton: () => null }}
                    />
                    <Tab.Screen
                      name="DuoAnswers"
                      component={DuoAnswers}
                      options={{ tabBarButton: () => null }}
                    />
                  </Tab.Navigator>
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
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

export type CourseDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CourseDetails'
>

export type DuoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DuoAnswers'
>
