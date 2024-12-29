import React from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getBuilds } from '../api/build/getBuilds'
import { getVersion } from '../api/ddragon/version'

interface Build {
  _id: string
  title: string
  description: string
  championId: string
  item1: number
  item2: number
  item3: number
  item4: number
  item5: number
  item6: number
  username: string
  likesCount: number
  dislikesCount: number
  runes: {
    keyStone1Id: string
    runes1: string[]
    keyStone2Id: string
    runes2: string[]
    statShards: string[]
  }
}

const BuildsBrowserPage: React.FC = () => {
  const {
    data: buildsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['builds'],
    queryFn: () => getBuilds(),
  })

  const {
    data: version,
    isLoading: isVersionLoading,
    error: versionError,
  } = useQuery({
    queryKey: ['version'],
    queryFn: getVersion,
  })

  if (isLoading || isVersionLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    )
  }

  if (error || versionError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {(error || versionError)?.message}</Text>
      </View>
    )
  }

  const renderBuild = ({ item }: { item: Build }) => (
    <View className="p-4 border-b border-gray-300">
      <Text className="text-lg font-bold">{item.title}</Text>
      <Text className="text-sm mb-2">{item.description}</Text>
      <Image
        source={{
          uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${item.championId}.png`,
        }}
        className="w-12 h-12 mb-2"
      />
      <View className="flex-row mb-2">
        {[
          item.item1,
          item.item2,
          item.item3,
          item.item4,
          item.item5,
          item.item6,
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
      {item.runes && (
        <View className="mt-2">
          <View className="mt-1">
            <Text>Główna runa (Dark Harvest/Electrocute itd):</Text>

            {item.runes.runes1.length > 0 && (
              <Text className="text-sm">{item.runes.runes1[0]}</Text>
            )}
            <Text>
              Drugie drzewko (Inspiracja/Dominacja itd):{' '}
              {item.runes.keyStone2Id}
            </Text>
          </View>
        </View>
      )}
      <Text>By: {item.username}</Text>
      <Text>Upvotes: {item.likesCount}</Text>
      <Text>Downvotes: {item.dislikesCount}</Text>
    </View>
  )

  return (
    <FlatList
      data={buildsData.content}
      keyExtractor={(item) => item._id}
      renderItem={renderBuild}
    />
  )
}

export default BuildsBrowserPage
