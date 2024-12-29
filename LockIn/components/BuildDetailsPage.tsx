import React from 'react'
import { View, Text } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { getBuildById } from '../api/build/getBuildById'

const BuildDetailsPage: React.FC = () => {
  const route = useRoute()
  const { buildId } = route.params as { buildId: string }

  const {
    data: build,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['build', buildId],
    queryFn: () => getBuildById(buildId),
    enabled: !!buildId,
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
        <Text>Error: {error.message}</Text>
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

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl">Build ID: {buildId}</Text>
      <Text className="text-lg">Title: {build.title}</Text>
      <Text className="text-lg">Description: {build.description}</Text>
      {/* Add more build details as needed */}
    </View>
  )
}

export default BuildDetailsPage
