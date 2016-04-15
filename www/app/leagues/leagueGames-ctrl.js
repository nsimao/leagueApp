(function() {
    'use strict';

    angular.module('leaguesApp').controller('LeagueGamesCtrl', ['$scope', 'footballApi', LeagueGamesCtrl]);

    function LeagueGamesCtrl($scope, footballApi) {
        var vm = this;

        vm.games = [];

        vm.getPrevious = function getPrevious() {
            var currentMatchday = Number(footballApi.getCurrentMatchday());

            if (currentMatchday > 1) {
                currentMatchday = currentMatchday - 1;
                footballApi.setCurrentMatchday(currentMatchday);
                refreshData();
            }
        }

        vm.getNext = function getNext() {
            var currentMatchday = Number(footballApi.getCurrentMatchday());
            var numberOfMatchdays = Number(footballApi.getNumberOfMatchdays());

            if (numberOfMatchdays > currentMatchday) {
                currentMatchday = currentMatchday + 1;
                footballApi.setCurrentMatchday(currentMatchday);
                refreshData();
            }
        }

        function setCodeTeam(code) {
            return code.substring(0, 3).toUpperCase();
        }

        function getTeamDetails(item) {
            var regex = /.*?(\d+)$/; // the ? makes the first part non-greedy

            var res = regex.exec(item._links.homeTeam.href);
            var teamHomeId = res[1];

            var res = regex.exec(item._links.awayTeam.href);
            var teamAwayId = res[1];

            footballApi.getTeam(teamHomeId).then(function(teamHome) {
                if (teamHome.code)
                    item.TeamHomeCode = teamHome.code;
                else
                    item.TeamHomeCode = teamHome.shortName;

                item.TeamHomeCode = setCodeTeam(item.TeamHomeCode);
                item.TeamHomeShortName = teamHome.shortName;
                item.TeamHomeCrestUrl = teamHome.crestUrl;
            });

            footballApi.getTeam(teamAwayId).then(function(teamAway) {
                if (teamAway.code)
                    item.TeamAwayCode = teamAway.code;
                else
                    item.TeamAwayCode = teamAway.shortName;

                item.TeamAwayCode = setCodeTeam(item.TeamAwayCode);
                item.TeamAwayShortName = teamAway.shortName;
                item.TeamAwayCrestUrl = teamAway.crestUrl;
            });
        }

        function refreshData() {
            vm.currentMatchday = Number(footballApi.getCurrentMatchday());
            vm.games = [];
            footballApi.getLeagueMatchDay().then(function(response) {
                vm.games = response.data.fixtures;

                for (var i = 0; i < vm.games.length; i++) {
                    getTeamDetails(vm.games[i]);
                }
            });
        }

        $scope.$on('$ionicView.beforeEnter', function() {
            refreshData();
        });
    }
})();
