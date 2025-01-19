import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { setLanguage } from '../translations/i18n'
import i18n from 'i18next'

const LanguageToggleButton = () => {
  const [language, setLanguageState] = useState(i18n.language)

  const toggleLanguage = () => {
    const newLanguage = language === 'pl' ? 'en' : 'pl'
    setLanguage(newLanguage)
    setLanguageState(newLanguage)
  }

  useEffect(() => {
    setLanguageState(i18n.language)
  }, [])

  return (
    <TouchableOpacity onPress={toggleLanguage}>
      <Image
        source={
          language === 'pl'
            ? require('../assets/flags/PL.png')
            : require('../assets/flags/GB.png')
        }
        style={{ width: 48, height: 48, borderRadius: 144 }}
      />
    </TouchableOpacity>
  )
}

export default LanguageToggleButton
