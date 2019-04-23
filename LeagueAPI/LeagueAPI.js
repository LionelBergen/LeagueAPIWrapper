require('./classes');
const https = require('https');

// Riot specifies this as a sample regexp to validate names
// any visible Unicode letter characters, digits (0-9), spaces, underscores, and periods.
const NAME_REGEXP = new RegExp('^[0-9\\p{L} _\\.]+$');

// Champion-Mastery V4
const GET_CHAMPION_MASTERY_URL = 'https://%region%.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/%name%?api_key=%apikey%';
const GET_CHAMPION_MASTERY_WITH_CHAMPION_URL = 'https://%region%.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/%name%/by-champion/%championid%?api_key=%apikey%';
const GET_CHAMPION_MASTER_TOTAL_URL = 'https://%region%.api.riotgames.com/lol/champion-mastery/v4/scores/by-summoner/%name%?api_key=%apikey%';

// CHAMPION-V3
const GET_CHAMPION_ROTATION_URL = 'https://%region%.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=%apikey%';

// LEAGUE-V4 (1/9)
const GET_QUEUES_WITH_RANKS_URL = 'https://%region%.api.riotgames.com/lol/league/v4/positional-rank-queues?api_key=%apikey%';

// LOL-STATUS-V3
const GET_STATUS_URL = 'https://%region%.api.riotgames.com/lol/status/v3/shard-data?api_key=%apikey%';

// MATCH-V4
const GET_MATCH_URL = 'https://%region%.api.riotgames.com/lol/match/v4/matches/%matchid%?api_key=%apikey%';
const GET_MATCHLIST_URL = 'https://%region%.api.riotgames.com/lol/match/v4/matchlists/by-account/%accountid%?api_key=%apikey%'
const GET_MATCH_TIMELINE_URL = 'https://%region%.api.riotgames.com/lol/match/v4/timelines/by-match/%matchid%?api_key=%apikey%';
const GET_MATCH_BY_TOURNAMENT_CODE_URL = 'https://%region%.api.riotgames.com/lol/match/v4/matches/by-tournament-code/%tournamentcode%/ids?api_key=%apikey%';
const GET_MATCH_BY_MATCH_ID_AND_TOURNAMNET_CODE_URL = 'https://%region%.api.riotgames.com/lol/match/v4/matches/%matchid%/by-tournament-code/%tournamentcode%?api_key=%apikey%';

// SPECTATOR-v4
const GET_ACTIVE_GAME_URL = 'https://%region%.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/%name%?api_key=%apikey%';
const GET_FEATURED_GAMES_URL = 'https://%region%.api.riotgames.com/lol/spectator/v4/featured-games?api_key=%apikey%';

// SUMMONOR-V4 (1/4, rest are get by accountId, puuid, summonerId)
const GET_SUMMONER_BY_NAME_URL = 'https://%region%.api.riotgames.com/lol/summoner/v4/summoners/by-name/%name%?api_key=%apikey%';

// THIRD_PARTY_CODE-V4
const GET_THIRD_PARTY_CODE_URL = 'https://%region%.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/%summonerid%?api_key=%apikey'

// TOURNAMENT-STUB-V4
// TOURNAMENT-V4

class LeagueAPI
{
	constructor(apiKey, region)
	{
		this.apiKey = apiKey;
		this.region = region;
	}
	
	changeRegion(region)
	{
		this.region = region;
	}
	
	getThirdPartyCode(accountObj, callback)
	{
		let summonerId = getSummonerIdFromParam(accountObj);
		
		makeAnHTTPSCall(getThirdPartyCode(summonerId, this.apiKey, this.region), callback);
	}
	
	getStatus(callback)
	{
		makeAnHTTPSCall(getURLStatus(this.apiKey, this.region), callback);
	}
	
	getFeaturedGames(callback)
	{
		makeAnHTTPSCall(getURLFeaturedGames(this.apiKey, this.region), callback);
	}
	
	getMatch(matchId, callback)
	{
		makeAnHTTPSCall(getMatchURL(matchId, this.apiKey, this.region), callback);
	}
	
