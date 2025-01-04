import React, { useState } from 'react'
import { View, Text, Image, Button } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBuildById } from '../api/build/getBuildById'
import { getVersion } from '../api/ddragon/version'
import { react } from '../api/comments/react'
import { saveBuild } from '../api/build/saveBuild'
import { getComments } from '../api/comments/getComments'

const BuildDetailsPage: React.FC = () => {
  const route = useRoute()
  const { buildId } = route.params as { buildId: string }
  const queryClient = useQueryClient()
  const [isSaved, setIsSaved] = useState(false)

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

  const handleLike = () => {
    mutation.mutate({ objectId: buildId, value: true })
  }

  const handleDislike = () => {
    mutation.mutate({ objectId: buildId, value: false })
  }

  const handleSave = () => {
    saveMutation.mutate({ buildId, save: !isSaved })
  }

  return (
    <View className="flex-1 p-4">
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
            <Text>Główna runa (Dark Harvest/Electrocute itd):</Text>
            {build.runes.runes1.length > 0 && (
              <Text className="text-sm">{build.runes.runes1[0]}</Text>
            )}
            <Text>
              Drugie drzewko (Inspiracja/Dominacja itd):{' '}
              {build.runes.keyStone2Id}
            </Text>
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
      <View className="mt-4">
        <Text className="text-xl font-bold">Comments</Text>
        {comments?.content.map((comment) => (
          <View key={comment._id} className="mt-2 p-2 border-b border-gray-300">
            <Text className="font-bold">{comment.username}</Text>
            <Text>{comment.comment}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default BuildDetailsPage
