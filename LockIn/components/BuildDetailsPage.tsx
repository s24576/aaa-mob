import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native'
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
import { deleteComment } from '../api/comments/deleteComment'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'
import { getRunes } from '../api/ddragon/getRunes'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

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

  const {
    data: runesData,
    isLoading: isRunesLoading,
    error: runesError,
  } = useQuery({
    queryKey: ['runes'],
    queryFn: getRunes,
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

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', buildId] })
    },
  })

  const deleteResponseMutation = useMutation({
    mutationFn: (responseId: string) => deleteComment(responseId),
    onSuccess: (_, responseId) => {
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

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId)
  }

  const handleDeleteResponse = (responseId: string) => {
    deleteResponseMutation.mutate(responseId)
  }

  const findRuneById = (runeId: string) => {
    if (!runesData) return null
    for (const tree of runesData) {
      for (const slot of tree.slots) {
        for (const rune of slot.runes) {
          if (rune.id === runeId) {
            return rune
          }
        }
      }
    }
    return null
  }

  const findRuneTreeById = (treeId: string) => {
    if (!runesData) return null
    return runesData.find((tree) => tree.id === treeId)
  }

  if (isLoading || isVersionLoading || isCommentsLoading || isRunesLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-bialas font-chewy">Loading...</Text>
      </View>
    )
  }

  if (error || versionError || commentsError || runesError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-bialas font-chewy">
          Error:{' '}
          {(error || versionError || commentsError || runesError)?.message}
        </Text>
      </View>
    )
  }

  if (!build) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-bialas font-chewy">
          No build information found.
        </Text>
      </View>
    )
  }

  if (!userData) {
    return <Text className="text-bialas font-chewy">Loading...</Text>
  }

  const { username } = userData

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-bialas font-chewy">{build.title}</Text>
      <Text className="text-bialas font-chewy">{build.description}</Text>
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
        <View className="mt-2 flex-row">
          <View className="flex-row items-center">
            {build.runes.keyStone1Id && (
              <Image
                source={{
                  uri: `https://ddragon.leagueoflegends.com/cdn/img/${findRuneById(build.runes.keyStone1Id)?.icon}`,
                }}
                className="w-8 h-8 mr-2"
              />
            )}
            {build.runes.runes1.map((runeId, index) => (
              <Image
                key={index}
                source={{
                  uri: `https://ddragon.leagueoflegends.com/cdn/img/${findRuneById(runeId)?.icon}`,
                }}
                className="w-6 h-6 mr-1"
              />
            ))}
          </View>
          <View className="flex-row items-center ml-4">
            {build.runes.keyStone2Id && (
              <Image
                source={{
                  uri: `https://ddragon.leagueoflegends.com/cdn/img/${findRuneTreeById(build.runes.keyStone2Id)?.icon}`,
                }}
                className="w-8 h-8 mr-2"
              />
            )}
            {build.runes.runes2.map((runeId, index) => (
              <Image
                key={index}
                source={{
                  uri: `https://ddragon.leagueoflegends.com/cdn/img/${findRuneById(runeId)?.icon}`,
                }}
                className="w-6 h-6 mr-1"
              />
            ))}
          </View>
        </View>
      )}
      <View className="flex-1 flex-row items-center mt-2">
        <Image
          source={{
            uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/Summoner${build.summoner1Name}.png`,
          }}
          style={{ width: 24, height: 24, marginRight: 4 }}
        />
        <Image
          source={{
            uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/Summoner${build.summoner2Name}.png`,
          }}
          style={{ width: 24, height: 24 }}
        />
      </View>
      <Text className="text-bialas font-chewy">By: {build.username}</Text>
      <Text className="text-bialas font-chewy">
        Upvotes: {build.likesCount}
      </Text>
      <Text className="text-bialas font-chewy">
        Downvotes: {build.dislikesCount}
      </Text>
      <View className="flex-row mt-4">
        <Button title="Like" onPress={handleLike} />
        <Button title="Dislike" onPress={handleDislike} />
        <Button
          title={isSaved ? 'Unsave Build' : 'Save Build'}
          onPress={handleSave}
        />
      </View>
      <View className="mt-4 mb-6">
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
            className={`py-2 px-4 rounded-lg items-center ${
              newComment.trim() ? 'bg-zoltek' : 'bg-gray-500'
            }`}
            disabled={!newComment.trim()}
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
                  className={`py-2 px-4 rounded-lg items-center ${
                    replyTexts[comment._id]?.trim()
                      ? 'bg-zoltek'
                      : 'bg-gray-500'
                  }`}
                  disabled={!replyTexts[comment._id]?.trim()}
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

export default BuildDetailsPage
