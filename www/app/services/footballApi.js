(function() {

    'use strict';

    angular.module('leaguesApp').factory('footballApi', ['$http', '$q', '$ionicLoading', 'configFootballApi', 'CacheFactory', footballApi]);

    function footballApi($http, $q, $ionicLoading, configFootballApi, CacheFactory) {
        CacheFactory("leaguesCache", { storageMode: "localStorage", maxAge: 3600000, deleteOnExpire: "aggressive" });
        CacheFactory("leagueTeamsCache", { storageMode: "localStorage", maxAge: 3600000, deleteOnExpire: "aggressive" });
        CacheFactory("leagueTableCache", { storageMode: "localStorage", maxAge: 720000, deleteOnExpire: "aggressive" });
        CacheFactory("staticCache", { storageMode: "localStorage" });

        self.leaguesCache = CacheFactory.get("leaguesCache");
        self.leaguesCache.setOptions({
            onExpire: function(key, value) {
                getAllLeagues()
                    .then(function() {
                        console.log("Leagues was automatically refreshed.", new Date());
                    }, function() {
                        console.log("Error getting data from http. Expired item back in the cache.", new Date());
                        self.leaguesCache.put(key, value);
                    });
            }
        });
        self.leagueTeamsCache = CacheFactory.get("leagueTeamsCache");
        self.leagueTableCache = CacheFactory.get("leagueTableCache");
        self.staticCache = CacheFactory.get("staticCache");

        function showLoading() {
            $ionicLoading.show({
                template: '<ion-spinner icon="spiral"></ion-spinner>'
            });
        };

        function hideLoading() {
            $ionicLoading.hide();
        };

        function getActiveLeague() {
            return self.staticCache.get('leagueId');
        }

        function setActiveLeague(leagueId) {
            self.staticCache.put('leagueId', leagueId);

            getLeagueTeams();
        }

        function getCurrentMatchday() {
            return self.staticCache.get('currentMatchday');
        }

        function setCurrentMatchday(currentMatchday) {
            self.staticCache.put('currentMatchday', currentMatchday);
        }

        function getNumberOfMatchdays() {
            return self.staticCache.get('numberOfMatchdays');
        }

        function setNumberOfMatchdays(numberOfMatchdays) {
            self.staticCache.put('numberOfMatchdays', numberOfMatchdays);
        }

        function makeApiCall(urlApi, distract, cacheRepository, cacheKey, forceRefresh) {
            if (typeof forceRefresh === "undefined") {
                forceRefresh = false;
            }

            if (distract)
                showLoading();

            var deferred = $q.defer();

            var dataFromCache = null;

            if ((!forceRefresh) && (cacheRepository) && (cacheKey))
                dataFromCache = cacheRepository.get(cacheKey);

            if (dataFromCache) {
                hideLoading();
                deferred.resolve(dataFromCache);
            } else {
                $http({
                    headers: { 'X-Auth-Token': configFootballApi.apiToken },
                    url: urlApi,
                    dataType: 'json',
                    type: 'GET',
                }).then(function successCallback(response) {
                    hideLoading();
                    if ((cacheRepository) && (cacheKey))
                        cacheRepository.put(cacheKey, response);
                    deferred.resolve(response);
                }, function errorCallback(response) {
                    hideLoading();
                    deferred.reject();
                });
            }
            return deferred.promise;
        }

        function getAllLeagues(forceRefresh) {
            return makeApiCall(configFootballApi.allLeaguesURL, true, self.leaguesCache, 'leaguesCache', forceRefresh);
        }

        function getLeagueData() {
            var baseLeagueURL = configFootballApi.baseLeagueURL;
            baseLeagueURL = baseLeagueURL.replace(configFootballApi.idLeague, getActiveLeague());

            return makeApiCall(baseLeagueURL);
        }

        function getLeagueTable(forceRefresh) {
            var leagueTableURL = configFootballApi.leagueTableURL;
            leagueTableURL = leagueTableURL.replace(configFootballApi.idLeague, getActiveLeague());

            return makeApiCall(leagueTableURL, true, self.leagueTableCache, getActiveLeague(), forceRefresh);
        }

        function getLeagueTeams(forceRefresh) {
            var leagueTeamsURL = configFootballApi.leagueTeamsURL;
            leagueTeamsURL = leagueTeamsURL.replace(configFootballApi.idLeague, getActiveLeague());
            return makeApiCall(leagueTeamsURL, false, self.leagueTeamsCache, getActiveLeague(), forceRefresh);
        }

        function getTeam(teamId) {
            var deferred = $q.defer();
            getLeagueTeams().then(
                function(response) {
                    var result = null;
                    for (var i = 0; i < response.data.teams.length; i++) {
                        var item = response.data.teams[i];
                        var regex = /.*?(\d+)$/;
                        var res = regex.exec(item._links.self.href);
                        var teamExtractedId = res[1];
                        if (teamId == teamExtractedId) {
                            result = item;
                            break;
                        }
                    };
                    deferred.resolve(result);
                },
                function(response) {
                    deferred.reject();
                });
            return deferred.promise;
        }

        function getTeamPlayers(teamId) {
            var teamPlayersUrl = configFootballApi.teamPlayersUrl;
            teamPlayersUrl = teamPlayersUrl.replace(configFootballApi.idTeam, teamId);
            return makeApiCall(teamPlayersUrl);
        }

        function getLeagueMatchDay() {
            var fixturesURL = configFootballApi.fixturesURL;
            fixturesURL = fixturesURL.replace(configFootballApi.idLeague, getActiveLeague());
            fixturesURL = fixturesURL.replace(configFootballApi.idMatchday, getCurrentMatchday());
            return makeApiCall(fixturesURL);
        }

        return {
            getAllLeagues: getAllLeagues,
            getActiveLeague: getActiveLeague,
            setActiveLeague: setActiveLeague,
            getCurrentMatchday: getCurrentMatchday,
            setCurrentMatchday: setCurrentMatchday,
            getNumberOfMatchdays: getNumberOfMatchdays,
            setNumberOfMatchdays: setNumberOfMatchdays,
            getLeagueData: getLeagueData,
            getLeagueTable: getLeagueTable,
            getLeagueTeams: getLeagueTeams,
            getTeam: getTeam,
            getTeamPlayers: getTeamPlayers,
            getLeagueMatchDay: getLeagueMatchDay
        };
    };
})();
