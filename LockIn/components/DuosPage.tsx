import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  BackHandler,
  ActivityIndicator,
  TextInput,
} from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getDuos } from '../api/duo/getDuos'
import { createDuo } from '../api/duo/createDuo'
import { getMyRiotProfiles } from '../api/riot/getMyRiotProfiles'
import { getChampionNames } from '../api/ddragon/getChampionNames'
import { getVersion } from '../api/ddragon/version'
import { useNavigation } from '@react-navigation/native'
import { DuoScreenProps } from '../App'
import { useSocket } from '../context/SocketProvider'
import { answerDuo } from '../api/duo/answerDuo'

interface Duo {
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
  profileIconId: number
}

const CustomButton = ({
  title,
  onPress,
  style,
  textStyle,
}: {
  title: string
  onPress: () => void
  style?: any
  textStyle?: any
}) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <Text style={textStyle}>{title}</Text>
  </TouchableOpacity>
)

const DuosPage = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [applyModalVisible, setApplyModalVisible] = useState(false)
  const [selectedDuoId, setSelectedDuoId] = useState<string | null>(null)
  const [applyMessage, setApplyMessage] = useState<string>('')
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

  const navigation = useNavigation<DuoScreenProps['navigation']>()

  const {
    data: Duos,
    isLoading,
    error,
    refetch: refetchDuos,
  } = useQuery({
    queryKey: ['Duos', filters],
    queryFn: () =>
      getDuos(filters, { size: 5, sort: 'timestamp', direction: 'DESC' }),
  })

  const { duoAnswer, duoNotification } = useSocket()

  useEffect(() => {
    if (duoAnswer) {
      console.log('New duo answer:', duoAnswer)
      // Handle new duo answer
    }
  }, [duoAnswer])

  useEffect(() => {
    if (duoNotification) {
      console.log('New duo notification:', duoNotification)
      // Handle new duo notification
    }
  }, [duoNotification])

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
      setNewDuo({
        puuid: '',
        positions: [],
        lookedPositions: [],
        minRank: '',
        maxRank: '',
        languages: [],
        championIds: [],
      })
      refetchDuos()
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
    refetchDuos()
  }

  const handleDuoAnwserPress = () => {
    navigation.navigate('DuoAnswers')
  }

  const handleApplyForDuo = async () => {
    if (!selectedProfile || !selectedDuoId) {
      console.error('No Riot profile selected or duo ID missing')
      return
    }

    const answer = {
      puuid: selectedProfile.puuid,
    }

    try {
      const response = await answerDuo(answer, selectedDuoId)
      console.log('Applied for duo successfully:', response)
      setApplyModalVisible(false)
      setApplyMessage('')
      refetchDuos()
    } catch (error) {
      console.error('Error applying for duo:', error)
      console.log(answerDuo, answer)
    }
  }

  const rankImages: { [key: string]: any } = {
    IRON: require('../assets/ranks/IRON.png'),
    BRONZE: require('../assets/ranks/BRONZE.png'),
    SILVER: require('../assets/ranks/SILVER.png'),
    GOLD: require('../assets/ranks/GOLD.png'),
    PLATINUM: require('../assets/ranks/PLATINUM.png'),
    EMERALD: require('../assets/ranks/EMERALD.png'),
    DIAMOND: require('../assets/ranks/DIAMOND.png'),
    MASTER: require('../assets/ranks/MASTER.png'),
    GRANDMASTER: require('../assets/ranks/GRANDMASTER.png'),
    CHALLENGER: require('../assets/ranks/CHALLENGER.png'),
  }

  const renderDuo = ({ item }: { item: Duo }) => (
    <View className="mb-2 border border-bialas p-3 rounded-lg">
      <Text className="text-bialas font-chewy">Author: {item.author}</Text>
      <Image
        source={{
          uri: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${item.profileIconId}.png`,
        }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
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
      <Text className="text-bialas font-chewy">
        Rank: {item.tier || 'Unranked'}
      </Text>
      {item.tier ? (
        <Image
          source={rankImages[item.tier] || rankImages['IRON']}
          style={{ width: 50, height: 50 }}
        />
      ) : (
        <Text className="text-bialas font-chewy">Unranked</Text>
      )}
      <TouchableOpacity
        onPress={() => {
          setSelectedDuoId(item._id)
          setApplyModalVisible(true)
        }}
        style={styles.applyButton}
      >
        <Text style={styles.applyButtonText}>Apply for Duo</Text>
      </TouchableOpacity>
    </View>
  )

  if (isLoading) {
    return (
      <View className="bg-wegielek">
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }

  if (error) {
    return <Text className="text-bialas">Error: {error.message}</Text>
  }

  return (
    <View className="px-5 pt-2">
      <FlatList
        data={Duos?.content}
        keyExtractor={(item) => item._id}
        renderItem={renderDuo}
        ListEmptyComponent={
          <Text className="text-bialas">No posts found.</Text>
        }
        ListHeaderComponent={
          <>
            <CustomButton
              title="Create a Duo Post"
              onPress={() => setModalVisible(true)}
              style={styles.customButton}
              textStyle={styles.customButtonText}
            />
            <CustomButton
              title="Check for Duo Answers"
              onPress={() => handleDuoAnwserPress()}
              style={styles.customButton}
              textStyle={styles.customButtonText}
            />
            <CustomButton
              title={filtersVisible ? 'Hide Filters' : 'Filters'}
              onPress={() => setFiltersVisible(!filtersVisible)}
              style={styles.customButton2}
              textStyle={styles.customButton2Text}
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
                        style={styles.customButton}
                        textStyle={styles.customButtonText}
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
                        style={styles.customButton}
                        textStyle={styles.customButtonText}
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
                        (values) =>
                          setFilters({ ...filters, positions: values }),
                        true,
                        filters.positions
                      )
                    }
                    style={styles.customButton}
                    textStyle={styles.customButtonText}
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
                        (values) =>
                          setFilters({ ...filters, languages: values }),
                        true,
                        filters.languages
                      )
                    }
                    style={styles.customButton}
                    textStyle={styles.customButtonText}
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
                          .map((key) => champions[key])
                          .sort(),
                        (selectedNames) => {
                          const selectedIds = selectedNames.map(
                            (name) =>
                              Object.keys(champions).find(
                                (key) => champions[key] === name
                              ) || name
                          )
                          setFilters({ ...filters, champions: selectedIds })
                        },
                        true,
                        filters.champions.map((id) => champions[id]).sort()
                      )
                    }
                    style={styles.customButton}
                    textStyle={styles.customButtonText}
                  />
                </View>

                <View>
                  <CustomButton
                    title="Reset Filters"
                    onPress={resetFilters}
                    style={styles.customButton2}
                    textStyle={styles.customButton2Text}
                  />
                </View>
              </View>
            )}
          </>
        }
      />
      {/* modal na dodawanie ogłoszenia */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false)
          setNewDuo({
            puuid: '',
            positions: [],
            lookedPositions: [],
            minRank: '',
            maxRank: '',
            languages: [],
            championIds: [],
          })
        }}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <FlatList
                  data={[
                    { key: 'Select Riot Account' },
                    { key: 'Your position' },
                    { key: 'Searched position' },
                    { key: 'Min rank' },
                    { key: 'Max rank' },
                    { key: 'Languages' },
                    { key: 'Select Champions' },
                    { key: 'Create Duo' },
                    { key: 'Cancel' },
                  ]}
                  renderItem={({ item }) => {
                    switch (item.key) {
                      case 'Select Riot Account':
                        return (
                          <View>
                            <Text
                              className="text-center"
                              style={styles.customButtonText}
                            >
                              Create a Duo Post
                            </Text>
                            <CustomButton
                              title={
                                selectedProfile
                                  ? selectedProfile.gameName
                                  : 'Select Account'
                              }
                              onPress={() =>
                                openPickerModal(
                                  'Select Riot Account',
                                  riotProfiles.map(
                                    (profile) => profile.gameName
                                  ),
                                  (values) => {
                                    const profile = riotProfiles.find(
                                      (profile) =>
                                        profile.gameName === values[0]
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
                              textStyle={styles.customButtonText}
                            />
                          </View>
                        )
                      case 'Your position':
                        return (
                          <View>
                            <CustomButton
                              title={
                                newDuo.positions.join(', ') || 'Your position'
                              }
                              onPress={() =>
                                openPickerModal(
                                  'Your position',
                                  [
                                    'Top',
                                    'Jungle',
                                    'Mid',
                                    'Bot',
                                    'Support',
                                    'Fill',
                                  ],
                                  (values) =>
                                    setNewDuo({ ...newDuo, positions: values }),
                                  true,
                                  newDuo.positions
                                )
                              }
                              style={styles.customButton}
                              textStyle={styles.customButtonText}
                            />
                          </View>
                        )
                      case 'Searched position':
                        return (
                          <View>
                            <CustomButton
                              title={
                                newDuo.lookedPositions.join(', ') ||
                                'Searched position'
                              }
                              onPress={() =>
                                openPickerModal(
                                  'Searched position',
                                  [
                                    'Top',
                                    'Jungle',
                                    'Mid',
                                    'Bot',
                                    'Support',
                                    'Fill',
                                  ],
                                  (values) =>
                                    setNewDuo({
                                      ...newDuo,
                                      lookedPositions: values,
                                    }),
                                  true,
                                  newDuo.lookedPositions
                                )
                              }
                              style={styles.customButton}
                              textStyle={styles.customButtonText}
                            />
                          </View>
                        )
                      case 'Min rank':
                        return (
                          <View>
                            <CustomButton
                              title={newDuo.minRank || 'Min Rank'}
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
                                    setNewDuo({ ...newDuo, minRank: values[0] })
                                )
                              }
                              style={styles.customButton}
                              textStyle={styles.customButtonText}
                            />
                          </View>
                        )
                      case 'Max rank':
                        return (
                          <View>
                            <CustomButton
                              title={newDuo.maxRank || 'Max Rank'}
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
                                    setNewDuo({ ...newDuo, maxRank: values[0] })
                                )
                              }
                              style={styles.customButton}
                              textStyle={styles.customButtonText}
                            />
                          </View>
                        )
                      case 'Languages':
                        return (
                          <View>
                            <CustomButton
                              title={newDuo.languages.join(', ') || 'Languages'}
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
                                  (values) =>
                                    setNewDuo({ ...newDuo, languages: values }),
                                  true,
                                  newDuo.languages
                                )
                              }
                              style={styles.customButton}
                              textStyle={styles.customButtonText}
                            />
                          </View>
                        )
                      case 'Select Champions':
                        return (
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
                                    setNewDuo({
                                      ...newDuo,
                                      championIds: selectedIds,
                                    })
                                  },
                                  true,
                                  newDuo.championIds.map((id) => champions[id])
                                )
                              }
                              style={styles.customButton}
                              textStyle={styles.customButtonText}
                            />
                          </View>
                        )

                      default:
                        return null
                    }
                  }}
                />
                <View>
                  <CustomButton
                    title="Create Duo"
                    onPress={handleCreateDuo}
                    style={styles.customButton2}
                    textStyle={styles.customButton2Text}
                  />
                </View>
                <View>
                  <CustomButton
                    title="Cancel"
                    onPress={() => {
                      setModalVisible(false)
                      setNewDuo({
                        puuid: '',
                        positions: [],
                        lookedPositions: [],
                        minRank: '',
                        maxRank: '',
                        languages: [],
                        championIds: [],
                      })
                    }}
                    style={styles.customButton}
                    textStyle={styles.customButtonText}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
                <Text className="text-bialas">{pickerModal.type}</Text>
                <FlatList
                  data={pickerModal.options}
                  keyExtractor={(item) => item}
                  renderItem={({ item: option }) => (
                    <TouchableOpacity
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
                              ).find((key) => champions[key] === option)}.png`,
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
                  )}
                />
                <View style={styles.buttonContainer}>
                  {pickerModal.multiSelect && (
                    <CustomButton
                      title="Done"
                      onPress={() => {
                        pickerModal.onSelect(pickerModal.selectedValues)
                        setPickerModal({ ...pickerModal, visible: false })
                      }}
                      style={styles.customButton}
                      textStyle={styles.customButtonText}
                    />
                  )}
                  <CustomButton
                    title="Back"
                    onPress={() =>
                      setPickerModal({ ...pickerModal, visible: false })
                    }
                    style={styles.customButton}
                    textStyle={styles.customButtonText}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* modal na aplikowanie do duo */}
      <Modal
        visible={applyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setApplyModalVisible(false)
          setApplyMessage('')
        }}
      >
        <TouchableWithoutFeedback onPress={() => setApplyModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text className="text-center" style={styles.customButtonText}>
                  Apply for Duo
                </Text>
                <CustomButton
                  title={
                    selectedProfile
                      ? selectedProfile.gameName
                      : 'Select Account'
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
                        }
                      }
                    )
                  }
                  style={styles.customButton}
                  textStyle={styles.customButtonText}
                />
                <View>
                  <CustomButton
                    title="Apply"
                    onPress={handleApplyForDuo}
                    style={styles.customButton2}
                    textStyle={styles.customButton2Text}
                  />
                </View>
                <View>
                  <CustomButton
                    title="Cancel"
                    onPress={() => {
                      setApplyModalVisible(false)
                      setApplyMessage('')
                    }}
                    style={styles.customButton}
                    textStyle={styles.customButtonText}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    backgroundColor: '#131313',
    padding: 15,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    width: '80%',
    maxHeight: '80%',
  },
  option: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#F5F5F5',
  },
  selectedOption: {
    color: '#F5B800',
  },
  customButton: {
    backgroundColor: '#13131313',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
  },
  customButtonText: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customButton2: {
    backgroundColor: '#F5B800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
  },
  customButton2Text: {
    color: '#131313',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 0,
  },
  applyButton: {
    backgroundColor: '#F5B800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#131313',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#1E1E1E',
    color: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    marginVertical: 10,
  },
})

export default DuosPage
