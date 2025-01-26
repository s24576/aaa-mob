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
} from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getDuos } from '../api/duo/getDuos'
import { createDuo } from '../api/duo/createDuo'
import { getMyRiotProfiles } from '../api/riot/getMyRiotProfiles'
import { getChampionNames } from '../api/ddragon/getChampionNames'
import { getVersion } from '../api/ddragon/version'
import { useNavigation } from '@react-navigation/native'
import { DuoScreenProps } from '../App'
import { answerDuo } from '../api/duo/answerDuo'
import servers from '../assets/servers.json'
import { Ionicons } from '@expo/vector-icons'
import styles from '../styles/BrowserStyles'

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
  const [page, setPage] = useState(0)
  const size = 5
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
  const [version, setVersion] = useState<string>('')
  const [filters, setFilters] = useState<SearchDuo>({
    minRank: '',
    maxRank: '',
    positions: [],
    champions: [],
    languages: [],
  })

  const navigation = useNavigation<DuoScreenProps['navigation']>()

  const duosQueries = useQuery({
    queryKey: ['Duos', filters, page],
    queryFn: () =>
      getDuos(filters, { page, size: 5, sort: 'timestamp', direction: 'DESC' }),
  })

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
      duosQueries.refetch()
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
    duosQueries.refetch()
  }

  const handleDuoAnwserPress = () => {
    navigation.navigate('DuoAnswers')
  }

  const handleMemberPress = (username: string) => {
    navigation.navigate('LockInProfile', { username })
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
      duosQueries.refetch()
    } catch (error) {
      console.error('Error applying for duo:', error)
      console.log(answerDuo, answer)
    }
  }
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1)
    duosQueries.refetch()
  }

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1)
      duosQueries.refetch()
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
    English: require('../assets/flags/united-kingdom.png'),
    German: require('../assets/flags/germany.png'),
    French: require('../assets/flags/france.png'),
    Spanish: require('../assets/flags/spain.png'),
    Polish: require('../assets/flags/poland.png'),
    Chinese: require('../assets/flags/china.png'),
    Japanese: require('../assets/flags/japan.png'),
    Korean: require('../assets/flags/south-korea.png'),
    Other: require('../assets/flags/united-nations.png'),
  }

  const handleProfilePress = (server: string, puuid: string) => {
    navigation.navigate('RiotProfile', { server, puuid })
  }

  const renderDuo = ({ item }: { item: Duo }) => {
    const serverName =
      servers.find((s) => s.code === item.server)?.name || item.server
    const dateCreated = new Date(item.timestamp * 1000).toLocaleDateString()

    return (
      <View style={styles.answerContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.duoText, styles.serverName]}>{serverName}</Text>
          <TouchableOpacity onPress={() => handleMemberPress(item.author)}>
            <Text style={styles.authorText}>{item.author}</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>{dateCreated}</Text>
        </View>
        <View style={styles.bodyContainer}>
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
          <TouchableOpacity
            onPress={() =>
              handleProfilePress(
                item.server,
                item.puuid.split('_').slice(1).join('_')
              )
            }
          >
            <Text style={styles.authorText}>Go to Riot Profile</Text>
          </TouchableOpacity>
          <View className="flex-row items-center justify-space-between">
            <View className="flex-1 items-start">
              <Text style={[styles.duoText, styles.positionsText]}>
                Looked Positions:
              </Text>
              <Text style={styles.duoText}>Played Positions:</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <View style={styles.positionContainer}>
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
                  {item.lookedPositions.map((position) => (
                    <Image
                      key={position}
                      source={positionImages[position]}
                      style={styles.positionImageLarge}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
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

  if (duosQueries.isLoading) {
    return (
      <View className="bg-wegielek">
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }

  if (duosQueries.error) {
    return (
      <Text className="text-bialas">Error: {duosQueries.error.message}</Text>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={30} color="#F5B800" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Duo Browser:</Text>
      </View>
      <FlatList
        data={duosQueries.data?.content}
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
                          filters.minRank ? (
                            <Image
                              source={rankImages[filters.minRank]}
                              style={styles.rankImageDuo}
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
                              setFilters({
                                ...filters,
                                minRank: values[0],
                              }),
                            false
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
                          filters.maxRank ? (
                            <Image
                              source={rankImages[filters.maxRank]}
                              style={styles.rankImageDuo}
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
                              setFilters({
                                ...filters,
                                maxRank: values[0],
                              }),
                            false
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
                      filters.positions.length ? (
                        <View style={styles.positionContainer}>
                          {filters.positions.map((position) => (
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
                      filters.languages.length ? (
                        <View style={styles.languageContainer}>
                          {filters.languages.map((language) => (
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
                      filters.champions.length ? (
                        <View style={styles.championContainer}>
                          {filters.champions.map((championId) => (
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
                          setFilters({
                            ...filters,
                            champions: selectedIds,
                          })
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
          </View>
        }
      />
      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={handlePreviousPage} disabled={page === 0}>
          <Ionicons name="arrow-back" size={30} color="#F5B800" />
        </TouchableOpacity>
        <Text style={styles.pageNumber}>{page + 1}</Text>
        <TouchableOpacity onPress={handleNextPage}>
          <Ionicons name="arrow-forward" size={30} color="#F5B800" />
        </TouchableOpacity>
      </View>
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
                                    style={styles.rankImageDuo}
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
                                    style={styles.rankImageDuo}
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
                <Text style={[styles.modalTitle, styles.duoText]}>
                  {pickerModal.type}
                </Text>
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
                      <View style={styles.modalOptionContainer}>
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
                        ) : pickerModal.type === 'Min rank' ||
                          pickerModal.type === 'Max rank' ? (
                          <Image
                            source={rankImages[option]}
                            style={{ width: 30, height: 30, marginRight: 10 }}
                          />
                        ) : null}
                        <Text
                          style={[
                            styles.modalOptionText,
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
                <View style={styles.buttonContainerDuo}>
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

export default DuosPage
