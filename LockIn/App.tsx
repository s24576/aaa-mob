import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Login from './screens/Login'
import Register from './screens/Register'
import Home from './screens/Home'
import Profile from './screens/Profile'
import MatchDetails from './screens/MatchDetails'
import DrawerOne from './screens/DrawerOne'
import DrawerTwo from './screens/DrawerTwo'
import { UserContextProvider } from './context/UserContext'
import { initI18n } from './translations/i18n'
import LanguageToggleButton from './components/LanguageToggleButton'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button } from 'react-native'

initI18n()

type RootStackParamList = {
  Login: undefined
  Register: undefined
  Home: undefined
  Profile: undefined
  MatchDetails: { matchId: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Drawer = createDrawerNavigator()

const queryClient = new QueryClient()

const StackNavigator = () => (
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      headerBackVisible: false,
      headerLeft: () => (
        <Button onPress={() => navigation.toggleDrawer()} title="Menu" />
      ),
      headerRight: () => <LanguageToggleButton />,
    })}
  >
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="MatchDetails" component={MatchDetails} />
    <Stack.Screen name="DrawerOne" component={DrawerOne} />
    <Stack.Screen name="DrawerTwo" component={DrawerTwo} />
  </Stack.Navigator>
)

const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen
      name="Home"
      component={StackNavigator}
      options={{ headerShown: false }}
    />
    <Drawer.Screen
      name="DrawerOne"
      component={DrawerOne}
      options={{ headerShown: false }}
    />
    <Drawer.Screen
      name="DrawerTwo"
      component={DrawerTwo}
      options={{ headerShown: false }}
    />
  </Drawer.Navigator>
)

export default function App() {
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <DrawerNavigator />
        </UserContextProvider>
      </QueryClientProvider>
    </NavigationContainer>
  )
}
