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
          Error fetching courses: {error.message}
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
    >
      <View className="p-4 border-b border-gray-300">
        {item.picture && (
          <Image source={{ uri: item.picture }} className="w-full h-40 mb-2" />
        )}
        <Text className="text-bialas font-chewy">{item.title}</Text>
        <Text className="text-bialas font-chewy">{item.description}</Text>
        <Text className="text-bialas font-chewy">Price: {item.price}</Text>
        <Text className="text-bialas font-chewy">By: {item.username}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View>
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={renderCourse}
      />
    </View>
  )
}

export default CoursesBrowserPage
