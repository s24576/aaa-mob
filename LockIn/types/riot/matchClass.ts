export class Metadata {
  dataVersion: string
  matchId: string
  participants: string[]

  constructor(dataVersion: string, matchId: string, participants: string[]) {
    this.dataVersion = dataVersion
    this.matchId = matchId
    this.participants = participants
  }
}

export class PerkSelection {
  perk: number
  var1: number
  var2: number
  var3: number

  constructor(perk: number, var1: number, var2: number, var3: number) {
    this.perk = perk
    this.var1 = var1
    this.var2 = var2
    this.var3 = var3
  }
}

export class PerkStyle {
  description: string
  selections: PerkSelection[]
  style: number

  constructor(description: string, selections: PerkSelection[], style: number) {
    this.description = description
    this.selections = selections
    this.style = style
  }
}

export class Perks {
  statPerks: { defense: number; flex: number; offense: number }
  styles: PerkStyle[]

  constructor(
    statPerks: { defense: number; flex: number; offense: number },
    styles: PerkStyle[]
  ) {
    this.statPerks = statPerks
    this.styles = styles
  }
}

export class Participant {
  allInPings: number
  assistMePings: number
  assists: number
  baitPings: number
  baronKills: number
  basicPings: number
  bountyLevel: number
  challanges: any
  champExpirience: number
  champLevel: number
  championId: number
  championName: string
  championTransform: number
  commandPings: number
  consumablesPurchased: number
  damageDealtToBuildings: number
  damageDealtToObjectives: number
  damageDealtToTurrets: number
  damageSelfMitigated: number
  dangerPings: number
  deaths: number
  detectorWardsPlaced: number
  doubleKills: number
  dragonKills: number
  eligibleForProgression: boolean
  enemyMissingPings: number
  enemyVisionPings: number
  firstBloodAssist: boolean
  firstBloodKill: boolean
  firstTowerAssist: boolean
  firstTowerKill: boolean
  gameEndedInEarlySurrender: boolean
  gameEndedInSurrender: boolean
  getBackPings: number
  goldEarned: number
  goldSpent: number
  holdPings: number
  individualPosition: string
  inhibitorKills: number
  inhibitorTakedowns: number
  inhibitorLost: number
  item0: string
  item1: string
  item2: string
  item3: string
  item4: string
  item5: string
  item6: string
  itemsPurchased: number
  killingSprees: number
  kills: number
  lane: string
  largestCriticalStrike: number
  largestKillingSpree: number
  largestMultiKill: number
  longestTimeSpentLiving: number
  magicDamageDealt: number
  magicDamageDealtToChampions: number
  magicDamageTaken: number
  missions: { [key: string]: number }
  needVisionPings: number
  neutralMinionsKilled: number
  nexusKills: number
  nexusLost: number
  nexusTakedowns: number
  objectivesStolen: number
  objectivesStolenAssists: number
  onMyWayPings: number
  participantId: number
  pentakills: number
  perks: Perks
  physicalDamageDealt: number
  physicalDamageDealtToChampions: number
  physicalDamageTaken: number
  placement: number
  playerAugment1: number
  playerAugment2: number
  playerAugment3: number
  playerAugment4: number
  playerScore0: number
  playerScore1: number
  playerScore10: number
  playerScore11: number
  playerScore2: number
  playerScore3: number
  playerScore4: number
  playerScore5: number
  playerScore6: number
  playerScore7: number
  playerScore8: number
  playerScore9: number
  playerSubteamId: number
  profileIcon: number
  pushPings: number
  puuid: string
  quadraKills: number
  riotIdGameName: string
  riotIdTagLine: string | null
  role: string
  sightWardsBoughtInGame: number
  spell1Casts: number
  spell2Casts: number
  spell3Casts: number
  spell4Casts: number
  subteamPlacement: number
  summoner1Casts: number
  summoner1Id: number
  summoner2Casts: number
  summoner2Id: number
  summonerId: string
  summonerLevel: number
  summonerName: string
  teamEarlySurrendered: boolean
  teamId: string
  teamPosition: string
  timeCCingOthers: number
  timePlayed: number
  totalAllyJungleMinionsKilled: number
  totalDamageDealt: number
  totalDamageDealtToChampions: number
  totalDamageShieldedOnTeammates: number
  totalDamageTaken: number
  totalEnemyJungleMinionsKilled: number
  totalHeal: number
  totalHealsOnTeammates: number
  totalMinionsKilled: number
  totalTimeCCDealt: number
  totalTimeSpentDead: number
  totalUnitsHealed: number
  triplekills: number
  trueDamageDealt: number
  trueDamageDealtToChampions: number
  trueDamageTaken: number
  turretKills: number
  turretTakedowns: number
  turretsLost: number
  unrealKills: number
  visionClearedPings: number
  visionScore: number
  visionWardsBoughtInGame: number
  wardsKilled: number
  wardsPlaced: number
  win: boolean
  rank: string | null
  tier: string | null
  summoner1Name: string
  summoner2Name: string

