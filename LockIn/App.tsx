import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Home from "./screens/Home";
import { UserContextProvider } from "./context/UserContext";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return <Layout />;
}

export const Layout = () => {
  return (
    <NavigationContainer>
      <UserContextProvider>
        <Stack.Navigator
          screenOptions={{
            headerBackVisible: false,
          }}
        >
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
          <Stack.Screen name="Register" component={Register}></Stack.Screen>
          <Stack.Screen name="Home" component={Home}></Stack.Screen>
        </Stack.Navigator>
      </UserContextProvider>
    </NavigationContainer>
  );
};

export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;
export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Register"
>;
export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;
