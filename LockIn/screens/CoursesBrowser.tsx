import { View } from 'react-native'
import React from 'react'
import CoursesBrowserPage from '../components/CoursesBrowserPage'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'

type CoursesBrowserProps = NativeStackScreenProps<
  RootStackParamList,
  'CoursesBrowser'
>

const CoursesBrowser: React.FC<CoursesBrowserProps> = ({
  navigation,
  route,
}) => {
  return (
    <View>
      <CoursesBrowserPage navigation={navigation} route={route} />
    </View>
  )
}

export default CoursesBrowser
