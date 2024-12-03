import React from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getBuilds } from '../api/build/getBuilds'
import { Build } from '../types/build/buildClass'

const BuildsBrowserPage: React.FC = () => {
  const {
    data: buildsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['builds'],
    queryFn: () => getBuilds(),
  })

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error fetching builds: {error.message}</Text>
      </View>
    )
  }

  const renderBuild = ({ item }: { item: Build }) => (
    <View className="p-4 border-b border-gray-300">
      <Text className="text-lg font-bold">{item.title}</Text>
      <Text className="text-sm mb-2">{item.description}</Text>
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
              uri: `https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${itemId}.png`,
            }}
            className="w-12 h-12 mr-2"
          />
        ))}
      </View>
      <Text>By: {item.username}</Text>
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
