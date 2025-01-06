import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getBuilds } from '../api/build/getBuilds'
import { getVersion } from '../api/ddragon/version'
import { getChampionNames } from '../api/ddragon/getChampionNames'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { BuildDetailsScreenProps } from '../App'
import { Menu, Button } from 'react-native-paper' // Import Menu and Button
// import { Image } from 'react-native' // Import Image

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
  const [selectedChampion, setSelectedChampion] = useState<string | null>(null)
  const [menuVisible, setMenuVisible] = useState(false)

  // Fetch builds
  const {
    data: buildsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['builds'],
    queryFn: () => getBuilds(),
  })

  // Fetch version
  const {
    data: version,
    isLoading: isVersionLoading,
    error: versionError,
  } = useQuery({
    queryKey: ['version'],
    queryFn: getVersion,
  })

  // Fetch champion names
  const {
    data: champions,
    isLoading: isChampionsLoading,
    error: championsError,
  } = useQuery({
    queryKey: ['champions'],
    queryFn: getChampionNames,
  })

  useFocusEffect(
    React.useCallback(() => {
      refetch()
    }, [refetch])
  )

  if (isLoading || isVersionLoading || isFetching || isChampionsLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    )
  }

  if (error || versionError || championsError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {(error || versionError || championsError)?.message}</Text>
      </View>
    )
  }

  const handleBuildPress = (buildId: string) => {
    console.log('buildId:', buildId)
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

  // Toggle the visibility of the menu
  const toggleMenu = () => setMenuVisible(!menuVisible)

  // Handle champion selection
  const handleChampionSelect = (champion: string) => {
    setSelectedChampion(champion)
    setMenuVisible(false)
  }

  return (
    <View>
      {/* Champion select dropdown */}
      <View className="items-center">
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<Button onPress={toggleMenu}>Select Champion</Button>}
        >
          {champions &&
            Object.keys(champions)
              .sort()
              .map((champion) => (
                <Menu.Item
                  key={champion}
                  title={
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Image
                        source={{
                          uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion}.png`,
                        }}
                        style={{ width: 20, height: 20, marginRight: 10 }}
                      />
                      <Text>{champions[champion]}</Text>
                    </View>
                  }
                  onPress={() => handleChampionSelect(champion)}
                />
              ))}
        </Menu>
      </View>

      {/* Selected Champion */}
      {selectedChampion && (
        <View className="p-4">
          <Text>Selected Champion: {champions[selectedChampion]}</Text>
        </View>
      )}

      {/* Build list */}
      <FlatList
        data={buildsData.content}
        keyExtractor={(item) => item._id}
        renderItem={renderBuild}
      />
    </View>
  )
}

export default BuildsBrowserPage
