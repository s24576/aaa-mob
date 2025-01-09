import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { getDuos } from '../api/duo/getDuos'

interface Announcement {
  _id: string
  author: string
  positions: string[]
  minRank: string
  maxRank: string
  languages: string[]
  championIds: string[]
  server: string
  timestamp: number
  saved: boolean
}

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getDuos({}, {})
        console.log('Announcements:', data)
        setAnnouncements(data.content)
      } catch (error) {
        console.error('Error fetching announcements:', error)
      }
    }

    fetchAnnouncements()
  }, [])

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <View style={styles.announcement}>
      <Text>Author: {item.author}</Text>
      <Text>Server: {item.server}</Text>
      <Text>
        Ranks: {item.minRank} - {item.maxRank}
      </Text>
    </View>
  )

  return (
    <FlatList
      data={announcements}
      keyExtractor={(item) => item._id}
      renderItem={renderAnnouncement}
      ListEmptyComponent={<Text>No announcements found.</Text>}
    />
  )
}

const styles = StyleSheet.create({
  announcement: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
})

export default AnnouncementsPage
