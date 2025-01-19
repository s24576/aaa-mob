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
import servers from '../assets/servers.json'

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
  const [tempFilters, setTempFilters] = useState<SearchDuo>({
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
    setTempFilters({
      minRank: '',
      maxRank: '',
      positions: [],
      champions: [],
      languages: [],
    })
    refetchDuos()
  }

  const applyFilters = () => {
    setFilters(tempFilters)
    setFiltersVisible(false)
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
    Iron: require('../assets/ranks/IRON.png'),
    Bronze: require('../assets/ranks/BRONZE.png'),
    Silver: require('../assets/ranks/SILVER.png'),
    Gold: require('../assets/ranks/GOLD.png'),
    Platinum: require('../assets/ranks/PLATINUM.png'),
    Emerald: require('../assets/ranks/EMERALD.png'),
    Diamond: require('../assets/ranks/DIAMOND.png'),
    Master: require('../assets/ranks/MASTER.png'),
    Grandmaster: require('../assets/ranks/GRANDMASTER.png'),
    Challenger: require('../assets/ranks/CHALLENGER.png'),
    Unranked: require('../assets/ranks/UNRANKED.png'),
  }

  const positionImages: { [key: string]: any } = {
    Top: require('../assets/positions/Top.png'),
    Jungle: require('../assets/positions/Jungle.png'),
    Mid: require('../assets/positions/Mid.png'),
    Bot: require('../assets/positions/Bot.png'),
    Support: require('../assets/positions/Support.png'),
    Fill: require('../assets/positions/Fill.png'),
  }

  const languageFlags: { [key: string]: any } = {
    English: require('../assets/flags/GB.png'),
    German: require('../assets/flags/DE.png'),
    French: require('../assets/flags/FR.png'),
    Spanish: require('../assets/flags/ES.png'),
    Polish: require('../assets/flags/PL.png'),
    Chinese: require('../assets/flags/CN.png'),
    Japanese: require('../assets/flags/JP.png'),
    Korean: require('../assets/flags/KR.png'),
    Other: require('../assets/flags/OTHER.png'),
  }

  const renderDuo = ({ item }: { item: Duo }) => {
    const serverName =
      servers.find((s) => s.code === item.server)?.name || item.server
    const dateCreated = new Date(item.timestamp * 1000).toLocaleDateString()

    return (
      <View style={styles.duoContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.authorText}>{item.author}</Text>
          <Text style={styles.duoText}>{serverName}</Text>
          <Text style={styles.dateText}>{dateCreated}</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.authorText}>Go to Riot Profile</Text>
          <View style={styles.rankContainer}>
            <Image
              source={rankImages[item.minRank] || rankImages['UNRANKED']}
              style={styles.rankImageLarge}
            />
            <Text style={styles.duoText}>-</Text>
            <Image
              source={rankImages[item.maxRank] || rankImages['UNRANKED']}
              style={styles.rankImageLarge}
            />
          </View>
          <View style={styles.positionContainer}>
            <Text style={styles.duoText}>Positions:</Text>
            {item.positions.map((position) => (
              <Image
                key={position}
                source={positionImages[position]}
                style={styles.positionImageLarge}
              />
            ))}
          </View>
          {item.lookedPositions && (
            <View style={styles.positionContainer}>
              <Text style={styles.duoText}>Looked Positions:</Text>
              {item.lookedPositions.map((position) => (
                <Image
                  key={position}
                  source={positionImages[position]}
                  style={styles.positionImageLarge}
                />
              ))}
            </View>
          )}
          <View style={styles.languageContainer}>
            {item.languages.map((language) => (
              <Image
                key={language}
                source={languageFlags[language]}
                style={styles.languageFlag}
              />
            ))}
          </View>
          <View style={styles.championContainer}>
            {item.championIds.map((championId) => (
              <View key={championId} style={styles.championItem}>
                <Image
                  source={{
                    uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championId}.png`,
                  }}
                  style={styles.championImageLarge}
                />
                <Text style={styles.duoText}>{champions[championId]}</Text>
              </View>
            ))}
          </View>
        </View>
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
  }

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
    <View className="pt-2">
      <FlatList
        data={Duos?.content}
        keyExtractor={(item) => item._id}
        renderItem={renderDuo}
        ListEmptyComponent={
          <Text style={styles.customButtonText}>No posts found.</Text>
        }
        ListHeaderComponent={
          <View className="p-5">
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
                        title={
                          tempFilters.minRank ? (
                            <Image
                              source={rankImages[tempFilters.minRank]}
                              style={styles.rankImage}
                            />
                          ) : (
                            'Min Rank'
                          )
                        }
                        onPress={() =>
                          openPickerModal(
                            'Min rank',
                            Object.keys(rankImages),
                            (values) =>
                              setTempFilters({
                                ...tempFilters,
                                minRank: values[0],
                              }),
                            true
                          )
                        }
                        style={styles.customButton}
                        textStyle={styles.customButtonText}
                      />
                    </View>
                    <Text className="text-bialas text-center pt-2">-</Text>
                    <View className="flex-1 items-start pl-2">
                      <CustomButton
                        title={
                          tempFilters.maxRank ? (
                            <Image
                              source={rankImages[tempFilters.maxRank]} //tutaj zrobic tak jak w innych
                              style={styles.rankImage}
                            />
                          ) : (
                            'Max Rank'
                          )
                        }
                        onPress={() =>
                          openPickerModal(
                            'Ranks',
                            Object.keys(rankImages),
                            (values) =>
                              setTempFilters({
                                ...tempFilters,
                                maxRank: values[0],
                              }),
                            true
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
                      tempFilters.positions.length ? (
                        <View style={styles.positionContainer}>
                          {tempFilters.positions.map((position) => (
                            <Image
                              key={position}
                              source={positionImages[position]}
                              style={styles.positionImage}
                            />
                          ))}
                        </View>
                      ) : (
                        'Select Positions'
                      )
                    }
                    onPress={() =>
                      openPickerModal(
                        'Positions',
                        Object.keys(positionImages),
                        (values) =>
                          setTempFilters({ ...tempFilters, positions: values }),
                        true,
                        tempFilters.positions
                      )
                    }
                    style={styles.customButton}
                    textStyle={styles.customButtonText}
                  />
                </View>
                <View>
                  <CustomButton
                    title={
                      tempFilters.languages.length ? (
                        <View style={styles.languageContainer}>
                          {tempFilters.languages.map((language) => (
                            <Image
                              key={language}
                              source={languageFlags[language]}
                              style={styles.languageFlag}
                            />
                          ))}
                        </View>
                      ) : (
                        'Select Languages'
                      )
                    }
                    onPress={() =>
                      openPickerModal(
                        'Languages',
                        Object.keys(languageFlags),
                        (values) =>
                          setTempFilters({ ...tempFilters, languages: values }),
                        true,
                        tempFilters.languages
                      )
                    }
                    style={styles.customButton}
                    textStyle={styles.customButtonText}
                  />
                </View>
                <View>
                  <CustomButton
                    title={
                      tempFilters.champions.length ? (
                        <View style={styles.championContainer}>
                          {tempFilters.champions.map((championId) => (
                            <Image
                              key={championId}
                              source={{
                                uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championId}.png`,
                              }}
                              style={styles.championImageLarge}
                            />
                          ))}
                        </View>
                      ) : (
                        'Select Champions'
                      )
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
                          setTempFilters({
                            ...tempFilters,
                            champions: selectedIds,
                          })
                        },
                        true,
                        tempFilters.champions.map((id) => champions[id]).sort()
                      )
                    }
                    style={styles.customButton}
                    textStyle={styles.customButtonText}
                  />
                </View>
                <View>
                  <CustomButton
                    title="Apply Filters"
                    onPress={applyFilters}
                    style={styles.customButton2}
                    textStyle={styles.customButton2Text}
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
          </View>
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
                                newDuo.positions.length ? (
                                  <View style={styles.positionContainer}>
                                    {newDuo.positions.map((position) => (
                                      <Image
                                        key={position}
                                        source={positionImages[position]}
                                        style={styles.positionImage}
                                      />
                                    ))}
                                  </View>
                                ) : (
                                  'Your position'
                                )
                              }
                              onPress={() =>
                                openPickerModal(
                                  'Positions',
                                  Object.keys(positionImages),
                                  (values) =>
                                    setNewDuo({
                                      ...newDuo,
                                      positions: values,
                                    }),
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
                                newDuo.lookedPositions.length ? (
                                  <View style={styles.positionContainer}>
                                    {newDuo.lookedPositions.map((position) => (
                                      <Image
                                        key={position}
                                        source={positionImages[position]}
                                        style={styles.positionImage}
                                      />
                                    ))}
                                  </View>
                                ) : (
                                  'Searched position'
                                )
                              }
                              onPress={() =>
                                openPickerModal(
                                  'Positions',
                                  Object.keys(positionImages),
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
                              title={
                                newDuo.minRank ? (
                                  <Image
                                    source={rankImages[newDuo.minRank]}
                                    style={styles.rankImage}
                                  />
                                ) : (
                                  'Min Rank'
                                )
                              }
                              onPress={() =>
                                openPickerModal(
                                  'Min rank',
                                  Object.keys(rankImages),
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
                              title={
                                newDuo.maxRank ? (
                                  <Image
                                    source={rankImages[newDuo.maxRank]}
                                    style={styles.rankImage}
                                  />
                                ) : (
                                  'Max Rank'
                                )
                              }
                              onPress={() =>
                                openPickerModal(
                                  'Max rank',
                                  Object.keys(rankImages),
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
                              title={
                                newDuo.languages.length ? (
                                  <View style={styles.languageContainer}>
                                    {newDuo.languages.map((language) => (
                                      <Image
                                        key={language}
                                        source={languageFlags[language]}
                                        style={styles.languageFlag}
                                      />
                                    ))}
                                  </View>
                                ) : (
                                  'Languages'
                                )
                              }
                              onPress={() =>
                                openPickerModal(
                                  'Languages',
                                  Object.keys(languageFlags),
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
                                newDuo.championIds.length ? (
                                  <View style={styles.championContainer}>
                                    {newDuo.championIds.map((championId) => (
                                      <Image
                                        key={championId}
                                        source={{
                                          uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championId}.png`,
                                        }}
                                        style={styles.championImageLarge}
                                      />
                                    ))}
                                  </View>
                                ) : (
                                  'Select Champions'
                                )
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
                        ) : pickerModal.type === 'Languages' ? (
                          <Image
                            source={languageFlags[option]}
                            style={{ width: 30, height: 20, marginRight: 10 }}
                          />
                        ) : pickerModal.type === 'Positions' ? (
                          <Image
                            source={positionImages[option]}
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
    fontFamily: 'Chewy-Regular',
    textAlign: 'center',
    alignItems: 'center',
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
    fontFamily: 'Chewy-Regular',
    color: '#131313',
    fontSize: 16,
  },
  buttonContainer: {
    fontFamily: 'Chewy-Regular',
    marginTop: 10,
    marginBottom: 0,
  },
  applyButton: {
    fontFamily: 'Chewy-Regular',
    backgroundColor: '#F5B800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 80,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#131313',
    fontSize: 16,
    fontFamily: 'Chewy-Regular',
  },
  textInput: {
    fontFamily: 'Chewy-Regular',
    backgroundColor: '#1E1E1E',
    color: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    marginVertical: 10,
  },
  duoContainer: {
    padding: 15,
    borderRadius: 10,
    borderBottomColor: '#F5B800',
    borderBottomWidth: 1,
  },
  duoText: {
    color: '#F5F5F5',
    fontFamily: 'Chewy-Regular',
    marginBottom: 5,
  },
  championContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  championItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  rankImage: {
    width: 20,
    height: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  authorText: {
    color: '#F5B800',
    fontFamily: 'Chewy-Regular',
    fontSize: 18,
  },
  dateText: {
    color: '#F5F5F5',
    fontFamily: 'Chewy-Regular',
  },
  positionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  rankImageLarge: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
  },
  positionImageLarge: {
    width: 40,
    height: 40,
  },
  championImageLarge: {
    width: 30,
    height: 30,
    marginRight: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  languageFlag: {
    width: 30,
    height: 20,
    marginRight: 5,
  },
})

export default DuosPage
