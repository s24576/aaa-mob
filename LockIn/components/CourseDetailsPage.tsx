import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
import { addComment } from '../api/comments/addComment'

const CourseDetailsPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const route = useRoute()
  const { courseId } = route.params as { courseId: string }
  const queryClient = useQueryClient()
  const { userData } = useContext(UserContext) as UserContextType
  const [profileImages, setProfileImages] = useState<{
    [key: string]: string | null
  }>({})
  const [ownsCourse, setOwnsCourse] = useState(true)
  const [newComment, setNewComment] = useState('')
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

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ['comments', courseId],
    queryFn: () => getComments(courseId, { page: 0, size: 10 }),
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

  const addCommentMutation = useMutation({
    mutationFn: (comment: any) => addComment(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', courseId] })
      setNewComment('')
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

  const handleAddComment = () => {
    const commentPayload = {
      objectId: courseId,
      comment: newComment,
      username: userData.username,
      timestamp: Date.now(),
    }
    addCommentMutation.mutate(commentPayload)
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

  const handleVideoClick = (link: string) => {
    if (ownsCourse) {
      setSelectedVideo(link)
    } else {
      setShowPurchaseMessage(true)
      setTimeout(() => setShowPurchaseMessage(false), 3000)
    }
  }

  if (isCourseLoading || isCommentsLoading) {
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
      <View className="mt-4 px-4">
        <Text className="text-xl font-bold text-white text-center">
          Comments
        </Text>
        {commentsData.content.length === 0 ? (
          <Text className="text-white text-center">No comments yet.</Text>
        ) : (
          commentsData.content.map(
            (comment: {
              _id: string
              username: string
              comment: string
              likesCount: number
              dislikesCount: number
            }) => (
              <View
                key={comment._id}
                className="flex-row items-center pb-2 px-4"
              >
                <Image
                  source={{ uri: profileImages[comment.username] }}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <View className="flex-1">
                  <Text className="text-lg text-[#F5F5F5]">
                    {comment.username}
                  </Text>
                  <Text className="text-white">{comment.comment}</Text>
                  <View className="flex-row justify-center mt-2">
                    <TouchableOpacity
                      onPress={() => handleCommentLike(comment._id)}
                      className="bg-[#F5F5F5] p-2 rounded m-2 flex-row items-center"
                    >
                      <FontAwesome
                        name="thumbs-up"
                        size={24}
                        color="[#131313]"
                      />
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
          )
        )}
        {ownsCourse && (
          <View className="mt-4 pb-2">
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment"
              className="bg-white p-2 rounded"
            />
            <TouchableOpacity
              onPress={handleAddComment}
              className="bg-[#F5B800] p-2 rounded mt-2"
            >
              <Text className="text-center text-[#131313]">Submit Comment</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default CourseDetailsPage
