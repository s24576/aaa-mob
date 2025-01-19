import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getCoursePreviewById } from '../api/course/getCoursePreviewById'
import YoutubePlayer from 'react-native-youtube-iframe'
import { getCourseById } from '../api/course/getCourseById'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'
import { FontAwesome } from '@expo/vector-icons'

const CourseDetailsPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const route = useRoute()
  const { courseId } = route.params as { courseId: string }
  const queryClient = useQueryClient()
  const { userData } = useContext(UserContext) as UserContextType
  const [ownsCourse, setOwnsCourse] = useState(true)
  const [showPurchaseMessage, setShowPurchaseMessage] = useState(false)

  useEffect(() => {
    setSelectedVideo(null)
  }, [courseId])

  const {
    data: courseData,
    isLoading: isCourseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      try {
        const data = await getCourseById(courseId)
        setOwnsCourse(true)
        return data
      } catch (error) {
        if (error.response?.status === 403) {
          setOwnsCourse(false)
          return getCoursePreviewById(courseId)
        }
        throw error
      }
    },
    enabled: !!courseId,
  })

  const handleVideoClick = (link: string) => {
    if (ownsCourse) {
      setSelectedVideo(link)
    } else {
      setShowPurchaseMessage(true)
      setTimeout(() => setShowPurchaseMessage(false), 3000)
    }
  }

  if (isCourseLoading) {
    return (
      <View className="flex-grow justify-center items-center bg-[#131313]">
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    )
  }

  if (courseError && courseError.response?.status !== 403) {
    return (
      <View className="flex-grow justify-center items-center bg-[#131313]">
        <Text className="text-lg text-white text-center">
          Error fetching course details: {courseError.message}
        </Text>
      </View>
    )
  }

  const course = courseData

  return (
    <ScrollView className="pb-2 bg-[#131313] ">
      {course.picture && (
        <Image source={{ uri: course.picture }} className="w-full h-52" />
      )}
      <Text className="text-2xl px-4 font-bold text-white my-2 text-center">
        {course.title}
      </Text>
      <Text className="text-lg px-4 text-white my-1 text-center">
        <Text className="text-[#F5B800]">By:</Text> {course.username}
      </Text>
      <Text className="text-lg px-4 text-white my-1 text-center">
        {course.description}
      </Text>
      <View className="px-4">
        {course.films &&
          course.films.map(
            (film: { _id: string; link: string; title: string }) => (
              <TouchableOpacity
                key={film._id}
                onPress={() => handleVideoClick(film.link)}
                className="flex-grow bg-[#F5B800] text-center m-2 justify-center items-center rounded"
              >
                <Text className="text-lg font-bold text-[#131313] my-2 text-center">
                  {film.title}
                </Text>
              </TouchableOpacity>
            )
          )}
        {selectedVideo && (
          <View className="pt-2">
            <YoutubePlayer height={200} play={false} videoId={selectedVideo} />
          </View>
        )}
        {showPurchaseMessage && (
          <Text className="text-lg text-white text-center mt-2">
            To access the course, you must purchase it first.
          </Text>
        )}
      </View>
      {!ownsCourse && (
        <View className="px-4 text-center">
          <TouchableOpacity
            disabled
            className="bg-[#D3D3D3] p-2 rounded mt-2 flex-row justify-center items-center self-center"
          >
            <FontAwesome name="shopping-cart" size={24} color="#A9A9A9" />
            <Text className="text-[#A9A9A9] ml-2">{course.price} EUR</Text>
          </TouchableOpacity>
          <Text className="text-lg text-white my-1 text-center">
            To pay for this course please visit our website.
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

export default CourseDetailsPage
