import React, { useState, useEffect } from 'react'
import { Button } from 'react-native'
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
    <Button onPress={toggleLanguage} title={language === 'pl' ? 'EN' : 'PL'} />
  )
}

export default LanguageToggleButton
