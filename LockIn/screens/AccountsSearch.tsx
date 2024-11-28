import React, { useState } from 'react'
import { View, Button, StyleSheet } from 'react-native'
import LockInAccountSearch from '../components/LockInAccountSearch'
import RiotSearchPage from '../components/RiotSearchPage'

const AccountsSearch: React.FC = () => {
  const [showLockInSearch, setShowLockInSearch] = useState(true)

  return (
    <View style={styles.container}>
      <Button
        title={showLockInSearch ? 'Szukaj konta Riot' : 'Szukaj konta LockIn'}
        onPress={() => setShowLockInSearch(!showLockInSearch)}
      />
      {showLockInSearch ? <LockInAccountSearch /> : <RiotSearchPage />}
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
