import React, { useContext } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../context/UserContext'
import { MatchDetailsScreenProps } from '../App'
import { UserContextType } from '../types/local/userContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from '../styles/BrowserStyles'
import { useTranslation } from 'react-i18next'

const HomePage = () => {
  const { userData, setUserData } = useContext(UserContext) as UserContextType
  const navigation = useNavigation<MatchDetailsScreenProps['navigation']>()
  const { t } = useTranslation()
  const handleLogout = async () => {
    //remove in production
    await AsyncStorage.removeItem('token')
    setUserData(null)
  }

  return (
    <ScrollView>
      <View style={styles.homeContainer}>
        {userData && (
          <Text style={styles.welcomeHeader}>
            {t('welcome')} {userData._id}!
          </Text>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate('BuildsBrowser')}
          style={styles.tileButton}
        >
          <ImageBackground
            source={{
              uri: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ornn_0.jpg',
            }}
            style={styles.backgroundImage}
          >
            <Text style={styles.tileButtonText}>{t('buildsBrowser')}</Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Duos')}
          style={styles.tileButton}
        >
          <ImageBackground
            source={{
              uri: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lulu_37.jpg',
            }}
            style={styles.backgroundImage}
          >
            <Text style={styles.tileButtonText}>{t('duos')}</Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CoursesBrowser')}
          style={styles.tileButton}
        >
          <ImageBackground
            source={{
              uri: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ryze_5.jpg',
            }}
            style={styles.backgroundImage}
          >
            <Text style={styles.tileButtonText}>{t('courses')}</Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.tileButton}>
          <ImageBackground
            source={{
              uri: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_9.jpg',
            }}
            style={styles.backgroundImage}
            imageStyle={{ resizeMode: 'cover' }}
          >
            <Text style={styles.tileButtonText}>{t('logout')}</Text>
          </ImageBackground>
        </TouchableOpacity>
        <Text style={styles.welcomeText}>{t('welcomeMessage')}</Text>
        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
  )
}

export default HomePage
