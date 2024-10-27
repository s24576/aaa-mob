import React from 'react'
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
import { UserContextProvider } from './context/UserContext'
import { initI18n } from './translations/i18n'
import LanguageToggleButton from './components/LanguageToggleButton'

initI18n()

type RootStackParamList = {
  Login: undefined
  Register: undefined
  Home: undefined
  Profile: undefined
  MatchDetails: { matchId: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return <Layout />
}

export const Layout = () => {
  return (
    <NavigationContainer>
      <UserContextProvider>
        <Stack.Navigator
          screenOptions={({ navigation }) => ({
            headerBackVisible: false,
            headerRight: () => <LanguageToggleButton />,
          })}
        >
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
          <Stack.Screen name="Register" component={Register}></Stack.Screen>
          <Stack.Screen name="Home" component={Home}></Stack.Screen>
          <Stack.Screen name="Profile" component={Profile}></Stack.Screen>
          <Stack.Screen
            name="MatchDetails"
            component={MatchDetails}
          ></Stack.Screen>
        </Stack.Navigator>
      </UserContextProvider>
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
