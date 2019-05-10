# LeagueAPIWrapper (Node.JS)
Wrapper for all API methods

![https://www.npmjs.com/package/leagueapiwrapper](https://nodei.co/npm/leagueapiwrapper.png)

Usage:
```
let LeagueAPI = require('./LeagueAPI/LeagueAPI.js');
LeagueAPI = new LeagueAPI(LeagueApiKey, Region.NA);

LeagueAPI.getSummonerByName('LeagueOfSausage').then(function(data) {
	summonerObject = data;
	return LeagueAPI.getActiveGames(data);
})
.then(console.log)
.catch(console.log);

```

*App.js is used for my own testing. Will be changed to an example usage file in the future.*

*Still underconstruction goal is to have all API calls included. 
Master branch should always be in a working state.*

*Feel free to make suggestions on features/etc.*
