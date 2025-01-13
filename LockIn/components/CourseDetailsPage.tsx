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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCoursePreviewById } from '../api/course/getCoursePreviewById'
import YoutubePlayer from 'react-native-youtube-iframe'
import { getCourseById } from '../api/course/getCourseById'
import { getComments } from '../api/comments/getComments'
import { react } from '../api/comments/react'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'
import { FontAwesome } from '@expo/vector-icons'
import { findProfile } from '../api/profile/findProfile'

const CourseDetailsPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const route = useRoute()
  const { courseId } = route.params as { courseId: string }
  const queryClient = useQueryClient()
  const { userData } = useContext(UserContext) as UserContextType
  const [profileImages, setProfileImages] = useState<{
    [key: string]: string | null
  }>({})

  const {
    data: courseData,
    isLoading: isCourseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  })

  const {
    data: previewData,
    isLoading: isPreviewLoading,
    error: previewError,
  } = useQuery({
    queryKey: ['coursePreview', courseId],
    queryFn: () => getCoursePreviewById(courseId),
    enabled: !!courseId && courseError?.response?.status === 403,
  })

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ['comments', courseId],
    queryFn: () => getComments(courseId),
    enabled: !!courseId,
  })

  const courseMutation = useMutation({
    mutationFn: ({ objectId, value }: { objectId: string; value: boolean }) =>
      react(objectId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] })
    },
  })

  const commentMutation = useMutation({
    mutationFn: ({ commentId, value }: { commentId: string; value: boolean }) =>
      react(commentId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', courseId] })
    },
  })

  const handleCourseLike = () => {
    courseMutation.mutate({ objectId: courseId, value: true })
  }

  const handleCourseDislike = () => {
    courseMutation.mutate({ objectId: courseId, value: false })
  }

  const handleCommentLike = (commentId: string) => {
    commentMutation.mutate({ commentId, value: true })
  }

  const handleCommentDislike = (commentId: string) => {
    commentMutation.mutate({ commentId, value: false })
  }

  const getProfileImage = async (username: string) => {
    try {
      const profile = await findProfile(username)
      return profile.image
        ? `data:${profile.image.contentType};base64,${profile.image.data}`
        : null
    } catch (error) {
      console.error('Error fetching profile image:', error)
      return null
    }
  }

  useEffect(() => {
    const fetchProfileImages = async () => {
      const images: { [key: string]: string | null } = {}
      for (const comment of commentsData.content) {
        images[comment.username] = await getProfileImage(comment.username)
      }
      setProfileImages(images)
    }

    if (commentsData?.content) {
      fetchProfileImages()
    }
  }, [commentsData])

  if (
    isCourseLoading ||
    (courseError?.response?.status === 403 && isPreviewLoading) ||
    isCommentsLoading
  ) {
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

  if (commentsError) {
    return (
      <View className="flex-grow justify-center items-center bg-[#131313]">
        <Text className="text-lg text-white text-center">
          Error fetching comments: {commentsError.message}
        </Text>
      </View>
    )
  }

  const course =
    courseError?.response?.status === 403 ? previewData : courseData

  return (
    <ScrollView className="pb-2 bg-[#131313] ">
      {course.picture && (
        <Image source={{ uri: course.picture }} className="w-full h-52" />
      )}
      <Text className="text-2xl px-4 font-bold text-white my-2 text-center">
        {course.title}
      </Text>
      <Text className="text-lg px-4 text-white my-1 text-center">
        {course.description}
      </Text>
      <Text className="text-lg px-4 text-white my-1 text-center">
        <Text className="text-[#F5B800]">Price:</Text> {course.price}
      </Text>
      <Text className="text-lg px-4 text-white my-1 text-center">
        <Text className="text-[#F5B800]">By:</Text> {course.username}
      </Text>
      <View className="flex-row px-4 justify-center mt-4">
        <TouchableOpacity
          onPress={handleCourseLike}
          className="bg-[#F5F5F5] p-2 rounded m-2 flex-row items-center"
        >
          <FontAwesome name="thumbs-up" size={24} color="[#131313]" />
          <Text className="text-[#131313] ml-2">{course.likesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCourseDislike}
          className="bg-[#F5F5F5] p-2 rounded m-2 flex-row items-center"
        >
          <FontAwesome name="thumbs-down" size={24} color="[#131313]" />
          <Text className="text-[#131313] ml-2">{course.dislikesCount}</Text>
        </TouchableOpacity>
      </View>
      <View className="px-4">
        {course.films &&
          course.films.map(
            (film: { _id: string; link: string; title: string }) => (
              <TouchableOpacity
                key={film._id}
                onPress={() => setSelectedVideo(film.link)}
                className="flex-grow bg-[#F5B800] text-center p-1 m-2 justify-center items-center rounded"
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
      </View>
      <View className="mt-4 px-4">
        <Text className="text-xl font-bold text-white text-center">
          Comments
        </Text>
        {commentsData.content.map(
          (comment: {
            _id: string
            username: string
            comment: string
            likesCount: number
            dislikesCount: number
          }) => (
            <View key={comment._id} className="flex-row items-center">
              <Image
                source={{ uri: profileImages[comment.username] }}
                className="w-10 h-10 rounded-full mr-2"
              />
              <View>
                <Text className="text-lg text-[#F5F5F5]">
                  {comment.username}
                </Text>
                <Text className="text-white">{comment.comment}</Text>
                <View className="flex-row justify-center mt-2">
                  <TouchableOpacity
                    onPress={() => handleCommentLike(comment._id)}
                    className="bg-[#F5F5F5] p-2 rounded m-2 flex-row items-center"
                  >
                    <FontAwesome name="thumbs-up" size={24} color="[#131313]" />
                    <Text className="text-[#131313] ml-2">
                      {comment.likesCount}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleCommentDislike(comment._id)}
                    className="bg-[#F5F5F5] p-2 rounded m-2 flex-row items-center"
                  >
                    <FontAwesome
                      name="thumbs-down"
                      size={24}
                      color="[#131313]"
                    />
                    <Text className="text-[#131313] ml-2">
                      {comment.dislikesCount}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        )}
      </View>
    </ScrollView>
  )
}

export default CourseDetailsPage