  constructor(data: Participant) {
    this.allInPings = data.allInPings
    this.assistMePings = data.assistMePings
    this.assists = data.assists
    this.baitPings = data.baitPings
    this.baronKills = data.baronKills
    this.basicPings = data.basicPings
    this.bountyLevel = data.bountyLevel
    this.challanges = data.challanges
    this.champExpirience = data.champExpirience
    this.champLevel = data.champLevel
    this.championId = data.championId
    this.championName = data.championName
    this.championTransform = data.championTransform
    this.commandPings = data.commandPings
    this.consumablesPurchased = data.consumablesPurchased
    this.damageDealtToBuildings = data.damageDealtToBuildings
    this.damageDealtToObjectives = data.damageDealtToObjectives
    this.damageDealtToTurrets = data.damageDealtToTurrets
    this.damageSelfMitigated = data.damageSelfMitigated
    this.dangerPings = data.dangerPings
    this.deaths = data.deaths
    this.detectorWardsPlaced = data.detectorWardsPlaced
    this.doubleKills = data.doubleKills
    this.dragonKills = data.dragonKills
    this.eligibleForProgression = data.eligibleForProgression
    this.enemyMissingPings = data.enemyMissingPings
    this.enemyVisionPings = data.enemyVisionPings
    this.firstBloodAssist = data.firstBloodAssist
    this.firstBloodKill = data.firstBloodKill
    this.firstTowerAssist = data.firstTowerAssist
    this.firstTowerKill = data.firstTowerKill
    this.gameEndedInEarlySurrender = data.gameEndedInEarlySurrender
    this.gameEndedInSurrender = data.gameEndedInSurrender
    this.getBackPings = data.getBackPings
    this.goldEarned = data.goldEarned
    this.goldSpent = data.goldSpent
    this.holdPings = data.holdPings
    this.individualPosition = data.individualPosition
    this.inhibitorKills = data.inhibitorKills
    this.inhibitorTakedowns = data.inhibitorTakedowns
    this.inhibitorLost = data.inhibitorLost
    this.item0 = data.item0
    this.item1 = data.item1
    this.item2 = data.item2
    this.item3 = data.item3
    this.item4 = data.item4
    this.item5 = data.item5
    this.item6 = data.item6
    this.itemsPurchased = data.itemsPurchased
    this.killingSprees = data.killingSprees
    this.kills = data.kills
    this.lane = data.lane
    this.largestCriticalStrike = data.largestCriticalStrike
    this.largestKillingSpree = data.largestKillingSpree
    this.largestMultiKill = data.largestMultiKill
    this.longestTimeSpentLiving = data.longestTimeSpentLiving
    this.magicDamageDealt = data.magicDamageDealt
    this.magicDamageDealtToChampions = data.magicDamageDealtToChampions
    this.magicDamageTaken = data.magicDamageTaken
    this.missions = data.missions
    this.needVisionPings = data.needVisionPings
    this.neutralMinionsKilled = data.neutralMinionsKilled
    this.nexusKills = data.nexusKills
    this.nexusLost = data.nexusLost
    this.nexusTakedowns = data.nexusTakedowns
    this.objectivesStolen = data.objectivesStolen
    this.objectivesStolenAssists = data.objectivesStolenAssists
    this.onMyWayPings = data.onMyWayPings
    this.participantId = data.participantId
    this.pentakills = data.pentakills
    this.perks = data.perks
    this.physicalDamageDealt = data.physicalDamageDealt
    this.physicalDamageDealtToChampions = data.physicalDamageDealtToChampions
    this.physicalDamageTaken = data.physicalDamageTaken
    this.placement = data.placement
    this.playerAugment1 = data.playerAugment1
    this.playerAugment2 = data.playerAugment2
    this.playerAugment3 = data.playerAugment3
    this.playerAugment4 = data.playerAugment4
    this.playerScore0 = data.playerScore0
    this.playerScore1 = data.playerScore1
    this.playerScore10 = data.playerScore10
    this.playerScore11 = data.playerScore11
    this.playerScore2 = data.playerScore2
    this.playerScore3 = data.playerScore3
    this.playerScore4 = data.playerScore4
    this.playerScore5 = data.playerScore5
    this.playerScore6 = data.playerScore6
    this.playerScore7 = data.playerScore7
    this.playerScore8 = data.playerScore8
    this.playerScore9 = data.playerScore9
    this.playerSubteamId = data.playerSubteamId
    this.profileIcon = data.profileIcon
    this.pushPings = data.pushPings
    this.puuid = data.puuid
    this.quadraKills = data.quadraKills
    this.riotIdGameName = data.riotIdGameName
    this.riotIdTagLine = data.riotIdTagLine
    this.role = data.role
    this.sightWardsBoughtInGame = data.sightWardsBoughtInGame
    this.spell1Casts = data.spell1Casts
    this.spell2Casts = data.spell2Casts
    this.spell3Casts = data.spell3Casts
    this.spell4Casts = data.spell4Casts
    this.subteamPlacement = data.subteamPlacement
    this.summoner1Casts = data.summoner1Casts
    this.summoner1Id = data.summoner1Id
    this.summoner2Casts = data.summoner2Casts
    this.summoner2Id = data.summoner2Id
    this.summonerId = data.summonerId
    this.summonerLevel = data.summonerLevel
    this.summonerName = data.summonerName
    this.teamEarlySurrendered = data.teamEarlySurrendered
    this.teamId = data.teamId
    this.teamPosition = data.teamPosition
    this.timeCCingOthers = data.timeCCingOthers
    this.timePlayed = data.timePlayed
    this.totalAllyJungleMinionsKilled = data.totalAllyJungleMinionsKilled
    this.totalDamageDealt = data.totalDamageDealt
    this.totalDamageDealtToChampions = data.totalDamageDealtToChampions
    this.totalDamageShieldedOnTeammates = data.totalDamageShieldedOnTeammates
    this.totalDamageTaken = data.totalDamageTaken
    this.totalEnemyJungleMinionsKilled = data.totalEnemyJungleMinionsKilled
    this.totalHeal = data.totalHeal
    this.totalHealsOnTeammates = data.totalHealsOnTeammates
    this.totalMinionsKilled = data.totalMinionsKilled
    this.totalTimeCCDealt = data.totalTimeCCDealt
    this.totalTimeSpentDead = data.totalTimeSpentDead
    this.totalUnitsHealed = data.totalUnitsHealed
    this.triplekills = data.triplekills
    this.trueDamageDealt = data.trueDamageDealt
    this.trueDamageDealtToChampions = data.trueDamageDealtToChampions
    this.trueDamageTaken = data.trueDamageTaken
    this.turretKills = data.turretKills
    this.turretTakedowns = data.turretTakedowns
    this.turretsLost = data.turretsLost
    this.unrealKills = data.unrealKills
    this.visionClearedPings = data.visionClearedPings
    this.visionScore = data.visionScore
    this.visionWardsBoughtInGame = data.visionWardsBoughtInGame
    this.wardsKilled = data.wardsKilled
    this.wardsPlaced = data.wardsPlaced
    this.win = data.win
    this.rank = data.rank
    this.tier = data.tier
    this.summoner1Name = data.summoner1Name
    this.summoner2Name = data.summoner2Name
  }
}

