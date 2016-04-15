angular.module("leaguesApp").value("configFootballApi", {
    allLeaguesURL: "http://api.football-data.org/v1/soccerseasons",
    baseLeagueURL: "http://api.football-data.org/v1/soccerseasons/idLeague",
    leagueTableURL : "http://api.football-data.org/v1/soccerseasons/idLeague/leagueTable",
    leagueTeamsURL : "http://api.football-data.org/v1/soccerseasons/idLeague/teams",
    teamURL:"http://api.football-data.org/v1/teams/idTeam",
    teamPlayersUrl:"http://api.football-data.org/v1/teams/idTeam/players",
    fixturesURL : "http://api.football-data.org/v1/soccerseasons/idLeague/fixtures?matchday=idMatchday",
    idLeague : 'idLeague',
    idTeam : 'idTeam',
    idMatchday : 'idMatchday',
    apiToken: 'YOUR KEY HERE'
});
