import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  BackHandler,
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

const CustomButton = ({
  title,
  onPress,
  style,
}: {
  title: string
  onPress: () => void
  style?: any
}) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <Text className="text-wegielek text-lg font-chewy">{title}</Text>
  </TouchableOpacity>
)

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [pickerModal, setPickerModal] = useState<{
    visible: boolean
    type: string
    options: string[]
    onSelect: (value: string[]) => void
    multiSelect: boolean
    selectedValues: string[]
  }>({
    visible: false,
    type: '',
    options: [],
    onSelect: () => {},
    multiSelect: false,
    selectedValues: [],
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

  useEffect(() => {
    const backAction = () => {
      if (pickerModal.visible) {
        setPickerModal({ ...pickerModal, visible: false })
        return true
      }
      return false
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [pickerModal])

  const handleCreateDuo = async () => {
    try {
      const response = await createDuo(newDuo)
      console.log('Duo created successfully:', response)
      setModalVisible(false)
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
    <View className="mb-2 border border-bialas p-3 rounded-lg">
      <Text className="text-bialas font-chewy">Author: {item.author}</Text>
      <Text className="text-bialas font-chewy">Server: {item.server}</Text>
      <Text className="text-bialas font-chewy">PUUID: {item.puuid}</Text>
      <Text className="text-bialas font-chewy">
        Ranks: {item.minRank} - {item.maxRank}
      </Text>
      <Text className="text-bialas font-chewy">
        Positions: {item.positions.join(', ')}
      </Text>
      <Text className="text-bialas font-chewy">
        Looked Positions:{' '}
        {item.lookedPositions ? item.lookedPositions.join(', ') : 'None'}
      </Text>
      <Text className="text-bialas font-chewy">
        Champion IDs: {item.championIds.join(', ')}
      </Text>
    </View>
  )

  return (
    <View className="p-5">
      <ScrollView>
        <CustomButton
          title="Add announcement"
          onPress={() => setModalVisible(true)}
          style={styles.customButton}
        />
        <CustomButton
          title={filtersVisible ? 'Hide Filters' : 'Filters'}
          onPress={() => setFiltersVisible(!filtersVisible)}
          style={styles.customButton2}
        />
        {filtersVisible && (
          <View>
            <View>
              <View className="flex-row items-center justify-center">
                <View className="flex-1 items-end pr-2">
                  <CustomButton
                    title={filters.minRank || 'Min Rank'}
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
                        (values) =>
                          setFilters({ ...filters, minRank: values[0] })
                      )
                    }
                    style={[
                      styles.customButton,
                      { paddingHorizontal: 10, minWidth: 120, width: '100%' },
                    ]}
                  />
                </View>
                <Text className="text-bialas text-center pt-2">-</Text>
                <View className="flex-1 items-start pl-2">
                  <CustomButton
                    title={filters.maxRank || 'Max Rank'}
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
                        (values) =>
                          setFilters({ ...filters, maxRank: values[0] })
                      )
                    }
                    style={[
                      styles.customButton,
                      { paddingHorizontal: 10, width: '100%' },
                    ]}
                  />
                </View>
              </View>
            </View>
            <View>
              <CustomButton
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
                style={styles.customButton}
              />
            </View>
            <View>
              <CustomButton
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
                style={styles.customButton}
              />
            </View>
            <View>
              <CustomButton
                title={
                  filters.champions.length
                    ? filters.champions
                        .map((champ) => champions[champ])
                        .sort()
                        .join(', ')
                    : 'Select Champions'
                }
                onPress={() =>
                  openPickerModal(
                    'Select Champions',
                    Object.keys(champions)
                      .sort()
                      .map((key) => champions[key]),
                    (selectedNames) => {
                      const selectedIds = selectedNames.map(
                        (name) =>
                          Object.keys(champions).find(
                            (key) => champions[key] === name
                          ) || ''
                      )
                      setFilters({ ...filters, champions: selectedIds })
                    },
                    true,
                    filters.champions.map((id) => champions[id])
                  )
                }
                style={styles.customButton}
              />
            </View>

            <View>
              <CustomButton
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
                    console.error(
                      'Error fetching filtered announcements:',
                      error
                    )
                  }
                }}
                style={styles.customButton}
              />
            </View>
            <View>
              <CustomButton
                title="Reset Filters"
                onPress={resetFilters}
                style={[styles.customButton2]}
              />
            </View>
          </View>
        )}
        <FlatList
          data={announcements}
          keyExtractor={(item) => item._id}
          renderItem={renderAnnouncement}
          ListEmptyComponent={<Text>No announcements found.</Text>}
        />
        {/* modal na dodawanie ogłoszenia */}
        <Modal visible={modalVisible} animationType="slide">
          <View>
            <Text className="my-2">Add New Duo</Text>
            <View>
              <Text>Select Riot Account</Text>
              <CustomButton
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
                style={styles.customButton}
              />
            </View>
            <View>
              <Text>Your position</Text>
              <CustomButton
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
                style={styles.customButton}
              />
            </View>
            <View>
              <Text>Searched position</Text>
              <CustomButton
                title={newDuo.lookedPositions.join(', ')}
                onPress={() =>
                  openPickerModal(
                    'Searched position',
                    ['Top', 'Jungle', 'Mid', 'Bot', 'Support', 'Fill'],
                    (values) =>
                      setNewDuo({ ...newDuo, lookedPositions: values }),
                    true,
                    newDuo.lookedPositions
                  )
                }
                style={styles.customButton}
              />
            </View>
            <View>
              <Text>Min rank</Text>
              <CustomButton
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
                style={styles.customButton}
              />
            </View>
            <View>
              <Text>Max rank</Text>
              <CustomButton
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
                style={styles.customButton}
              />
            </View>
            <View>
              <Text>Languages</Text>
              <CustomButton
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
                style={styles.customButton}
              />
            </View>
            <View>
              <CustomButton
                title={
                  newDuo.championIds.length
                    ? newDuo.championIds
                        .map((champ) => champions[champ])
                        .join(', ')
                    : 'Select Champions'
                }
                onPress={() =>
                  openPickerModal(
                    'Select Champions',
                    Object.keys(champions)
                      .sort()
                      .map((key) => champions[key]),
                    (selectedNames) => {
                      const selectedIds = selectedNames.map(
                        (name) =>
                          Object.keys(champions).find(
                            (key) => champions[key] === name
                          ) || ''
                      )
                      setNewDuo({ ...newDuo, championIds: selectedIds })
                    },
                    true,
                    newDuo.championIds.map((id) => champions[id])
                  )
                }
                style={styles.customButton}
              />
            </View>

            <View className="mb-2">
              <CustomButton
                title="Create Duo"
                onPress={handleCreateDuo}
                style={styles.customButton}
              />
            </View>
            <View>
              <CustomButton
                title="Cancel"
                onPress={() => setModalVisible(false)}
                style={styles.customButton}
              />
            </View>
          </View>
        </Modal>
        {/* modal na wybieranie championów */}
        <Modal
          visible={pickerModal.visible}
          animationType="fade"
          transparent
          onRequestClose={() =>
            setPickerModal({ ...pickerModal, visible: false })
          }
        >
          <TouchableWithoutFeedback
            onPress={() => setPickerModal({ ...pickerModal, visible: false })}
          >
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text>{pickerModal.type}</Text>
                  <ScrollView style={{ maxHeight: '70%' }}>
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
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                          {pickerModal.type === 'Select Champions' ? (
                            <Image
                              source={{
                                uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${Object.keys(
                                  champions
                                ).find(
                                  (key) => champions[key] === option
                                )}.png`,
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
                            {option}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View style={styles.buttonContainer}>
                    {pickerModal.multiSelect && (
                      <CustomButton
                        title="Done"
                        onPress={() => {
                          pickerModal.onSelect(pickerModal.selectedValues)
                          setPickerModal({ ...pickerModal, visible: false })
                        }}
                        style={styles.customButton}
                      />
                    )}
                    <CustomButton
                      title="Back"
                      onPress={() =>
                        setPickerModal({ ...pickerModal, visible: false })
                      }
                      style={styles.customButton}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
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
  customButton: {
    backgroundColor: '#F5B800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  customButton2: {
    backgroundColor: '#F5B800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 0,
  },
})

export default AnnouncementsPage
