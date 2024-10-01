import { View, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  return (
    <View>
      {/* <Image /> */}
      <View>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        ></TextInput>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        ></TextInput>
        <Button title="Login" />
        <Button
          title="Create Account"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
};

export default LoginForm;