	getMatchByTournament(matchId, tournamentCode, callback)
	{
		makeAnHTTPSCall(getURLMatchByTournamentCodeAndMatchId(tournamentCode, matchId, this.apiKey, this.region), callback);
	}
	
	getMatchIdsByTournament(tournamentCode, callback)
	{
		makeAnHTTPSCall(getURLMatchByTournamentCode(tournamentCode, this.apiKey, this.region), callback);
	}
	
	getPositionalRankQueues(callback)
	{
		makeAnHTTPSCall(getURLQueuesWithRanks(this.apiKey, this.region), callback);
	}

	getSummonerByName(summonerName, callback)
	{
		makeAnHTTPSCall(getURLSummonerByName(summonerName, this.apiKey, this.region), function(data) {
			callback(LeagueAccountInfo.from(data));
		});
	}
	
	getActiveGames(accountObj, callback)
	{
		let summonerId = getSummonerIdFromParam(accountObj);
		
		makeAnHTTPSCall(getURLActiveGames(summonerId, this.apiKey, this.region), callback);
	}
	
	getMatchList(accountObj, callback)
	{
		let accountId = getAccountIdFromParam(accountObj);
		
		makeAnHTTPSCall(getURLMatchList(accountId, this.apiKey, this.region), callback);
	}
	
	getMatchTimeline(matchId, callback)
	{
		makeAnHTTPSCall(getURLMatchTimeline(matchId, this.apiKey, this.region), callback);
	}
	
	getChampionMasteryTotal(accountObj, callback)
	{
		let summonerId = getSummonerIdFromParam(accountObj);
		
		makeAnHTTPSCall(getURLMasteryTotal(summonerId, this.apiKey, this.region), callback);
	}

	getChampionMastery(accountObj, callback)
	{
		let summonerId = getSummonerIdFromParam(accountObj);
		
		makeAnHTTPSCall(getURLChampionMastery(summonerId, this.apiKey, this.region), function(data) {
			let championMasterObjects = getArrayOfChampionObjectsFromJSONList(data);
			callback(championMasterObjects);
		});
	}
	
	getChampionMasteryByChampion(accountObj, championObj, callback)
	{
		let summonerId = getSummonerIdFromParam(accountObj);
		let championId = getChampionIdFromParam(championObj);
		
		makeAnHTTPSCall(getURLChampionMasteryByChampion(summonerId, championId, this.apiKey, this.region), function(data) {
			callback(ChampionMastery.from(data));
		});
	}
	
	getFreeChampionRotation(callback)
	{
		makeAnHTTPSCall(getURLChampRotation(this.apiKey, this.region), function(data) { 
			callback(ChampionRotation.from(data));
		});
	}
}

function getArrayOfChampionObjectsFromJSONList(data)
{
	let championMasterObjects = [];
	for (var i=0; i < data.length; i++)
	{
		championMasterObjects.push(ChampionMastery.from(data[i]));
	}
	
	return championMasterObjects;
}

function getChampionIdFromParam(param)
{
	championId = '';
	
	if (param instanceof String && isNumeric(param))
	{
		championId = param;
	}
	else if (param.value && isNumeric(param.value))
	{
		championId = param.value;
	}
	else
	{
		throw 'invalid argument, requires championId or Champion object';
	}
	
	return championId;
}

function getSummonerIdFromParam(param)
{
	summonerId = '';
	
	if (param instanceof LeagueAccountInfo)
	{
		summonerId = param.id;
	}
	else if (param instanceof String)
	{
		summonerId = param;
	}
	else
	{
		throw 'invalid argument, requires summonerId or LeagueAccountInfo object';
	}
	
	return summonerId;
}

function getAccountIdFromParam(param)
{
	accountId = '';
	
	if (param instanceof LeagueAccountInfo)
	{
		accountId = param.accountId;
	}
	else if (param instanceof String)
	{
		accountId = param;
	}
	else
	{
		throw 'invalid argument, requires accountId or LeagueAccountInfo object';
	}
	
	return accountId;
}

function getMatchURL(matchId, apiKey, region)
{
	return getURLWithRegionAndAPI(GET_MATCH_URL, apiKey, region).replace('%matchid%', matchId);
}

