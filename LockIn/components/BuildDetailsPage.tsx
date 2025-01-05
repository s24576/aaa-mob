import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Image, Button, ScrollView, TextInput } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBuildById } from '../api/build/getBuildById'
import { getVersion } from '../api/ddragon/version'
import { react } from '../api/comments/react'
import { saveBuild } from '../api/build/saveBuild'
import { getComments } from '../api/comments/getComments'
import { getResponses } from '../api/comments/getResponses'
import { addComment, addReply } from '../api/comments/addComment'
import { getUserData } from '../api/user/getUserData'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'

const BuildDetailsPage: React.FC = () => {
  const { userData, setUserData } = useContext(UserContext) as UserContextType
  const route = useRoute()
  const { buildId } = route.params as { buildId: string }
  const queryClient = useQueryClient()
  const [isSaved, setIsSaved] = useState(false)
  const [responses, setResponses] = useState<{ [key: string]: any[] }>({})
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({})

  const {
    data: build,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['build', buildId],
    queryFn: () => getBuildById(buildId),
    enabled: !!buildId,
  })

  const {
    data: version,
    isLoading: isVersionLoading,
    error: versionError,
  } = useQuery({
    queryKey: ['version'],
    queryFn: getVersion,
  })

  const {
    data: comments,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ['comments', buildId],
    queryFn: () => getComments(buildId, { size: 10 }),
    enabled: !!buildId,
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
  }, [])

  useEffect(() => {
    if (comments?.content) {
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
      queryClient.invalidateQueries({ queryKey: ['build', buildId] })
    },
  })

  const saveMutation = useMutation({
    mutationFn: ({ buildId, save }: { buildId: string; save: boolean }) =>
      saveBuild(buildId, save),
    onSuccess: () => {
      setIsSaved((prev) => !prev)
    },
  })

  const commentMutation = useMutation({
    mutationFn: ({ commentId, value }: { commentId: string; value: boolean }) =>
      react(commentId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', buildId] })
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
      queryClient.invalidateQueries({ queryKey: ['comments', buildId] })
      setNewComment('')
    },
  })

  const addReplyMutation = useMutation({
    mutationFn: ({ commentId, reply }: { commentId: string; reply: any }) =>
      addReply(commentId, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', buildId] })
      setNewComment('')
      setReplyingTo(null)
    },
  })

  const handleLike = () => {
    mutation.mutate({ objectId: buildId, value: true })
  }

  const handleDislike = () => {
    mutation.mutate({ objectId: buildId, value: false })
  }

  const handleSave = () => {
    saveMutation.mutate({ buildId, save: !isSaved })
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
      objectId: buildId,
      comment: newComment,
      username: username,
      timestamp: Date.now(),
    }
    addCommentMutation.mutate(commentPayload)
  }

  const handleAddReply = (commentId: string) => {
    const replyPayload = {
      objectId: buildId,
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

  if (isLoading || isVersionLoading || isCommentsLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    )
  }

  if (error || versionError || commentsError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {(error || versionError || commentsError)?.message}</Text>
      </View>
    )
  }

  if (!build) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No build information found.</Text>
      </View>
    )
  }

  if (!userData) {
    return <Text>Loading...</Text>
  }

  const { username } = userData

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl font-bold">{build.title}</Text>
      <Text className="text-lg mb-2">{build.description}</Text>
      <Image
        source={{
          uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${build.championId}.png`,
        }}
        className="w-24 h-24 mb-2"
      />
      <View className="flex-row mb-2">
        {[
          build.item1,
          build.item2,
          build.item3,
          build.item4,
          build.item5,
          build.item6,
        ].map((itemId, index) => (
          <Image
            key={index}
            source={{
              uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`,
            }}
            className="w-12 h-12 mr-2"
          />
        ))}
      </View>
      {build.runes && (
        <View className="mt-2">
          <View className="mt-1">
            <Text>Główna runa:</Text>
            {build.runes.runes1.length > 0 && (
              <Text className="text-sm">{build.runes.runes1[0]}</Text>
            )}
            <Text>Drugie drzewko: {build.runes.keyStone2Id}</Text>
          </View>
        </View>
      )}
      <Text>By: {build.username}</Text>
      <Text>Upvotes: {build.likesCount}</Text>
      <Text>Downvotes: {build.dislikesCount}</Text>
      <View className="flex-row mt-4">
        <Button title="Like" onPress={handleLike} />
        <Button title="Dislike" onPress={handleDislike} />
        <Button
          title={isSaved ? 'Unsave Build' : 'Save Build'}
          onPress={handleSave}
        />
      </View>
      <View className="mt-4 mb-6">
        <Text className="text-xl font-bold">Comments</Text>
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder={replyingTo ? 'Add a reply' : 'Add a comment'}
          className="border p-2 mb-2"
        />
        <Button
          title={replyingTo ? 'Submit Reply' : 'Submit Comment'}
          onPress={
            replyingTo ? () => handleAddReply(replyingTo) : handleAddComment
          }
        />
        {comments?.content.length > 0 ? (
          comments.content.map((comment: any) => (
            <View
              key={comment._id}
              className="mt-2 p-2 border-b border-gray-300"
            >
              <Text className="font-bold">{comment.username}</Text>
              <Text>{comment.comment}</Text>
              <Text>Upvotes: {comment.likesCount}</Text>
              <Text>Downvotes: {comment.dislikesCount}</Text>
              <View className="flex-row mt-2">
                <Button
                  title="Like"
                  onPress={() => handleCommentLike(comment._id)}
                />
                <Button
                  title="Dislike"
                  onPress={() => handleCommentDislike(comment._id)}
                />
              </View>
              <TextInput
                value={replyTexts[comment._id] || ''}
                onChangeText={(text) =>
                  handleReplyTextChange(comment._id, text)
                }
                placeholder="Add a reply"
                className="border p-2 mt-2"
              />
              <Button
                title="Submit Reply"
                onPress={() => handleAddReply(comment._id)}
              />
              {responses[comment._id]?.length > 0 && (
                <View className="ml-4 mt-2">
                  <Text className="font-bold">Responses:</Text>
                  {responses[comment._id].map((response: any) => (
                    <View key={response._id} className="mt-1">
                      <Text className="font-bold">{response.username}</Text>
                      <Text>{response.comment}</Text>
                      <Text>Upvotes: {response.likesCount}</Text>
                      <Text>Downvotes: {response.dislikesCount}</Text>
                      <View className="flex-row mt-2">
                        <Button
                          title="Like"
                          onPress={() => handleResponseLike(response._id)}
                        />
                        <Button
                          title="Dislike"
                          onPress={() => handleResponseDislike(response._id)}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          <Text>Empty</Text>
        )}
      </View>
    </ScrollView>
  )
}

export default BuildDetailsPage
