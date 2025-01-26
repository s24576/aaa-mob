import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import React from 'react'
import { getCourses } from '../api/course/getCourses'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { useQuery } from '@tanstack/react-query'
import styles from '../styles/BrowserStyles'
import { useTranslation } from 'react-i18next'

type CoursesBrowserProps = NativeStackScreenProps<
  RootStackParamList,
  'CoursesBrowser'
>
type CourseItem = {
  _id: string
  picture: string | null
  title: string
  description: string
  price: number
  username: string
}

const CoursesBrowserPage = ({ navigation, route }: CoursesBrowserProps) => {
  const { t } = useTranslation()
  const { data, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })

  if (isLoading) {
    return (
      <View className="bg-wegielek">
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="justify-center items-center">
        <Text className="text-bialas font-chewy">
          {t('errorFetchingCourses')}: {error.message}
        </Text>
      </View>
    )
  }

  const courses: CourseItem[] = data?.content || []

  const renderCourse = ({ item }: { item: CourseItem }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('CourseDetails', { courseId: item._id })
      }
      style={styles.courseCard}
    >
      {item.picture && (
        <Image
          source={{ uri: item.picture }}
          style={styles.courseThumbnail}
          resizeMode="cover"
        />
      )}
      <Text style={styles.courseTitle}>{item.title}</Text>
      <Text style={styles.courseDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.courseAuthor}>
        {t('author')}: {item.username}
      </Text>
      <Text style={styles.coursePrice}>{item.price} EUR</Text>
    </TouchableOpacity>
  )

  return (
    <View>
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={renderCourse}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  )
}

export default CoursesBrowserPage