function getURLMatchList(summonerId, apiKey, region)
{
	return getURLWithRegionAndAPI(GET_MATCHLIST_URL, apiKey, region).replace('%accountid%', summonerId);
}

function getURLMatchTimeline(matchId, apiKey, region)
{
	return getURLWithRegionAndAPI(GET_MATCH_TIMELINE_URL, apiKey, region).replace('%matchid%', matchId);
}

function getURLMatchByTournamentcode(tournamentCode, apiKey, region)
{
	return getURLWithRegionAndAPI(GET_MATCH_BY_TOURNAMENT_CODE_URL, apiKey, region).replace('%tournamentcode%', tournamentCode);
}

function getURLMatchByTournamentCodeAndMatchId(tournamentCode, matchId, apiKey, region)
{
	return getURLWithRegionAndAPI(GET_MATCH_BY_MATCH_ID_AND_TOURNAMNET_CODE_URL, apiKey, region).replace('%tournamentcode%', tournamentCode).replace('%matchid', matchId);
}

function getURLMasteryTotal(summonerId, apiKey, region)
{
	return getURLWithRegionAndAPI(GET_CHAMPION_MASTER_TOTAL_URL, apiKey, region).replace('%name%', summonerId);
}

function getURLActiveGames(summonerId, apiKey, region)
{
	return getURLWithRegionAndAPI(GET_ACTIVE_GAME_URL, apiKey, region).replace('%name%', summonerId);
}

function getURLFeaturedGames(apiKey, region)
{
	return getURLWithRegionAndAPI(GET_FEATURED_GAMES_URL, apiKey, region);
}

function getURLStatus(apiKey, region)
{
	return getURLWithRegionAndAPI(GET_STATUS_URL, apiKey, region);
}

function getURLQueuesWithRanks(apiKey, region)
{
	return getURLWithRegionAndAPI(GET_QUEUES_WITH_RANKS_URL, apiKey, region);
}

function getURLChampionMastery(summonerName, apiKey, region)
{
	return getURLWithRegionAndAPI(GET_CHAMPION_MASTERY_URL, apiKey, region).replace('%name%', summonerName);
}

function getURLChampionMasteryByChampion(summonerName, championId, apiKey, region)
{
	return getURLWithRegionAndAPI(GET_CHAMPION_MASTERY_WITH_CHAMPION_URL, apiKey, region).replace('%name%', summonerName).replace('%championid%', championId);
}

function getURLSummonerByName(summonerName, apiKey, region)
{
	return getURLWithRegionAndAPI(GET_SUMMONER_BY_NAME_URL, apiKey, region).replace('%name%', summonerName);
}

function getURLChampRotation(apiKey, region)
{
	return getURLWithRegionAndAPI(GET_CHAMPION_ROTATION_URL, apiKey, region);
}

function getThirdPartyCode(summonerId, apiKey, region)
{
	return getURLWithRegionAndAPI(GET_THIRD_PARTY_CODE_URL, apiKey, region).replace('%summonerid%', summonerId);
}

// All endpoint URL's contain APIKey and Region
function getURLWithRegionAndAPI(url, apiKey, region)
{
	return url.replace('%apikey%', apiKey).replace('%region%', region);
}

function hasError(jsonData)
{
	return jsonData.status ? true : false;
}

function isNumeric(n) 
{
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function makeAnHTTPSCall(URL, callback)
{
	https.get(URL, (resp) => {
	  let data = '';

	  // A chunk of data has been recieved.
	  resp.on('data', (chunk) => {
		data += chunk;
	  });

	  // The whole response has been received.
	  resp.on('end', () => {
		  	let parsedData = JSON.parse(data);

			if (hasError(parsedData))
			{
				// TODO: Maybe only print hint if status code is 403.
				console.log('failed, hint: ensure API key is still active. Error response from API: ');
				console.log(parsedData);
			}
			else
			{
				callback(parsedData);
			}
	  });

	// TODO: Errors are important, save to a database or Log file
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
}

module.exports = LeagueAPI;