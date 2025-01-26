import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import HomePage from '../components/HomePage'
import LockInAccountSearch from '../components/LockInAccountSearch'
import RiotSearchPage from '../components/RiotSearchPage'
import styles from '../styles/BrowserStyles'
import { useTranslation } from 'react-i18next'

const Home = () => {
  const [showLockInSearch, setShowLockInSearch] = useState(true)
  const { t } = useTranslation()

  return (
    <View className="p-5">
      <TouchableOpacity
        onPress={() => setShowLockInSearch(!showLockInSearch)}
        style={[styles.customButton2, { marginHorizontal: 60 }]}
      >
        <Text style={styles.customButton2Text}>
          {showLockInSearch ? t('searchRiotAccount') : t('searchLockinAccount')}
        </Text>
      </TouchableOpacity>
      {showLockInSearch ? <LockInAccountSearch /> : <RiotSearchPage />}
      <HomePage />
    </View>
  )
}

export default Home
