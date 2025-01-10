import React from 'react'
import { View, Text, Image, ActivityIndicator } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { getCoursePreviewById } from '../api/course/getCoursePreviewById'

const CourseDetailsPage = () => {
  const route = useRoute()
  const { courseId } = route.params as { courseId: string }

  const { data, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCoursePreviewById(courseId),
    enabled: !!courseId,
  })

  if (isLoading) {
    return (
      <View
        style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error) {
    return (
      <View
        style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text className="text-lg">
          Error fetching course details: {error.message}
        </Text>
      </View>
    )
  }

  const course = data

  return (
    <View style={{ padding: 16 }}>
      {course.picture && (
        <Image
          source={{ uri: course.picture }}
          style={{ width: '100%', height: 200 }}
        />
      )}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 8 }}>
        {course.title}
      </Text>
      <Text style={{ fontSize: 16, marginVertical: 4 }}>
        {course.description}
      </Text>
      <Text style={{ fontSize: 16, marginVertical: 4 }}>
        Price: {course.price}
      </Text>
      <Text style={{ fontSize: 16, marginVertical: 4 }}>
        By: {course.username}
      </Text>
    </View>
  )
}

export default CourseDetailsPage
