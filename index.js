const fs = require('fs');

// you can modify the json name here
const rawdata = fs.readFileSync('matches.json');
const matches = JSON.parse(rawdata);
//store the player's win, lose and total matches
const playerMap = {};
//store the player's probability for winning a match
const probabilityResult = {};
//store the player's win lose and total matches for winning a match against others
const playerProbabilityAgainstToOthers = {};

/**********************************This is the main challenge **********************************/
const calcPlayerWinAndLose = (teamIndex, winIndex, team) => {
  team.forEach((player) => {
    if (playerMap[player]) {
      if (winIndex === teamIndex) {
        playerMap[player].win += 1;
      } else {
        playerMap[player].lose = playerMap[player].lose + 1;
      }
      playerMap[player].totalMatches += 1;
    } else {
      playerMap[player] = { win: 0, lose: 0, totalMatches: 0 };
      probabilityResult[player] = null;
      if (winIndex === teamIndex) {
        playerMap[player].win = 1;
      } else {
        playerMap[player].lose = 1;
      }
      playerMap[player].totalMatches = 1;
    }
  });
};

matches.forEach(([team1, team2, winIndex]) => {
  calcPlayerWinAndLose(0, winIndex, team1);
  calcPlayerWinAndLose(1, winIndex, team2);
});

//generte the play's probability for winning a match
for (const player in playerMap) {
  const { win, totalMatches } = playerMap[player];
  probabilityResult[player] = Number((win / totalMatches).toFixed(2));
}

/**********************************This is the second challenge **********************************/
const calcPlayerProbabilityAgainstToOthers = (team1, team2, winIndex) => {
  team1.forEach((player) => {
    team2.forEach((enemy) => {
      if (!playerProbabilityAgainstToOthers[player]) {
        playerProbabilityAgainstToOthers[player] = {};
      }

      if (!playerProbabilityAgainstToOthers[player][enemy]) {
        playerProbabilityAgainstToOthers[player][enemy] = {
          win: 0,
          lose: 0,
          totalMatches: 0,
        };
      }

      if (winIndex === 0) {
        playerProbabilityAgainstToOthers[player][enemy].win += 1;
        playerProbabilityAgainstToOthers[player][enemy].totalMatches += 1;
      } else {
        playerProbabilityAgainstToOthers[player][enemy].lose += 1;
        playerProbabilityAgainstToOthers[player][enemy].totalMatches += 1;
      }
    });
  });
};

matches.forEach(([team1, team2, winIndex]) => {
  calcPlayerProbabilityAgainstToOthers(team1, team2, winIndex);
  calcPlayerProbabilityAgainstToOthers(team2, team1, winIndex ? 0 : 1);
});

//generate player's win lose and total matches for winning a match against others
//champion should be a valid champion name and enemyTeam should be an array wich contains the enemy's name
const calcSecondChallengeResult = (champion, enemyTeam) => {
  const ret = {
    [champion]: {},
  };
  enemyTeam.forEach((enemy) => {
    const win = playerProbabilityAgainstToOthers[champion][enemy].win;
    const totalMatches =
      playerProbabilityAgainstToOthers[champion][enemy].totalMatches;
    ret[champion][enemy] = Number((win / totalMatches).toFixed(2));
  });
  return ret;
};

/*
This is an example to call the methods to get the Gangplank's win probability against a team
calcSecondChallengeResult('Gangplank', [
  'Taric',
  'Fiddlesticks',
  'Rakan',
  'Warwick',
  'Sett',
]);
*/

//output all the map file for main challenge
fs.writeFile(
  'probabilityResult.json',
  JSON.stringify(probabilityResult, null, '\t'),
  function (err) {
    if (err) {
      res.status(500).send('Server is error...');
    }
  }
);

/*
This is an optional output
fs.writeFile(
  'matchesData.json',
  JSON.stringify(playerMap, null, '\t'),
  function (err) {
    if (err) {
      res.status(500).send('Server is error...');
    }
  }
);
*/

//output for secondary challenge
fs.writeFile(
  'playerProbabilityAgainstToOthers.json',
  JSON.stringify(playerProbabilityAgainstToOthers, null, '\t'),
  function (err) {
    if (err) {
      res.status(500).send('Server is error...');
    }
  }
);
