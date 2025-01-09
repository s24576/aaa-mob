import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native'
import { getDuos } from '../api/duo/getDuos'
import { createDuo } from '../api/duo/createDuo'
import { getMyRiotProfiles } from '../api/riot/getMyRiotProfiles'
import { getChampionNames } from '../api/ddragon/getChampionNames'
import { getVersion } from '../api/ddragon/version'

interface Announcement {
  _id: string
  author: string
  positions: string[]
  lookedPositions: string[] | null
  minRank: string
  maxRank: string
  languages: string[]
  championIds: string[]
  server: string
  timestamp: number
  saved: boolean
  puuid: string
}

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [pickerModal, setPickerModal] = useState({
    visible: false,
    type: '',
    options: [],
    onSelect: (value: string[]) => {},
    multiSelect: false,
    selectedValues: [] as string[],
  })
  const [newDuo, setNewDuo] = useState({
    puuid: '',
    positions: [],
    lookedPositions: [],
    minRank: '',
    maxRank: '',
    languages: [],
    championIds: [],
  })
  const [riotProfiles, setRiotProfiles] = useState<
    { puuid: string; gameName: string; server: string }[]
  >([])
  const [selectedProfile, setSelectedProfile] = useState<{
    puuid: string
    gameName: string
  } | null>(null)
  const [champions, setChampions] = useState<{ [key: string]: string }>({})
  const [selectedChampions, setSelectedChampions] = useState<string[]>([])
  const [version, setVersion] = useState<string>('')
  const [filters, setFilters] = useState<SearchDuo>({
    minRank: '',
    maxRank: '',
    positions: [],
    champions: [],
    languages: [],
  })

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

  useEffect(() => {
    const fetchRiotProfiles = async () => {
      try {
        const profiles = await getMyRiotProfiles()
        setRiotProfiles(profiles)
      } catch (error) {
        console.error('Error fetching Riot profiles:', error)
      }
    }

    fetchRiotProfiles()
  }, [])

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const data = await getChampionNames()
        setChampions(data)
      } catch (error) {
        console.error('Error fetching champions:', error)
      }
    }

    fetchChampions()
  }, [])

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const data = await getVersion()
        setVersion(data)
      } catch (error) {
        console.error('Error fetching version:', error)
      }
    }

    fetchVersion()
  }, [])

  const handleCreateDuo = async () => {
    try {
      const response = await createDuo(newDuo)
      console.log('Duo created successfully:', response)
      setModalVisible(false)
      // Optionally, refresh the announcements list
      const data = await getDuos({}, {})
      setAnnouncements(data.content)
    } catch (error) {
      console.error('Error creating duo:', error)
    }
  }

  const openPickerModal = (
    type: string,
    options: string[],
    onSelect: (value: string[]) => void,
    multiSelect: boolean = false,
    selectedValues: string[] = []
  ) => {
    setPickerModal({
      visible: true,
      type,
      options,
      onSelect,
      multiSelect,
      selectedValues,
    })
  }

  const resetFilters = () => {
    setFilters({
      minRank: '',
      maxRank: '',
      positions: [],
      champions: [],
      languages: [],
    })
  }

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <View className="border 1px solid black my-2">
      <Text>Author: {item.author}</Text>
      <Text>Server: {item.server}</Text>
      <Text>PUUID: {item.puuid}</Text>
      <Text>
        Ranks: {item.minRank} - {item.maxRank}
      </Text>
      <Text>Positions: {item.positions.join(', ')}</Text>
      <Text>
        Looked Positions:{' '}
        {item.lookedPositions ? item.lookedPositions.join(', ') : 'None'}
      </Text>
      <Text>Champion IDs: {item.championIds.join(', ')}</Text>
    </View>
  )

  return (
    <ScrollView>
      <Button title="Add announcement" onPress={() => setModalVisible(true)} />
      <View>
        <Text>Filters</Text>
        <View className="my-2">
          <Text>Min rank</Text>
          <Button
            title={filters.minRank || 'Select Min Rank'}
            onPress={() =>
              openPickerModal(
                'Min rank',
                [
                  'Challenger',
                  'Grandmaster',
                  'Master',
                  'Diamond',
                  'Emerald',
                  'Platinum',
                  'Gold',
                  'Silver',
                  'Bronze',
                  'Iron',
                ],
                (values) => setFilters({ ...filters, minRank: values[0] })
              )
            }
          />
        </View>
        <View className="my-2">
          <Text>Max rank</Text>
          <Button
            title={filters.maxRank || 'Select Max Rank'}
            onPress={() =>
              openPickerModal(
                'Max rank',
                [
                  'Challenger',
                  'Grandmaster',
                  'Master',
                  'Diamond',
                  'Emerald',
                  'Platinum',
                  'Gold',
                  'Silver',
                  'Bronze',
                  'Iron',
                ],
                (values) => setFilters({ ...filters, maxRank: values[0] })
              )
            }
          />
        </View>
        <View className="my-2">
          <Text>Positions</Text>
          <Button
            title={
              filters.positions.length
                ? filters.positions.join(', ')
                : 'Select Positions'
            }
            onPress={() =>
              openPickerModal(
                'Positions',
                ['Top', 'Jungle', 'Mid', 'Bot', 'Support', 'Fill'],
                (values) => setFilters({ ...filters, positions: values }),
                true,
                filters.positions
              )
            }
          />
        </View>
        <View className="my-2">
          <Text>Languages</Text>
          <Button
            title={
              filters.languages.length
                ? filters.languages.join(', ')
                : 'Select Languages'
            }
            onPress={() =>
              openPickerModal(
                'Languages',
                [
                  'English',
                  'German',
                  'French',
                  'Spanish',
                  'Polish',
                  'Chinese',
                  'Japanese',
                  'Korean',
                  'Other',
                ],
                (values) => setFilters({ ...filters, languages: values }),
                true,
                filters.languages
              )
            }
          />
        </View>
        <View className="my-2">
          <Text>Champions</Text>
          <Button
            title={
              filters.champions.length
                ? filters.champions.map((champ) => champions[champ]).join(', ')
                : 'Select Champions'
            }
            onPress={() =>
              openPickerModal(
                'Champions',
                Object.keys(champions),
                (values) => setFilters({ ...filters, champions: values }),
                true,
                filters.champions
              )
            }
          />
        </View>
        <View className="my-2">
          <Button
            title="Apply Filters"
            onPress={async () => {
              try {
                const data = await getDuos(filters, {
                  size: 5,
                  sort: 'timestamp',
                  direction: 'DESC',
                })
                setAnnouncements(data.content)
              } catch (error) {
                console.error('Error fetching filtered announcements:', error)
              }
            }}
          />
        </View>
        <View className="my-2">
          <Button title="RESET FILTERS" onPress={resetFilters} />
        </View>
      </View>
      <FlatList
        data={announcements}
        keyExtractor={(item) => item._id}
        renderItem={renderAnnouncement}
        ListEmptyComponent={<Text>No announcements found.</Text>}
      />
      <Modal visible={modalVisible} animationType="slide">
        <View>
          <Text className="my-2">Add New Duo</Text>

          <View className="my-2">
            <Text>Select Riot Account</Text>
            <Button
              title={
                selectedProfile ? selectedProfile.gameName : 'Select Account'
              }
              onPress={() =>
                openPickerModal(
                  'Select Riot Account',
                  riotProfiles.map((profile) => profile.gameName),
                  (values) => {
                    const profile = riotProfiles.find(
                      (profile) => profile.gameName === values[0]
                    )
                    if (profile) {
                      setSelectedProfile(profile)
                      setNewDuo({
                        ...newDuo,
                        puuid: `${profile.server}_${profile.puuid}`,
                      })
                    }
                  }
                )
              }
            />
          </View>

          <View className="my-2">
            <Text>Your position</Text>
            <Button
              title={newDuo.positions.join(', ')}
              onPress={() =>
                openPickerModal(
                  'Your position',
                  ['Top', 'Jungle', 'Mid', 'Bot', 'Support', 'Fill'],
                  (values) => setNewDuo({ ...newDuo, positions: values }),
                  true,
                  newDuo.positions
                )
              }
            />
          </View>

          <View className="my-2">
            <Text>Searched position</Text>
            <Button
              title={newDuo.lookedPositions.join(', ')}
              onPress={() =>
                openPickerModal(
                  'Searched position',
                  ['Top', 'Jungle', 'Mid', 'Bot', 'Support', 'Fill'],
                  (values) => setNewDuo({ ...newDuo, lookedPositions: values }),
                  true,
                  newDuo.lookedPositions
                )
              }
            />
          </View>

          <View className="my-2">
            <Text>Min rank</Text>
            <Button
              title={newDuo.minRank}
              onPress={() =>
                openPickerModal(
                  'Min rank',
                  [
                    'Challenger',
                    'Grandmaster',
                    'Master',
                    'Diamond',
                    'Emerald',
                    'Platinum',
                    'Gold',
                    'Silver',
                    'Bronze',
                    'Iron',
                  ],
                  (values) => setNewDuo({ ...newDuo, minRank: values[0] })
                )
              }
            />
          </View>

          <View className="my-2">
            <Text>Max rank</Text>
            <Button
              title={newDuo.maxRank}
              onPress={() =>
                openPickerModal(
                  'Max rank',
                  [
                    'Challenger',
                    'Grandmaster',
                    'Master',
                    'Diamond',
                    'Emerald',
                    'Platinum',
                    'Gold',
                    'Silver',
                    'Bronze',
                    'Iron',
                  ],
                  (values) => setNewDuo({ ...newDuo, maxRank: values[0] })
                )
              }
            />
          </View>

          <View className="my-2">
            <Text>Languages</Text>
            <Button
              title={newDuo.languages.join(', ')}
              onPress={() =>
                openPickerModal(
                  'Languages',
                  [
                    'English',
                    'German',
                    'French',
                    'Spanish',
                    'Polish',
                    'Chinese',
                    'Japanese',
                    'Korean',
                    'Other',
                  ],
                  (values) => setNewDuo({ ...newDuo, languages: values }),
                  true,
                  newDuo.languages
                )
              }
            />
          </View>

          <View className="my-2">
            <Text>Champions</Text>
            <Button
              title={
                selectedChampions.length > 0
                  ? selectedChampions
                      .map((champ) => champions[champ])
                      .join(', ')
                  : 'Select Champions'
              }
              onPress={() =>
                openPickerModal(
                  'Select Champions',
                  Object.keys(champions),
                  (values) => {
                    setSelectedChampions(values)
                    setNewDuo({ ...newDuo, championIds: values })
                  },
                  true,
                  selectedChampions
                )
              }
            />
          </View>

          <View className="mb-2">
            <Button title="Create Duo" onPress={handleCreateDuo} />
          </View>
          <View>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal visible={pickerModal.visible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>{pickerModal.type}</Text>
            <ScrollView>
              {pickerModal.options.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    if (pickerModal.multiSelect) {
                      const selectedValues =
                        pickerModal.selectedValues.includes(option)
                          ? pickerModal.selectedValues.filter(
                              (val) => val !== option
                            )
                          : [...pickerModal.selectedValues, option]
                      setPickerModal({ ...pickerModal, selectedValues })
                    } else {
                      pickerModal.onSelect([option])
                      setPickerModal({ ...pickerModal, visible: false })
                    }
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {pickerModal.type === 'Select Champions' ? (
                      <Image
                        source={{
                          uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${option}.png`,
                        }}
                        style={{ width: 20, height: 20, marginRight: 10 }}
                      />
                    ) : null}
                    <Text
                      style={[
                        styles.option,
                        pickerModal.selectedValues.includes(option) &&
                          styles.selectedOption,
                      ]}
                    >
                      {pickerModal.type === 'Select Champions'
                        ? champions[option]
                        : option}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              {pickerModal.multiSelect && (
                <Button
                  title="Done"
                  onPress={() => {
                    pickerModal.onSelect(pickerModal.selectedValues)
                    setPickerModal({ ...pickerModal, visible: false })
                  }}
                />
              )}
              <Button
                title="Back"
                onPress={() =>
                  setPickerModal({ ...pickerModal, visible: false })
                }
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  option: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedOption: {
    backgroundColor: '#ddd',
  },
})

export default AnnouncementsPage
