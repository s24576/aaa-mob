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
import { getSavedBuilds } from '../api/build/getSavedBuilds'
import { getVersion } from '../api/ddragon/version'
import { getRunes } from '../api/ddragon/getRunes'
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
  summoner1Name: string
  summoner2Name: string
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
    queryFn: () => getSavedBuilds(),
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
    data: runesData,
    isLoading: isRunesLoading,
    error: runesError,
  } = useQuery({
    queryKey: ['runes'],
    queryFn: getRunes,
  })

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

  useFocusEffect(
    React.useCallback(() => {
      refetch()
    }, [refetch])
  )

  if (isLoading || isVersionLoading || isRunesLoading || isFetching) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-bialas font-chewy">Loading...</Text>
      </View>
    )
  }

  if (error || versionError || runesError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-bialas font-chewy">
          Error: {(error || versionError || runesError)?.message}
        </Text>
      </View>
    )
  }

  const handleBuildPress = (buildId: string) => {
    navigation.navigate('BuildDetails', { buildId })
  }

  const renderBuild = ({ item }: { item: Build }) => (
    <TouchableOpacity onPress={() => handleBuildPress(item._id)}>
      <View className="p-4 border-b border-gray-300">
        <Text className="text-bialas font-chewy">{item.title}</Text>
        <Text className="text-bialas font-chewy">{item.description}</Text>
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
        <View className="flex-1 flex-row items-center mt-2">
          <Image
            source={{
              uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/Summoner${item.summoner1Name}.png`,
            }}
            style={{ width: 24, height: 24, marginRight: 4 }}
          />
          <Image
            source={{
              uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/Summoner${item.summoner2Name}.png`,
            }}
            style={{ width: 24, height: 24 }}
          />
        </View>
        {item.runes && (
          <View className="mt-2 flex-row">
            <View className="flex-row items-center">
              {item.runes.keyStone1Id && (
                <Image
                  source={{
                    uri: `https://ddragon.leagueoflegends.com/cdn/img/${findRuneById(item.runes.keyStone1Id)?.icon}`,
                  }}
                  className="w-8 h-8 mr-2"
                />
              )}
              {item.runes.runes1.map((runeId, index) => (
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
              {item.runes.keyStone2Id && (
                <Image
                  source={{
                    uri: `https://ddragon.leagueoflegends.com/cdn/img/${findRuneTreeById(item.runes.keyStone2Id)?.icon}`,
                  }}
                  className="w-8 h-8 mr-2"
                />
              )}
              {item.runes.runes2.map((runeId, index) => (
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
        <Text className="text-bialas font-chewy">By: {item.username}</Text>
        <Text className="text-bialas font-chewy">
          Upvotes: {item.likesCount}
        </Text>
        <Text className="text-bialas font-chewy">
          Downvotes: {item.dislikesCount}
        </Text>
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
