interface RankData {
  leagueId: string
  summonerId: string
  summonerName: string | null
  queueType: string
  tier: string
  rank: string
  leaguePoints: number
  wins: number
  losses: number
}

interface MasteryData {
  puuid: string
  chestGranted: boolean
  championId: number
  lastPlayTime: number
  championLevel: number
  championPoints: number
  championName: string
}

interface MatchData {
  championName: string
  win: boolean
  queueType: string
  kills: number
  deaths: number
  assists: number
  matchId: string
}

interface ProfileData {
  puuid: string
  gameName: string
  tagLine: string
  server: string
  id: string
  accountId: string
  name: string | null
  profileIconId: string
  revisionDate: number
  summonerLevel: number
  ranks: RankData[]
  mastery: MasteryData[]
  matches: MatchData[]
  rankedTier: string
  rankedRank: string
}

class Rank {
  leagueId: string
  summonerId: string
  summonerName: string | null
  queueType: string
  tier: string
  rank: string
  leaguePoints: number
  wins: number
  losses: number

  constructor(data: RankData) {
    this.leagueId = data.leagueId
    this.summonerId = data.summonerId
    this.summonerName = data.summonerName
    this.queueType = data.queueType
    this.tier = data.tier
    this.rank = data.rank
    this.leaguePoints = data.leaguePoints
    this.wins = data.wins
    this.losses = data.losses
  }
}

class Mastery {
  puuid: string
  chestGranted: boolean
  championId: number
  lastPlayTime: number
  championLevel: number
  championPoints: number
  championName: string

  constructor(data: MasteryData) {
    this.puuid = data.puuid
    this.chestGranted = data.chestGranted
    this.championId = data.championId
    this.lastPlayTime = data.lastPlayTime
    this.championLevel = data.championLevel
    this.championPoints = data.championPoints
    this.championName = data.championName
  }
}

class Match {
  championName: string
  win: boolean
  queueType: string
  kills: number
  deaths: number
  assists: number
  matchId: string

  constructor(data: MatchData) {
    this.championName = data.championName
    this.win = data.win
    this.queueType = data.queueType
    this.kills = data.kills
    this.deaths = data.deaths
    this.assists = data.assists
    this.matchId = data.matchId
  }
}

class Profile {
  puuid: string
  gameName: string
  tagLine: string
  server: string
  id: string
  accountId: string
  name: string | null
  profileIconId: string
  revisionDate: number
  summonerLevel: number
  ranks: Rank[]
  mastery: Mastery[]
  matches: Match[]
  rankedTier: string
  rankedRank: string

  constructor(data: ProfileData) {
    this.puuid = data.puuid
    this.gameName = data.gameName
    this.tagLine = data.tagLine
    this.server = data.server
    this.id = data.id
    this.accountId = data.accountId
    this.name = data.name
    this.profileIconId = data.profileIconId
    this.revisionDate = data.revisionDate
    this.summonerLevel = data.summonerLevel
    this.ranks = data.ranks.map((rank) => new Rank(rank))
    this.mastery = data.mastery.map((mastery) => new Mastery(mastery))
    this.matches = data.matches.map((match) => new Match(match))
    this.rankedTier = data.rankedTier
    this.rankedRank = data.rankedRank
  }
}

export { Profile, Rank, Mastery, Match }
