import { View, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import BuildsBrowserPage from '../components/BuildsBrowserPage'
import MyBuildsPage from '../components/MyBuildsPage'
import SavedBuildsPage from '../components/SavedBuildsPage'

const Home = () => {
  const [currentPage, setCurrentPage] = useState('all')

  return (
    <View>
      <View>
        <Button title="Show All Builds" onPress={() => setCurrentPage('all')} />
        <Button title="Show My Builds" onPress={() => setCurrentPage('my')} />
        <Button
          title="Show Saved Builds"
          onPress={() => setCurrentPage('saved')}
        />
      </View>
      {currentPage === 'all' && <BuildsBrowserPage />}
      {currentPage === 'my' && <MyBuildsPage />}
      {currentPage === 'saved' && <SavedBuildsPage />}
    </View>
  )
}

export default Home
