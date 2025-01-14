import React, { useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getMyBuilds } from '../api/build/getMyBuilds'
import { getVersion } from '../api/ddragon/version'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { BuildDetailsScreenProps } from '../App'

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
  const navigation = useNavigation<BuildDetailsScreenProps['navigation']>()

  const {
    data: buildsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['builds'],
    queryFn: () => getMyBuilds(),
  })

  const {
    data: version,
    isLoading: isVersionLoading,
    error: versionError,
  } = useQuery({
    queryKey: ['version'],
    queryFn: getVersion,
  })

  useFocusEffect(
    React.useCallback(() => {
      refetch()
    }, [refetch])
  )

  if (isLoading || isVersionLoading || isFetching) {
    return (
      <View className="bg-wegielek">
        <ActivityIndicator size="large" color="#F5B800" />
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

  const handleBuildPress = (buildId: string) => {
    navigation.navigate('BuildDetails', { buildId })
  }

  const renderBuild = ({ item }: { item: Build }) => (
    <TouchableOpacity onPress={() => handleBuildPress(item._id)}>
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
    </TouchableOpacity>
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
