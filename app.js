const APIKeys = require('./apiKeys.js');
let LeagueAPI = require('./LeagueAPI/LeagueAPI.js');
LeagueAPI = new LeagueAPI(APIKeys.LeagueApiKey);

LeagueAPI.getFreeChampionRotation(console.log);

/*LeagueAPI.getSummonerByName('LeagueOfSausage', function(e) {
	LeagueAPI.getChampionMastery(e, function(d) { console.log(d); })
});*/
