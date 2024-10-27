// matchClass.ts

export class Metadata {
    dataVersion: string;
    matchId: string;
    participants: string[];

    constructor(dataVersion: string, matchId: string, participants: string[]) {
        this.dataVersion = dataVersion;
        this.matchId = matchId;
        this.participants = participants;
    }
}

export class PerkSelection {
    perk: number;
    var1: number;
    var2: number;
    var3: number;

    constructor(perk: number, var1: number, var2: number, var3: number) {
        this.perk = perk;
        this.var1 = var1;
        this.var2 = var2;
        this.var3 = var3;
    }
}

export class PerkStyle {
    description: string;
    selections: PerkSelection[];
    style: number;

    constructor(description: string, selections: PerkSelection[], style: number) {
        this.description = description;
        this.selections = selections;
        this.style = style;
    }
}

export class Perks {
    statPerks: { defense: number; flex: number; offense: number };
    styles: PerkStyle[];

    constructor(statPerks: { defense: number; flex: number; offense: number }, styles: PerkStyle[]) {
        this.statPerks = statPerks;
        this.styles = styles;
    }
}

export class Participant {
    allInPings: number;
    assistMePings: number;
    assists: number;
    baitPings: number;
    baronKills: number;
    basicPings: number;
    bountyLevel: number;
    challanges: any;
    champExpirience: number;
    champLevel: number;
    championId: number;
    championName: string;
    championTransform: number;
    commandPings: number;
    consumablesPurchased: number;
    damageDealtToBuildings: number;
    damageDealtToObjectives: number;
    damageDealtToTurrets: number;
    damageSelfMitigated: number;
    dangerPings: number;
    deaths: number;
    detectorWardsPlaced: number;
    doubleKills: number;
    dragonKills: number;
    eligibleForProgression: boolean;
    enemyMissingPings: number;
    enemyVisionPings: number;
    firstBloodAssist: boolean;
    firstBloodKill: boolean;
    firstTowerAssist: boolean;
    firstTowerKill: boolean;
    gameEndedInEarlySurrender: boolean;
    gameEndedInSurrender: boolean;
    getBackPings: number;
    goldEarned: number;
    goldSpent: number;
    holdPings: number;
    individualPosition: string;
    inhibitorKills: number;
    inhibitorTakedowns: number;
    inhibitorLost: number;
    item0: string;
    item1: string;
    item2: string;
    item3: string;
    item4: string;
    item5: string;
    item6: string;
    itemsPurchased: number;
    killingSprees: number;
    kills: number;
    lane: string;
    largestCriticalStrike: number;
    largestKillingSpree: number;
    largestMultiKill: number;
    longestTimeSpentLiving: number;
    magicDamageDealt: number;
    magicDamageDealtToChampions: number;
    magicDamageTaken: number;
    missions: { [key: string]: number };
    needVisionPings: number;
    neutralMinionsKilled: number;
    nexusKills: number;
    nexusLost: number;
    nexusTakedowns: number;
    objectivesStolen: number;
    objectivesStolenAssists: number;
    onMyWayPings: number;
    participantId: number;
    pentakills: number;
    perks: Perks;
    physicalDamageDealt: number;
    physicalDamageDealtToChampions: number;
    physicalDamageTaken: number;
    placement: number;
    playerAugment1: number;
    playerAugment2: number;
    playerAugment3: number;
    playerAugment4: number;
    playerScore0: number;
    playerScore1: number;
    playerScore10: number;
    playerScore11: number;
    playerScore2: number;
    playerScore3: number;
    playerScore4: number;
    playerScore5: number;
    playerScore6: number;
    playerScore7: number;
    playerScore8: number;
    playerScore9: number;
    playerSubteamId: number;
    profileIcon: number;
    pushPings: number;
    puuid: string;
    quadraKills: number;
    riotIdGameName: string;
    riotIdTagLine: string | null;
    role: string;
    sightWardsBoughtInGame: number;
    spell1Casts: number;
    spell2Casts: number;
    spell3Casts: number;
    spell4Casts: number;
    subteamPlacement: number;
    summoner1Casts: number;
    summoner1Id: number;
    summoner2Casts: number;
    summoner2Id: number;
    summonerId: string;
    summonerLevel: number;
    summonerName: string;
    teamEarlySurrendered: boolean;
    teamId: string;
    teamPosition: string;
    timeCCingOthers: number;
    timePlayed: number;
    totalAllyJungleMinionsKilled: number;
    totalDamageDealt: number;
    totalDamageDealtToChampions: number;
    totalDamageShieldedOnTeammates: number;
    totalDamageTaken: number;
    totalEnemyJungleMinionsKilled: number;
    totalHeal: number;
    totalHealsOnTeammates: number;
    totalMinionsKilled: number;
    totalTimeCCDealt: number;
    totalTimeSpentDead: number;
    totalUnitsHealed: number;
    triplekills: number;
    trueDamageDealt: number;
    trueDamageDealtToChampions: number;
    trueDamageTaken: number;
    turretKills: number;
    turretTakedowns: number;
    turretsLost: number;
    unrealKills: number;
    visionClearedPings: number;
    visionScore: number;
    visionWardsBoughtInGame: number;
    wardsKilled: number;
    wardsPlaced: number;
    win: boolean;
    rank: string | null;
    tier: string | null;
    summoner1Name: string;
    summoner2Name: string;

