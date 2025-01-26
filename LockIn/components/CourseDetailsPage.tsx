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
  StyleSheet,
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
import { useTranslation } from 'react-i18next'

const CourseDetailsPage = () => {
  const { t } = useTranslation()
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
          {t('errorFetchingCourse')}: {courseError.message}
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
    <ScrollView style={styles.courseDetailsScroll}>
      <View style={styles.courseDetailHeaderContainer}>
        {course.picture && (
          <Image
            source={{ uri: course.picture }}
            style={styles.courseDetailImage}
          />
        )}
        <View style={styles.courseDetailTitleContainer}>
          <Text style={styles.courseDetailTitle}>{course.title}</Text>
          <Text style={styles.courseDetailAuthor}>
            {t('author')}: {course.username}
          </Text>
          <Text style={styles.courseDetailDescription}>
            {course.description}
          </Text>
        </View>

        <View style={styles.courseStatsContainer}>
          <TouchableOpacity onPress={handleLike} style={styles.customButton2}>
            <FontAwesome name="thumbs-up" size={24} color="#131313" />
            <Text style={styles.customButton2Text}>
              {course.likesCount || 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDislike}
            style={styles.customButton2}
          >
            <FontAwesome name="thumbs-down" size={24} color="#131313" />
            <Text style={styles.customButton2Text}>
              {course.dislikesCount || 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.courseVideosContainer}>
        {course.films &&
          course.films.map(
            (film: { _id: string; link: string; title: string }) => (
              <TouchableOpacity
                key={film._id}
                onPress={() => handleVideoClick(film.link)}
                style={styles.courseVideoButton}
              >
                <Text style={styles.courseVideoTitle}>{film.title}</Text>
                <View style={styles.courseVideoIcon}>
                  <FontAwesome name="play-circle" size={24} color="#F5B800" />
                </View>
              </TouchableOpacity>
            )
          )}

        {selectedVideo && (
          <View style={{ marginVertical: 15 }}>
            <YoutubePlayer height={200} play={false} videoId={selectedVideo} />
          </View>
        )}
      </View>

      {!ownsCourse && (
        <View style={styles.purchaseContainer}>
          <TouchableOpacity disabled style={styles.purchaseButton}>
            <FontAwesome name="shopping-cart" size={24} color="#131313" />
            <Text style={styles.purchaseButtonText}>{course.price} EUR</Text>
          </TouchableOpacity>
          <Text style={styles.purchaseMessage}>
            {t('visitWebsiteToPurchase')}
          </Text>
        </View>
      )}

      <View className="mt-4 mb-6 px-4">
        <Text className="text-xl text-bialas font-chewy mb-4">
          {t('comments')}
        </Text>

        <View className="bg-wegielek border border-zoltek rounded-lg mb-4 p-3">
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder={replyingTo ? t('addReply') : t('addComment')}
            placeholderTextColor="#A9A9A9"
            className="text-bialas font-chewy mb-3"
          />
          <TouchableOpacity
            onPress={
              replyingTo ? () => handleAddReply(replyingTo) : handleAddComment
            }
            className={`py-2 px-4 rounded-lg items-center ${
              newComment.trim() ? 'bg-zoltek' : 'bg-gray-500'
            }`}
            disabled={!newComment.trim()}
          >
            <Text className="text-wegielek font-chewy">
              {replyingTo ? t('submitReply') : t('submitComment')}
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
                    className="flex-row items-center mr-4"
                  >
                    <FontAwesome
                      name="thumbs-up"
                      size={20}
                      color="#F5B800"
                      className="mr-2"
                    />
                    <Text className="text-zoltek font-chewy ml-2">
                      {comment.likesCount}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleCommentDislike(comment._id)}
                    className="flex-row items-center"
                  >
                    <FontAwesome
                      name="thumbs-down"
                      size={20}
                      color="#F5B800"
                      className="mr-2"
                    />
                    <Text className="text-zoltek font-chewy ml-2">
                      {comment.dislikesCount}
                    </Text>
                  </TouchableOpacity>
                </View>

                {comment.username === username && (
                  <TouchableOpacity
                    onPress={() => handleDeleteComment(comment._id)}
                    className="bg-red-500 py-2 px-4 rounded-lg"
                  >
                    <Text className="text-wegielek font-chewy">
                      {t('delete')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View className="border-t border-zoltek pt-3">
                <TextInput
                  value={replyTexts[comment._id] || ''}
                  onChangeText={(text) =>
                    handleReplyTextChange(comment._id, text)
                  }
                  placeholder={t('addReply')}
                  placeholderTextColor="#A9A9A9"
                  className="text-bialas font-chewy mb-3"
                />
                <TouchableOpacity
                  onPress={() => handleAddReply(comment._id)}
                  className={`py-2 px-4 rounded-lg items-center ${
                    replyTexts[comment._id]?.trim()
                      ? 'bg-zoltek'
                      : 'bg-gray-500'
                  }`}
                  disabled={!replyTexts[comment._id]?.trim()}
                >
                  <Text className="text-wegielek font-chewy">
                    {t('submitReply')}
                  </Text>
                </TouchableOpacity>
              </View>

              {responses[comment._id]?.length > 0 && (
                <View className="mt-3 pl-4 border-l-2 border-zoltek">
                  <Text className="text-zoltek font-chewy text-lg mb-2">
                    {t('responses')}:
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
                            className="flex-row items-center mr-4"
                          >
                            <FontAwesome
                              name="thumbs-up"
                              size={20}
                              color="#F5B800"
                              className="mr-2"
                            />
                            <Text className="text-zoltek font-chewy ml-2">
                              {response.likesCount}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleResponseDislike(response._id)}
                            className="flex-row items-center"
                          >
                            <FontAwesome
                              name="thumbs-down"
                              size={20}
                              color="#F5B800"
                              className="mr-2"
                            />
                            <Text className="text-zoltek font-chewy ml-2">
                              {response.dislikesCount}
                            </Text>
                          </TouchableOpacity>
                        </View>

                        {response.username === username && (
                          <TouchableOpacity
                            onPress={() => handleDeleteResponse(response._id)}
                            className="bg-red-500 py-2 px-4 rounded-lg"
                          >
                            <Text className="text-wegielek font-chewy">
                              {t('delete')}
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
            {t('noCommentsYet')}
          </Text>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#131313',
    paddingBottom: 8,
  },
  courseHeaderImage: {
    width: '100%',
    height: 200,
  },
  courseDetailsContainer: {
    paddingHorizontal: 16,
  },
  courseDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 8,
    textAlign: 'center',
  },
  courseAuthor: {
    fontSize: 18,
    color: '#FFFFFF',
    marginVertical: 4,
    textAlign: 'center',
  },
  courseDescription: {
    fontSize: 18,
    color: '#FFFFFF',
    marginVertical: 4,
    textAlign: 'center',
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  customButton2: {
    backgroundColor: '#F5B800',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  customButton2Text: {
    color: '#131313',
    fontSize: 18,
    marginLeft: 8,
  },
  videoButton: {
    backgroundColor: '#F5B800',
    textAlign: 'center',
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    paddingVertical: 8,
  },
  videoButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#131313',
    marginRight: 8,
  },
  courseDetailsScroll: {
    backgroundColor: '#131313',
    paddingBottom: 8,
  },
  courseDetailHeaderContainer: {
    paddingHorizontal: 16,
  },
  courseDetailImage: {
    width: '100%',
    height: 200,
  },
  courseDetailTitleContainer: {
    paddingHorizontal: 16,
  },
  courseDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 8,
    textAlign: 'center',
  },
  courseDetailAuthor: {
    fontSize: 18,
    color: '#FFFFFF',
    marginVertical: 4,
    textAlign: 'center',
  },
  courseDetailDescription: {
    fontSize: 18,
    color: '#FFFFFF',
    marginVertical: 4,
    textAlign: 'center',
  },
  courseStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  courseVideosContainer: {
    paddingHorizontal: 16,
  },
  courseVideoButton: {
    backgroundColor: '#F5B800',
    textAlign: 'center',
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    paddingVertical: 8,
  },
  courseVideoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#131313',
    marginRight: 8,
  },
  courseVideoIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchaseContainer: {
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  purchaseButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    selfCenter: 'center',
  },
  purchaseButtonText: {
    color: '#A9A9A9',
    fontSize: 18,
    marginLeft: 8,
  },
  purchaseMessage: {
    fontSize: 18,
    color: '#FFFFFF',
    marginVertical: 4,
    textAlign: 'center',
  },
})

export default CourseDetailsPage
