import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getBuilds } from '../api/build/getBuilds'
import { getVersion } from '../api/ddragon/version'
import { getChampionNames } from '../api/ddragon/getChampionNames'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { BuildDetailsScreenProps } from '../App'
import { Button } from 'react-native-paper'
import { getRunes } from '../api/ddragon/getRunes'
import { FontAwesome } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

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
  position: string
  timestamp: number
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

const BuildsBrowserPage: React.FC = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<BuildDetailsScreenProps['navigation']>()
  const [selectedChampion, setSelectedChampion] = useState<string | undefined>(
    undefined
  )
  const [menuVisible, setMenuVisible] = useState(false)
  const [authorName, setAuthorName] = useState<string | undefined>(undefined)
  const [filterChampion, setFilterChampion] = useState<string | undefined>(
    undefined
  )
  const [filterAuthorName, setFilterAuthorName] = useState<string | undefined>(
    undefined
  )
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
  const [filtersVisible, setFiltersVisible] = useState(false)

  const {
    data: buildsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['builds', filterChampion, filterAuthorName],
    queryFn: () =>
      getBuilds(filterAuthorName || undefined, filterChampion || undefined),
    enabled: false,
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
    data: champions,
    isLoading: isChampionsLoading,
    error: championsError,
  } = useQuery({
    queryKey: ['champions'],
    queryFn: getChampionNames,
  })

  const {
    data: runesData,
    isLoading: isRunesLoading,
    error: runesError,
  } = useQuery({
    queryKey: ['runes'],
    queryFn: getRunes,
  })

  useFocusEffect(
    React.useCallback(() => {
      if (!filterChampion && !filterAuthorName) {
        refetch()
      }
    }, [refetch, filterChampion, filterAuthorName])
  )

  useEffect(() => {
    if (filterChampion !== undefined || filterAuthorName !== undefined) {
      refetch()
    }
  }, [filterChampion, filterAuthorName, refetch])

  if (
    isLoading ||
    isVersionLoading ||
    isFetching ||
    isChampionsLoading ||
    isRunesLoading
  ) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text style={styles.text}>Loading...</Text>
      </View>
    )
  }

  if (error || versionError || championsError || runesError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text style={styles.text}>
          Error:{' '}
          {(error || versionError || championsError || runesError)?.message}
        </Text>
      </View>
    )
  }

  const handleBuildPress = (buildId: string) => {
    console.log('buildId:', buildId)
    navigation.navigate('BuildDetails', { buildId })
  }

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

  const positions: { [key: string]: any } = {
    Top: require('../assets/positions/Top.png'),
    Jungle: require('../assets/positions/Jungle.png'),
    Mid: require('../assets/positions/Mid.png'),
    Bottom: require('../assets/positions/Bot.png'),
    Support: require('../assets/positions/Support.png'),
  }

  const renderBuild = ({ item }: { item: Build }) => (
    <TouchableOpacity
      onPress={() => handleBuildPress(item._id)}
      style={styles.container}
    >
      {/* BUILD */}
      <View className="p-4 border-b border-[#F5B800]">
        <View style={styles.header}>
          <Text
            style={styles.text}
            className="text-zoltek font-PoetsenOne-Regular"
          >
            {item.username}
          </Text>
          <Text style={styles.text}>
            {new Date(item.timestamp * 1000).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.subheader}>
          <Text style={styles.title} className="text-bialas font-chewy">
            {item.title}
          </Text>
        </View>
        <View style={styles.thirdRow}>
          <Image
            source={{
              uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${item.championId}.png`,
            }}
            style={styles.champion}
          />
          {/* POZYCJA */}
          {item.position && (
            <Image source={positions[item.position]} className="w-14 h-14" />
          )}
          {item.runes && (
            <View className=" flex-row">
              <View className="flex-row items-center">
                {item.runes.runes1.length > 0 && (
                  <Image
                    source={{
                      uri: `https://ddragon.leagueoflegends.com/cdn/img/${findRuneById(item.runes.runes1[0])?.icon}`,
                    }}
                    className="w-12 h-12"
                  />
                )}
              </View>
              <View className="flex-row items-center ml-4">
                {item.runes.keyStone2Id && (
                  <Image
                    source={{
                      uri: `https://ddragon.leagueoflegends.com/cdn/img/${findRuneTreeById(item.runes.keyStone2Id)?.icon}`,
                    }}
                    className="w-8 h-8"
                  />
                )}
              </View>
            </View>
          )}
        </View>
        <View style={styles.fifthRow}>
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
              style={styles.leagueItem}
            />
          ))}
        </View>
        <View className="flex-row justify-center space-x-4">
          <FontAwesome name="thumbs-up" size={24} color="#F5B800" />
          <Text className="text-zoltek font-chewy text-lg ml-2">
            {item.likesCount || 0}
          </Text>
          <FontAwesome name="thumbs-down" size={24} color="#F5B800" />
          <Text className="text-zoltek font-chewy text-lg ml-2">
            {item.dislikesCount || 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const toggleMenu = () => setMenuVisible(!menuVisible)

  const handleChampionSelect = (selectedChampions: string[]) => {
    const selectedChampionKey = Object.keys(champions).find(
      (key) => champions[key] === selectedChampions[0]
    )
    setSelectedChampion(selectedChampionKey)
    setPickerModal({ ...pickerModal, visible: false })
  }

  const handleFilterPress = () => {
    setFilterChampion(selectedChampion)
    setFilterAuthorName(authorName)
    refetch()
  }

  const handleClearFilters = () => {
    setSelectedChampion(undefined)
    setAuthorName(undefined)
    setFilterChampion(undefined)
    setFilterAuthorName(undefined)
    refetch()
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

  return (
    <>
      <FlatList
        data={buildsData?.content || []}
        keyExtractor={(item) => item._id}
        renderItem={renderBuild}
        ListHeaderComponent={
          <View className="p-5">
            <CustomButton
              title={filtersVisible ? t('hideFilters') : t('filters')}
              onPress={() => setFiltersVisible(!filtersVisible)}
              style={styles.filtersButton}
              textStyle={styles.filtersButtonText}
            />
            {filtersVisible && (
              <>
                <CustomButton
                  title={
                    selectedChampion ? (
                      <View style={styles.selectedChampionContainer}>
                        <Image
                          source={{
                            uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${selectedChampion}.png`,
                          }}
                          style={styles.championImage}
                        />
                        <Text style={styles.selectedChampionText}>
                          {champions[selectedChampion]}
                        </Text>
                      </View>
                    ) : (
                      t('selectChampions')
                    )
                  }
                  onPress={() =>
                    openPickerModal(
                      t('selectChampions'),
                      Object.keys(champions)
                        .sort()
                        .map((key) => champions[key]),
                      (values) => handleChampionSelect(values),
                      false,
                      selectedChampion ? [selectedChampion] : []
                    )
                  }
                  style={styles.customButton}
                  textStyle={styles.customButtonText}
                />
                <TextInput
                  placeholder={t('author')}
                  placeholderTextColor="#F5F5F5"
                  value={authorName}
                  onChangeText={setAuthorName}
                  style={styles.textInput}
                />
                <CustomButton
                  title={t('filterBuilds')}
                  onPress={handleFilterPress}
                  style={styles.applyFiltersButton}
                  textStyle={styles.applyFiltersButtonText}
                />
                <CustomButton
                  title={t('clearFilters')}
                  onPress={handleClearFilters}
                  style={styles.customButton2}
                  textStyle={styles.customButton2Text}
                />
              </>
            )}
          </View>
        }
        ListFooterComponent={<View className="mb-1" />}
      />
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
                <Text className="text-bialas font-chewy">
                  {pickerModal.type}
                </Text>
                <FlatList
                  data={pickerModal.options}
                  keyExtractor={(item) => item}
                  renderItem={({ item: option }) => (
                    <TouchableOpacity
                      onPress={() => {
                        pickerModal.onSelect([option])
                        setPickerModal({ ...pickerModal, visible: false })
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
                          className="text-bialas font-chewy"
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
                  <CustomButton
                    title={t('back')}
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
    </>
  )
}

const styles = StyleSheet.create({
  sixthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  champion: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  leagueItem: {
    width: 48,
    height: 48,
    marginRight: 8,
    borderRadius: 10,
  },
  fifthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  thirdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  fourthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  subheader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PoetsenOne-Regular',
    color: '#F5B800',
  },
  text: {
    fontSize: 18,
    fontFamily: 'PoetsenOne-Regular',
    color: '#F5F5F5',
  },
  container: {
    borderBottomColor: '#F5B800',
  },
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
  buttonContainer: {
    marginTop: 10,
    marginBottom: 0,
  },
  applyFiltersButton: {
    backgroundColor: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
    minWidth: '94%',
    maxWidth: '94%',
    paddingHorizontal: 20,
  },
  applyFiltersButtonText: {
    color: '#131313',
    fontSize: 16,
    fontFamily: 'PoetsenOne-Regular',
    textAlign: 'center',
    alignItems: 'center',
  },
  filtersButton: {
    backgroundColor: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
    minWidth: '94%',
    maxWidth: '94%',
    paddingHorizontal: 20,
  },
  filtersButtonText: {
    color: '#131313',
    fontSize: 16,
    fontFamily: 'PoetsenOne-Regular',
    textAlign: 'center',
    alignItems: 'center',
  },
  customButton: {
    backgroundColor: '#13131313',
    fontFamily: 'PoetsenOne-Regular',
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
    minWidth: '94%',
    maxWidth: '94%',
    paddingHorizontal: 20,
  },
  textInput: {
    fontFamily: 'PoetsenOne-Regular',
    backgroundColor: '#1E1E1E',
    color: '#F5F5F5',
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
    minWidth: '94%',
    maxWidth: '94%',
    paddingHorizontal: 20,
  },
  customButtonText: {
    color: '#F5F5F5',
    fontSize: 16,
    fontFamily: 'PoetsenOne-Regular',
    textAlign: 'center',
    alignItems: 'center',
  },
  customButton2: {
    backgroundColor: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
    minWidth: '94%',
    maxWidth: '94%',
    paddingHorizontal: 20,
  },
  customButton2Text: {
    color: '#131313',
    fontSize: 16,
    fontFamily: 'PoetsenOne-Regular',
    textAlign: 'center',
    alignItems: 'center',
  },
  championImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  selectedChampionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedChampionText: {
    color: '#F5F5F5',
    fontSize: 16,
    fontFamily: 'PoetsenOne-Regular',
    marginLeft: 10,
  },
})

export default BuildsBrowserPage