    constructor(
        allInPings: number,
        assistMePings: number,
        assists: number,
        baitPings: number,
        baronKills: number,
        basicPings: number,
        bountyLevel: number,
        challanges: any,
        champExpirience: number,
        champLevel: number,
        championId: number,
        championName: string,
        championTransform: number,
        commandPings: number,
        consumablesPurchased: number,
        damageDealtToBuildings: number,
        damageDealtToObjectives: number,
        damageDealtToTurrets: number,
        damageSelfMitigated: number,
        dangerPings: number,
        deaths: number,
        detectorWardsPlaced: number,
        doubleKills: number,
        dragonKills: number,
        eligibleForProgression: boolean,
        enemyMissingPings: number,
        enemyVisionPings: number,
        firstBloodAssist: boolean,
        firstBloodKill: boolean,
        firstTowerAssist: boolean,
        firstTowerKill: boolean,
        gameEndedInEarlySurrender: boolean,
        gameEndedInSurrender: boolean,
        getBackPings: number,
        goldEarned: number,
        goldSpent: number,
        holdPings: number,
        individualPosition: string,
        inhibitorKills: number,
        inhibitorTakedowns: number,
        inhibitorLost: number,
        item0: string,
        item1: string,
        item2: string,
        item3: string,
        item4: string,
        item5: string,
        item6: string,
        itemsPurchased: number,
        killingSprees: number,
        kills: number,
        lane: string,
        largestCriticalStrike: number,
        largestKillingSpree: number,
        largestMultiKill: number,
        longestTimeSpentLiving: number,
        magicDamageDealt: number,
        magicDamageDealtToChampions: number,
        magicDamageTaken: number,
        missions: { [key: string]: number },
        needVisionPings: number,
        neutralMinionsKilled: number,
        nexusKills: number,
        nexusLost: number,
        nexusTakedowns: number,
        objectivesStolen: number,
        objectivesStolenAssists: number,
        onMyWayPings: number,
        participantId: number,
        pentakills: number,
        perks: Perks,
        physicalDamageDealt: number,
        physicalDamageDealtToChampions: number,
        physicalDamageTaken: number,
        placement: number,
        playerAugment1: number,
        playerAugment2: number,
        playerAugment3: number,
        playerAugment4: number,
        playerScore0: number,
        playerScore1: number,
        playerScore10: number,
        playerScore11: number,
        playerScore2: number,
        playerScore3: number,
        playerScore4: number,
        playerScore5: number,
        playerScore6: number,
        playerScore7: number,
        playerScore8: number,
        playerScore9: number,
        playerSubteamId: number,
        profileIcon: number,
        pushPings: number,
        puuid: string,
        quadraKills: number,
        riotIdGameName: string,
        riotIdTagLine: string | null,
        role: string,
        sightWardsBoughtInGame: number,
        spell1Casts: number,
        spell2Casts: number,
        spell3Casts: number,
        spell4Casts: number,
        subteamPlacement: number,
        summoner1Casts: number,
        summoner1Id: number,
        summoner2Casts: number,
        summoner2Id: number,
        summonerId: string,
        summonerLevel: number,
        summonerName: string,
        teamEarlySurrendered: boolean,
        teamId: string,
        teamPosition: string,
        timeCCingOthers: number,
        timePlayed: number,
        totalAllyJungleMinionsKilled: number,
        totalDamageDealt: number,
        totalDamageDealtToChampions: number,
        totalDamageShieldedOnTeammates: number,
        totalDamageTaken: number,
        totalEnemyJungleMinionsKilled: number,
        totalHeal: number,
        totalHealsOnTeammates: number,
        totalMinionsKilled: number,
        totalTimeCCDealt: number,
        totalTimeSpentDead: number,
        totalUnitsHealed: number,
        triplekills: number,
        trueDamageDealt: number,
        trueDamageDealtToChampions: number,
        trueDamageTaken: number,
        turretKills: number,
        turretTakedowns: number,
        turretsLost: number,
        unrealKills: number,
        visionClearedPings: number,
        visionScore: number,
        visionWardsBoughtInGame: number,
        wardsPlaced: number,
        wardsKilled: number,
        win: boolean,
        rank: string | null,
        tier: string | null,
        summoner1Name: string,
        summoner2Name: string
    ) {
        this.allInPings = allInPings;
        this.assistMePings = assistMePings;
        this.assists = assists;
        this.baitPings = baitPings;
        this.baronKills = baronKills;
        this.basicPings = basicPings;
        this.bountyLevel = bountyLevel;
        this.challanges = challanges;
        this.champExpirience = champExpirience;
        this.champLevel = champLevel;
        this.championId = championId;
        this.championName = championName;
        this.championTransform = championTransform;
        this.commandPings = commandPings;
        this.consumablesPurchased = consumablesPurchased;
        this.damageDealtToBuildings = damageDealtToBuildings;
        this.damageDealtToObjectives = damageDealtToObjectives;
        this.damageDealtToTurrets = damageDealtToTurrets;
        this.damageSelfMitigated = damageSelfMitigated;
        this.dangerPings = dangerPings;
        this.deaths = deaths;
        this.detectorWardsPlaced = detectorWardsPlaced;
        this.doubleKills = doubleKills;
        this.dragonKills = dragonKills;
        this.eligibleForProgression = eligibleForProgression;
        this.enemyMissingPings = enemyMissingPings;
        this.enemyVisionPings = enemyVisionPings;
        this.firstBloodAssist = firstBloodAssist;
        this.firstBloodKill = firstBloodKill;
        this.firstTowerAssist = firstTowerAssist;
        this.firstTowerKill = firstTowerKill;
        this.gameEndedInEarlySurrender = gameEndedInEarlySurrender;
        this.gameEndedInSurrender = gameEndedInSurrender;
        this.getBackPings = getBackPings;
        this.goldEarned = goldEarned;
        this.goldSpent = goldSpent;
        this.holdPings = holdPings;
        this.individualPosition = individualPosition;
        this.inhibitorKills = inhibitorKills;
        this.inhibitorTakedowns = inhibitorTakedowns;
        this.inhibitorLost = inhibitorLost;
        this.item0 = item0;
        this.item1 = item1;
        this.item2 = item2;
        this.item3 = item3;
        this.item4 = item4;
        this.item5 = item5;
        this.item6 = item6;
        this.itemsPurchased = itemsPurchased;
        this.killingSprees = killingSprees;
        this.kills = kills;
        this.lane = lane;
        this.largestCriticalStrike = largestCriticalStrike;
        this.largestKillingSpree = largestKillingSpree;
        this.largestMultiKill = largestMultiKill;
        this.longestTimeSpentLiving = longestTimeSpentLiving;
        this.magicDamageDealt = magicDamageDealt;
        this.magicDamageDealtToChampions = magicDamageDealtToChampions;
        this.magicDamageTaken = magicDamageTaken;
        this.missions = missions;
        this.needVisionPings = needVisionPings;
        this.neutralMinionsKilled = neutralMinionsKilled;
        this.nexusKills = nexusKills;
        this.nexusLost = nexusLost;
        this.nexusTakedowns = nexusTakedowns;
        this.objectivesStolen = objectivesStolen;
        this.objectivesStolenAssists = objectivesStolenAssists;
        this.onMyWayPings = onMyWayPings;
        this.participantId = participantId;
        this.pentakills = pentakills;
        this.perks = perks;
        this.physicalDamageDealt = physicalDamageDealt;
        this.physicalDamageDealtToChampions = physicalDamageDealtToChampions;
        this.physicalDamageTaken = physicalDamageTaken;
        this.placement = placement;
        this.playerAugment1 = playerAugment1;
        this.playerAugment2 = playerAugment2;
        this.playerAugment3 = playerAugment3;
        this.playerAugment4 = playerAugment4;
        this.playerScore0 = playerScore0;
        this.playerScore1 = playerScore1;
        this.playerScore10 = playerScore10;
        this.playerScore11 = playerScore11;
        this.playerScore2 = playerScore2;
        this.playerScore3 = playerScore3;
        this.playerScore4 = playerScore4;
        this.playerScore5 = playerScore5;
        this.playerScore6 = playerScore6;
        this.playerScore7 = playerScore7;
        this.playerScore8 = playerScore8;
        this.playerScore9 = playerScore9;
        this.playerSubteamId = playerSubteamId;
        this.profileIcon = profileIcon;
        this.pushPings = pushPings;
        this.puuid = puuid;
        this.quadraKills = quadraKills;
        this.riotIdGameName = riotIdGameName;
        this.riotIdTagLine = riotIdTagLine;
        this.role = role;
        this.sightWardsBoughtInGame = sightWardsBoughtInGame;
        this.spell1Casts = spell1Casts;
        this.spell2Casts = spell2Casts;
        this.spell3Casts = spell3Casts;
        this.spell4Casts = spell4Casts;
        this.subteamPlacement = subteamPlacement;
        this.summoner1Casts = summoner1Casts;
        this.summoner1Id = summoner1Id;
        this.summoner2Casts = summoner2Casts;
        this.summoner2Id = summoner2Id;
        this.summonerId = summonerId;
        this.summonerLevel = summonerLevel;
        this.summonerName = summonerName;
        this.teamEarlySurrendered = teamEarlySurrendered;
        this.teamId = teamId;
        this.teamPosition = teamPosition;
        this.timeCCingOthers = timeCCingOthers;
        this.timePlayed = timePlayed;
        this.totalAllyJungleMinionsKilled = totalAllyJungleMinionsKilled;
        this.totalDamageDealt = totalDamageDealt;
        this.totalDamageDealtToChampions = totalDamageDealtToChampions;
        this.totalDamageShieldedOnTeammates = totalDamageShieldedOnTeammates;
        this.totalDamageTaken = totalDamageTaken;
        this.totalEnemyJungleMinionsKilled = totalEnemyJungleMinionsKilled;
        this.totalHeal = totalHeal;
        this.totalHealsOnTeammates = totalHealsOnTeammates;
        this.totalMinionsKilled = totalMinionsKilled;
        this.totalTimeCCDealt = totalTimeCCDealt;
        this.totalTimeSpentDead = totalTimeSpentDead;
        this.totalUnitsHealed = totalUnitsHealed;
        this.triplekills = triplekills;
        this.trueDamageDealt = trueDamageDealt;
        this.trueDamageDealtToChampions = trueDamageDealtToChampions;
        this.trueDamageTaken = trueDamageTaken;
        this.turretKills = turretKills;
        this.turretTakedowns = turretTakedowns;
        this.turretsLost = turretsLost;
        this.unrealKills = unrealKills;
        this.visionClearedPings = visionClearedPings;
        this.visionScore = visionScore;
        this.visionWardsBoughtInGame = visionWardsBoughtInGame;
        this.wardsPlaced = wardsPlaced;
        this.wardsKilled = wardsKilled;
        this.win = win;
        this.rank = rank;
        this.tier = tier;
        this.summoner1Name = summoner1Name;
        this.summoner2Name = summoner2Name;

        
export class Metadata {
    dataVersion: string;
    matchId: string;
    participants: string[];

    constructor(dataVersion: string, matchId: string, participants: string[]) {
        this.dataVersion = dataVersion;
        this.matchId = matchId;
        this.participants = participants;
    }
}

export class PerkSelection {
    perk: number;
    var1: number;
    var2: number;
    var3: number;

    constructor(perk: number, var1: number, var2: number, var3: number) {
        this.perk = perk;
        this.var1 = var1;
        this.var2 = var2;
        this.var3 = var3;
    }
}

export class PerkStyle {
    description: string;
    selections: PerkSelection[];
    style: number;

    constructor(description: string, selections: PerkSelection[], style: number) {
        this.description = description;
        this.selections = selections;
        this.style = style;
    }
}

export class Perks {
    statPerks: { defense: number; flex: number; offense: number };
    styles: PerkStyle[];

    constructor(statPerks: { defense: number; flex: number; offense: number }, styles: PerkStyle[]) {
        this.statPerks = statPerks;
        this.styles = styles;
    }
}

export class Participant {
    allInPings: number;
    assistMePings: number;
    assists: number;
    baitPings: number;
    baronKills: number;
    basicPings: number;
    bountyLevel: number;
    challanges: any;
    champExpirience: number;
    champLevel: number;
    championId: number;
    championName: string;
    championTransform: number;
    commandPings: number;
    consumablesPurchased: number;
    damageDealtToBuildings: number;
    damageDealtToObjectives: number;
    damageDealtToTurrets: number;
    damageSelfMitigated: number;
    dangerPings: number;
    deaths: number;
    detectorWardsPlaced: number;
    doubleKills: number;
    dragonKills: number;
    eligibleForProgression: boolean;
    enemyMissingPings: number;
    enemyVisionPings: number;
    firstBloodAssist: boolean;
    firstBloodKill: boolean;
    firstTowerAssist: boolean;
    firstTowerKill: boolean;
    gameEndedInEarlySurrender: boolean;
    gameEndedInSurrender: boolean;
    getBackPings: number;
    goldEarned: number;
    goldSpent: number;
    holdPings: number;
    individualPosition: string;
    inhibitorKills: number;
    inhibitorTakedowns: number;
    inhibitorLost: number;
    item0: string;
    item1: string;
    item2: string;
    item3: string;
    item4: string;
    item5: string;
    item6: string;
    itemsPurchased: number;
    killingSprees: number;
    kills: number;
    lane: string;
    largestCriticalStrike: number;
    largestKillingSpree: number;
    largestMultiKill: number;
    longestTimeSpentLiving: number;
    magicDamageDealt: number;
    magicDamageDealtToChampions: number;
    magicDamageTaken: number;
    missions: { [key: string]: number };
    needVisionPings: number;
    neutralMinionsKilled: number;
    nexusKills: number;
    nexusLost: number;
    nexusTakedowns: number;
    objectivesStolen: number;
    objectivesStolenAssists: number;
    onMyWayPings: number;
    participantId: number;
    pentakills: number;
    perks: Perks;
    physicalDamageDealt: number;
    physicalDamageDealtToChampions: number;
    physicalDamageTaken: number;
    placement: number;
    playerAugment1: number;
    playerAugment2: number;
    playerAugment3: number;
    playerAugment4: number;
    playerScore0: number;
    playerScore1: number;
    playerScore10: number;
    playerScore11: number;
    playerScore2: number;
    playerScore3: number;
    playerScore4: number;
    playerScore5: number;
    playerScore6: number;
    playerScore7: number;
    playerScore8: number;
    playerScore9: number;
    playerSubteamId: number;
    profileIcon: number;
    pushPings: number;
    puuid: string;
    quadraKills: number;
    riotIdGameName: string;
    riotIdTagLine: string | null;
    role: string;
    sightWardsBoughtInGame: number;
    spell1Casts: number;
    spell2Casts: number;
    spell3Casts: number;
    spell4Casts: number;
    subteamPlacement: number;
    summoner1Casts: number;
    summoner1Id: number;
    summoner2Casts: number;
    summoner2Id: number;
    summonerId: string;
    summonerLevel: number;
    summonerName: string;
    teamEarlySurrendered: boolean;
    teamId: string;
    teamPosition: string;
    timeCCingOthers: number;
    timePlayed: number;
    totalAllyJungleMinionsKilled: number;
    totalDamageDealt: number;
    totalDamageDealtToChampions: number;
    totalDamageShieldedOnTeammates: number;
    totalDamageTaken: number;
    totalEnemyJungleMinionsKilled: number;
    totalHeal: number;
    totalHealsOnTeammates: number;
    totalMinionsKilled: number;
    totalTimeCCDealt: number;
    totalTimeSpentDead: number;
    totalUnitsHealed: number;
    triplekills: number;
    trueDamageDealt: number;
    trueDamageDealtToChampions: number;
    trueDamageTaken: number;
    turretKills: number;
    turretTakedowns: number;
    turretsLost: number;
    unrealKills: number;
    visionClearedPings: number;
    visionScore: number;
    visionWardsBoughtInGame: number;
    wardsKilled: number;
    wardsPlaced: number;
    win: boolean;
    rank: string | null;
    tier: string | null;
    summoner1Name: string;
    summoner2Name: string;

    constructor(
        allInPings: number,
        assistMePings: number,
        assists: number,
        baitPings: number,
        baronKills: number,
        basicPings: number,
        bountyLevel: number,
        challanges: any,
        champExpirience: number,
        champLevel: number,
        championId: number,
        championName: string,
        championTransform: number,
        commandPings: number,
        consumablesPurchased: number,
        damageDealtToBuildings: number,
        damageDealtToObjectives: number,
        damageDealtToTurrets: number,
        damageSelfMitigated: number,
        dangerPings: number,
        deaths: number,
        detectorWardsPlaced: number,
        doubleKills: number,
        dragonKills: number,
        eligibleForProgression: boolean,
        enemyMissingPings: number,
        enemyVisionPings: number,
        firstBloodAssist: boolean,
        firstBloodKill: boolean,
        firstTowerAssist: boolean,
        firstTowerKill: boolean,
        gameEndedInEarlySurrender: boolean,
        gameEndedInSurrender: boolean,
        getBackPings: number,
        goldEarned: number,
        goldSpent: number,
        holdPings: number,
        individualPosition: string,
        inhibitorKills: number,
        inhibitorTakedowns: number,
        inhibitorLost: number,
        item0: string,
        item1: string,
        item2: string,
        item3: string,
        item4: string,
        item5: string,
        item6: string,
        itemsPurchased: number,
        killingSprees: number,
        kills: number,
        lane: string,
        largestCriticalStrike: number,
        largestKillingSpree: number,
        largestMultiKill: number,
        longestTimeSpentLiving: number,
        magicDamageDealt: number,
        magicDamageDealtToChampions: number,
        magicDamageTaken: number,
        missions: { [key: string]: number },
        needVisionPings: number,
        neutralMinionsKilled: number,
        nexusKills: number,
        nexusLost: number,
        nexusTakedowns: number,
        objectivesStolen: number,
        objectivesStolenAssists: number,
        onMyWayPings: number,
        participantId: number,
        pentakills: number,
        perks: Perks,
        physicalDamageDealt: number,
        physicalDamageDealtToChampions: number,
        physicalDamageTaken: number,
        placement: number,
        playerAugment1: number,
        playerAugment2: number,
        playerAugment3: number,
        playerAugment4: number,
        playerScore0: number,
        playerScore1: number,
        playerScore10: number,
        playerScore11: number,
        playerScore2: number,
        playerScore3: number,
        playerScore4: number,
        playerScore5: number,
        playerScore6: number,
        playerScore7: number,
        playerScore8: number,
        playerScore9: number,
        playerSubteamId: number,
        profileIcon: number,
        pushPings: number,
        puuid: string,
        quadraKills: number,
        riotIdGameName: string,
        riotIdTagLine: string | null,
        role: string,
        sightWardsBoughtInGame: number,
        spell1Casts: number,
        spell2Casts: number,
        spell3Casts: number,
        spell4Casts: number,
        subteamPlacement: number,
        summoner1Casts: number,
        summoner1Id: number,
        summoner2Casts: number,
        summoner2Id: number,
        summonerId: string,
        summonerLevel: number,
        summonerName: string,
        teamEarlySurrendered: boolean,
        teamId: string,
        teamPosition: string,
        timeCCingOthers: number,
        timePlayed: number,
        totalAllyJungleMinionsKilled: number,
        totalDamageDealt: number,
        totalDamageDealtToChampions: number,
        totalDamageShieldedOnTeammates: number,
        totalDamageTaken: number,
        totalEnemyJungleMinionsKilled: number,
        totalHeal: number,
        totalHealsOnTeammates: number,
        totalMinionsKilled: number,
        totalTimeCCDealt: number,
        totalTimeSpentDead: number,
        totalUnitsHealed: number,
        triplekills: number,
        trueDamageDealt: number,
        trueDamageDealtToChampions: number,
        trueDamageTaken: number,
        turretKills: number,
        turretTakedowns: number,
        turretsLost: number,
        unrealKills: number,
        visionClearedPings: number,
        visionScore: number,
        visionWardsBoughtInGame: number,
        wardsKilled: number,
        wardsPlaced: number,
        win: boolean,
        rank: string | null,
        tier: string | null,
        summoner1Name: string,
        summoner2Name: string
    ) {
        this.allInPings = allInPings;
        this.assistMePings = assistMePings;
        this.assists = assists;
        this.baitPings = baitPings;
        this.baronKills = baronKills;
        this.basicPings = basicPings;
        this.bountyLevel = bountyLevel;
        this.challanges = challanges;
        this.champExpirience = champExpirience;
        this.champLevel = champLevel;
        this.championId = championId;
        this.championName = championName;
        this.championTransform = championTransform;
        this.commandPings = commandPings;
        this.consumablesPurchased = consumablesPurchased;
        this.damageDealtToBuildings = damageDealtToBuildings;
        this.damageDealtToObjectives = damageDealtToObjectives;
        this.damageDealtToTurrets = damageDealtToTurrets;
        this.damageSelfMitigated = damageSelfMitigated;
        this.dangerPings = dangerPings;
        this.deaths = deaths;
        this.detectorWardsPlaced = detectorWardsPlaced;
        this.doubleKills = doubleKills;
        this.dragonKills = dragonKills;
        this.eligibleForProgression = eligibleForProgression;
        this.enemyMissingPings = enemyMissingPings;
        this.enemyVisionPings = enemyVisionPings;
        this.firstBloodAssist = firstBloodAssist;
        this.firstBloodKill = firstBloodKill;
        this.firstTowerAssist = firstTowerAssist;
        this.firstTowerKill = firstTowerKill;
        this.gameEndedInEarlySurrender = gameEndedInEarlySurrender;
        this.gameEndedInSurrender = gameEndedInSurrender;
        this.getBackPings = getBackPings;
        this.goldEarned = goldEarned;
        this.goldSpent = goldSpent;
        this.holdPings = holdPings;
        this.individualPosition = individualPosition;
        this.inhibitorKills = inhibitorKills;
        this.inhibitorTakedowns = inhibitorTakedowns;
        this.inhibitorLost = inhibitorLost;
        this.item0 = item0;
        this.item1 = item1;
        this.item2 = item2;
        this.item3 = item3;
        this.item4 = item4;
        this.item5 = item5;
        this.item6 = item6;
        this.itemsPurchased = itemsPurchased;
        this.killingSprees = killingSprees;
        this.kills = kills;
        this.lane = lane;
        this.largestCriticalStrike = largestCriticalStrike;
        this.largestKillingSpree = largestKillingSpree;
        this.largestMultiKill = largestMultiKill;
        this.longestTimeSpentLiving = longestTimeSpentLiving;
        this.magicDamageDealt = magicDamageDealt;
        this.magicDamageDealtToChampions = magicDamageDealtToChampions;
        this.magicDamageTaken = magicDamageTaken;
        this.missions = missions;
        this.needVisionPings = needVisionPings;
        this.neutralMinionsKilled = neutralMinionsKilled;
        this.nexusKills = nexusKills;
        this.nexusLost = nexusLost;
        this.nexusTakedowns = nexusTakedowns;
        this.objectivesStolen = objectivesStolen;
        this.objectivesStolenAssists = objectivesStolenAssists;
        this.onMyWayPings = onMyWayPings;
        this.participantId = participantId;
        this.pentakills = pentakills;
        this.perks = perks;
        this.physicalDamageDealt = physicalDamageDealt;
        this.physicalDamageDealtToChampions = physicalDamageDealtToChampions;
        this.physicalDamageTaken = physicalDamageTaken;
        this.placement = placement;
        this.playerAugment1 = playerAugment1;
        this.playerAugment2 = playerAugment2;
        this.playerAugment3 = playerAugment3;
        this.playerAugment4 = playerAugment4;
        this.playerScore0 = playerScore0;
        this.playerScore1 = playerScore1;
        this.playerScore10 = playerScore10;
        this.playerScore11 = playerScore11;
        this.playerScore2 = playerScore2;
        this.playerScore3 = playerScore3;
        this.playerScore4 = playerScore4;
        this.playerScore5 = playerScore5;
        this.playerScore6 = playerScore6;
        this.playerScore7 = playerScore7;
        this.playerScore8 = playerScore8;
        this.playerScore9 = playerScore9;
        this.playerSubteamId = playerSubteamId;
        this.profileIcon = profileIcon;
        this.pushPings = pushPings;
        this.puuid = puuid;
        this.quadraKills = quadraKills;
        this.riotIdGameName = riotIdGameName;
        this.riotIdTagLine = riotIdTagLine;
        this.role = role;
        this.sightWardsBoughtInGame = sightWardsBoughtInGame;
        this.spell1Casts = spell1Casts;
        this.spell2Casts = spell2Casts;
        this.spell3Casts = spell3Casts;
        this.spell4Casts = spell4Casts;
        this.subteamPlacement = subteamPlacement;
        this.summoner1Casts = summoner1Casts;
        this.summoner1Id = summoner1Id;
        this.summoner2Casts = summoner2Casts;
        this.summoner2Id = summoner2Id;
        this.summonerId = summonerId;
        this.summonerLevel = summonerLevel;
        this.summonerName = summonerName;
        this.teamEarlySurrendered = teamEarlySurrendered;
        this.teamId = teamId;
        this.teamPosition = teamPosition;
        this.timeCCingOthers = timeCCingOthers;
        this.timePlayed = timePlayed;
        this.totalAllyJungleMinionsKilled = totalAllyJungleMinionsKilled;
        this.totalDamageDealt = totalDamageDealt;
        this.totalDamageDealtToChampions = totalDamageDealtToChampions;
        this.totalDamageShieldedOnTeammates = totalDamageShieldedOnTeammates;
        this.totalDamageTaken = totalDamageTaken;
        this.totalEnemyJungleMinionsKilled = totalEnemyJungleMinionsKilled;
        this.totalHeal = totalHeal;
        this.totalHealsOnTeammates = totalHealsOnTeammates;
        this.totalMinionsKilled = totalMinionsKilled;
        this.totalTimeCCDealt = totalTimeCCDealt;
        this.totalTimeSpentDead = totalTimeSpentDead;
        this.totalUnitsHealed = totalUnitsHealed;
        this.triplekills = triplekills;
        this.trueDamageDealt = trueDamageDealt;
        this.trueDamageDealtToChampions = trueDamageDealtToChampions;
        this.trueDamageTaken = trueDamageTaken;
        this.turretKills = turretKills;
        this.turretTakedowns = turretTakedowns;
        this.turretsLost = turretsLost;
        this.unrealKills = unrealKills;
        this.visionClearedPings = visionClearedPings;
        this.visionScore = visionScore;
        this.visionWardsBoughtInGame = visionWardsBoughtInGame;
        this.wardsKilled = wardsKilled;
        this.wardsPlaced = wardsPlaced;
        this.win = win;
        this.rank = rank;
        this.tier = tier;
        this.summoner1Name = summoner1Name;
        this.summoner2Name = summoner2Name;
    }
}