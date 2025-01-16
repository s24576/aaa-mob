import React, { useState } from 'react'
import { View, Button, StyleSheet } from 'react-native'
import HomePage from '../components/HomePage'
import LockInAccountSearch from '../components/LockInAccountSearch'
import RiotSearchPage from '../components/RiotSearchPage'

const Home = () => {
  const [showLockInSearch, setShowLockInSearch] = useState(true)

  return (
    <View style={styles.container}>
      <Button
        title={showLockInSearch ? 'Szukaj konta Riot' : 'Szukaj konta LockIn'}
        onPress={() => setShowLockInSearch(!showLockInSearch)}
      />
      {showLockInSearch ? <LockInAccountSearch /> : <RiotSearchPage />}
      <HomePage />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
})

export default Home
