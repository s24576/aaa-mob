import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const AccountsSearch: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Accounts Search Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
})

export default AccountsSearch
