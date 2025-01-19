import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getCoursePreviewById } from '../api/course/getCoursePreviewById'
import YoutubePlayer from 'react-native-youtube-iframe'
import { getCourseById } from '../api/course/getCourseById'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'
import { FontAwesome } from '@expo/vector-icons'
import { react } from '../api/comments/react'
import { getComments } from '../api/comments/getComments'
import { addComment, addReply } from '../api/comments/addComment'
import { deleteComment } from '../api/comments/deleteComment'
import { getResponses } from '../api/comments/getResponses'
import { getUserData } from '../api/user/getUserData'

const CourseDetailsPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const route = useRoute()
  const { courseId } = route.params as { courseId: string }
  const queryClient = useQueryClient()
  const { userData, setUserData } = useContext(UserContext) as UserContextType
  const [ownsCourse, setOwnsCourse] = useState(true)
  const [showPurchaseMessage, setShowPurchaseMessage] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({})
  const [responses, setResponses] = useState<{ [key: string]: any[] }>({})

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
    data: comments,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ['comments', courseId],
    queryFn: () => getComments(courseId, { size: 10 }),
    enabled: !!courseId,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData()
        setUserData(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [])

  const handleVideoClick = (link: string) => {
    if (ownsCourse) {
      setSelectedVideo(link)
    } else {
      setShowPurchaseMessage(true)
      setTimeout(() => setShowPurchaseMessage(false), 3000)
    }
  }
  useEffect(() => {
    if (comments?.content?.length) {
      comments.content.forEach((comment: any) => {
        getResponses(comment._id, { size: 5 }).then((data) => {
          setResponses((prev) => ({ ...prev, [comment._id]: data.content }))
        })
      })
    }
  }, [comments])

  const mutation = useMutation({
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

  const responseMutation = useMutation({
    mutationFn: ({
      responseId,
      value,
    }: {
      responseId: string
      value: boolean
    }) => react(responseId, value),
    onSuccess: (_, { responseId }) => {
      const parentCommentId = Object.keys(responses).find((key) =>
        responses[key]?.some((response) => response._id === responseId)
      )
      if (parentCommentId) {
        getResponses(parentCommentId, { size: 5 }).then((data) => {
          setResponses((prev) => ({ ...prev, [parentCommentId]: data.content }))
        })
      }
    },
  })

  const addCommentMutation = useMutation({
    mutationFn: (comment: any) => addComment(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', courseId] })
      setNewComment('')
    },
  })

  const addReplyMutation = useMutation({
    mutationFn: ({ commentId, reply }: { commentId: string; reply: any }) =>
      addReply(commentId, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', courseId] })
      setNewComment('')
      setReplyingTo(null)
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', courseId] })
    },
  })

  const deleteResponseMutation = useMutation({
    mutationFn: (responseId: string) => deleteComment(responseId),
    onSuccess: (_, responseId) => {
      const parentCommentId = Object.keys(responses).find((key) =>
        responses[key]?.some((response) => response._id === responseId)
      )
      if (parentCommentId) {
        setResponses((prev) => ({
          ...prev,
          [parentCommentId]: prev[parentCommentId].filter(
            (response) => response._id !== responseId
          ),
        }))
      }
    },
  })

  const handleLike = () => {
    mutation.mutate({ objectId: courseId, value: true })
  }

  const handleDislike = () => {
    mutation.mutate({ objectId: courseId, value: false })
  }

  const handleCommentLike = (commentId: string) => {
    commentMutation.mutate({ commentId, value: true })
  }

  const handleCommentDislike = (commentId: string) => {
    commentMutation.mutate({ commentId, value: false })
  }

  const handleResponseLike = (responseId: string) => {
    responseMutation.mutate({ responseId, value: true })
  }

  const handleResponseDislike = (responseId: string) => {
    responseMutation.mutate({ responseId, value: false })
  }

  const handleAddComment = () => {
    const commentPayload = {
      objectId: courseId,
      comment: newComment,
      username: username,
      timestamp: Date.now(),
    }
    addCommentMutation.mutate(commentPayload)
  }

  const handleAddReply = (commentId: string) => {
    const replyPayload = {
      objectId: courseId,
      comment: replyTexts[commentId],
      username: username,
      timestamp: Date.now(),
    }
    addReplyMutation.mutate(
      { commentId, reply: replyPayload },
      {
        onSuccess: () => {
          setReplyTexts((prev) => ({ ...prev, [commentId]: '' }))
        },
      }
    )
  }

  const handleReplyTextChange = (commentId: string, text: string) => {
    setReplyTexts((prev) => ({ ...prev, [commentId]: text }))
  }

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId)
  }

  const handleDeleteResponse = (responseId: string) => {
    deleteResponseMutation.mutate(responseId)
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

  if (!userData) {
    return <Text className="text-bialas font-chewy">Loading...</Text>
  }

  const { username } = userData

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

      <View className="flex-row justify-center space-x-4 mt-2 mb-4">
        <TouchableOpacity
          onPress={handleLike}
          className="py-2 px-6 flex-row items-center"
        >
          <Text className="text-zoltek font-chewy text-lg mr-2">👍</Text>
          <Text className="text-zoltek font-chewy text-lg">
            {course.likesCount || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDislike}
          className="py-2 px-6 flex-row items-center"
        >
          <Text className="text-zoltek font-chewy text-lg mr-2">👎</Text>
          <Text className="text-zoltek font-chewy text-lg">
            {course.dislikesCount || 0}
          </Text>
        </TouchableOpacity>
      </View>
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
      <View className="mt-4 mb-6 px-4">
        <Text className="text-xl text-bialas font-chewy mb-4">Comments</Text>

        <View className="bg-wegielek border border-zoltek rounded-lg mb-4 p-3">
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder={replyingTo ? 'Add a reply' : 'Add a comment'}
            placeholderTextColor="#A9A9A9"
            className="text-bialas font-chewy mb-3"
          />
          <TouchableOpacity
            onPress={
              replyingTo ? () => handleAddReply(replyingTo) : handleAddComment
            }
            className="bg-zoltek py-2 px-4 rounded-lg items-center"
          >
            <Text className="text-wegielek font-chewy">
              {replyingTo ? 'Submit Reply' : 'Submit Comment'}
            </Text>
          </TouchableOpacity>
        </View>

        {comments?.content.length > 0 ? (
          comments.content.map((comment: any) => (
            <View
              key={comment._id}
              className="bg-wegielek border border-zoltek rounded-lg mb-4 p-3"
            >
              <Text className="text-zoltek font-chewy text-lg mb-1">
                {comment.username}
              </Text>
              <Text className="text-bialas font-chewy mb-3">
                {comment.comment}
              </Text>

              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => handleCommentLike(comment._id)}
                  >
                    <Text className="text-zoltek font-chewy">
                      👍 {comment.likesCount}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleCommentDislike(comment._id)}
                  >
                    <Text className="text-zoltek font-chewy">
                      👎 {comment.dislikesCount}
                    </Text>
                  </TouchableOpacity>
                </View>

                {comment.username === username && (
                  <TouchableOpacity
                    onPress={() => handleDeleteComment(comment._id)}
                    className="bg-red-500 py-2 px-4 rounded-lg"
                  >
                    <Text className="text-wegielek font-chewy">Delete</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View className="border-t border-zoltek pt-3">
                <TextInput
                  value={replyTexts[comment._id] || ''}
                  onChangeText={(text) =>
                    handleReplyTextChange(comment._id, text)
                  }
                  placeholder="Add a reply"
                  placeholderTextColor="#A9A9A9"
                  className="text-bialas font-chewy mb-3"
                />
                <TouchableOpacity
                  onPress={() => handleAddReply(comment._id)}
                  className="bg-zoltek py-2 px-4 rounded-lg items-center"
                >
                  <Text className="text-wegielek font-chewy">Submit Reply</Text>
                </TouchableOpacity>
              </View>

              {responses[comment._id]?.length > 0 && (
                <View className="mt-3 pl-4 border-l-2 border-zoltek">
                  <Text className="text-zoltek font-chewy text-lg mb-2">
                    Responses:
                  </Text>
                  {responses[comment._id].map((response: any) => (
                    <View
                      key={response._id}
                      className="bg-wegielek border-b border-zoltek rounded-lg mb-2 p-3"
                    >
                      <Text className="text-zoltek font-chewy">
                        {response.username}
                      </Text>
                      <Text className="text-bialas font-chewy mb-2">
                        {response.comment}
                      </Text>

                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                          <TouchableOpacity
                            onPress={() => handleResponseLike(response._id)}
                          >
                            <Text className="text-zoltek font-chewy">
                              👍 {response.likesCount}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleResponseDislike(response._id)}
                          >
                            <Text className="text-zoltek font-chewy">
                              👎 {response.dislikesCount}
                            </Text>
                          </TouchableOpacity>
                        </View>

                        {response.username === username && (
                          <TouchableOpacity
                            onPress={() => handleDeleteResponse(response._id)}
                            className="bg-red-500 py-2 px-4 rounded-lg"
                          >
                            <Text className="text-wegielek font-chewy">
                              Delete
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          <Text className="text-bialas font-chewy text-center">
            No comments yet
          </Text>
        )}
      </View>
    </ScrollView>
  )
}

export default CourseDetailsPage