export class Info {
  gameCreation: string
  gameDuration: number
  gameEndTimestamp: number
  gameId: string
  gameMode: string
  gameName: string
  gameStartTimestamp: number
  gameType: string
  gameVersion: string
  mapId: string
  participants: Participant[]
  platformId: string
  queueId: number
  teams: Team[]
  queueType: string

  constructor(data: Info) {
    this.gameCreation = data.gameCreation
    this.gameDuration = data.gameDuration
    this.gameEndTimestamp = data.gameEndTimestamp
    this.gameId = data.gameId
    this.gameMode = data.gameMode
    this.gameName = data.gameName
    this.gameStartTimestamp = data.gameStartTimestamp
    this.gameType = data.gameType
    this.gameVersion = data.gameVersion
    this.mapId = data.mapId
    this.participants = data.participants.map((p: any) => new Participant(p))
    this.platformId = data.platformId
    this.queueId = data.queueId
    this.teams = data.teams.map((t: any) => new Team(t))
    this.queueType = data.queueType
  }
}

export class Team {
  bans: Ban[]
  objectives: Objectives
  teamId: number
  win: boolean

  constructor(data: Team) {
    this.bans = data.bans.map((b: any) => new Ban(b))
    this.objectives = new Objectives(data.objectives)
    this.teamId = data.teamId
    this.win = data.win
  }
}

export class Ban {
  championId: number
  pickTurn: number

  constructor(data: Ban) {
    this.championId = data.championId
    this.pickTurn = data.pickTurn
  }
}

export class Objectives {
  baron: Objective
  champion: Objective
  dragon: Objective
  horde: Objective
  inhibitor: Objective
  riftHerald: Objective
  tower: Objective

  constructor(data: Objectives) {
    this.baron = new Objective(data.baron)
    this.champion = new Objective(data.champion)
    this.dragon = new Objective(data.dragon)
    this.horde = new Objective(data.horde)
    this.inhibitor = new Objective(data.inhibitor)
    this.riftHerald = new Objective(data.riftHerald)
    this.tower = new Objective(data.tower)
  }
}

export class Objective {
  first: boolean
  kills: number

  constructor(data: Objective) {
    this.first = data.first
    this.kills = data.kills
  }
}
