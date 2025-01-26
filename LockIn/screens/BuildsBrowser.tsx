import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import BuildsBrowserPage from '../components/BuildsBrowserPage'
import MyBuildsPage from '../components/MyBuildsPage'
import SavedBuildsPage from '../components/SavedBuildsPage'
import { useTranslation } from 'react-i18next'

const CustomButton = ({
  title,
  onPress,
  style,
  textStyle,
}: {
  title: string
  onPress: () => void
  style?: any
  textStyle?: any
}) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <Text style={textStyle}>{title}</Text>
  </TouchableOpacity>
)

const Home = () => {
  const [currentPage, setCurrentPage] = useState('all')
  const { t } = useTranslation()

  return (
    <View style={styles.buttonContainer}>
      <View>
        <CustomButton
          title={t('showAllBuilds')}
          onPress={() => setCurrentPage('all')}
          style={styles.customButton}
          textStyle={styles.customButtonText}
        />
        <CustomButton
          title={t('showMyBuilds')}
          onPress={() => setCurrentPage('my')}
          style={styles.customButton}
          textStyle={styles.customButtonText}
        />
        <CustomButton
          title={t('showSavedBuilds')}
          onPress={() => setCurrentPage('saved')}
          style={styles.customButton}
          textStyle={styles.customButtonText}
        />
      </View>
      {currentPage === 'all' && <BuildsBrowserPage />}
      {currentPage === 'my' && <MyBuildsPage />}
      {currentPage === 'saved' && <SavedBuildsPage />}
    </View>
  )
}

const styles = StyleSheet.create({
  customButton: {
    backgroundColor: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '85%',
  },
  customButtonText: {
    color: '#131313',
    fontSize: 16,
    fontFamily: 'PoetsenOne-Regular',
    textAlign: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Home
