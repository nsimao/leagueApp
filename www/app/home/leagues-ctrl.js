(function() {
    'use strict';

    angular.module('leaguesApp').controller('LeaguesCtrl', ['$state', '$scope', 'footballApi', LeaguesCtrl]);

    function LeaguesCtrl($state, $scope, footballApi) {
        var vm = this;

        vm.leagues = [];

        vm.refreshData = function(forceRefresh) {
            footballApi.getAllLeagues(forceRefresh).then(function(response) {
                vm.leagues = response.data;
            }).finally(function() {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        vm.showLeagueTable = function(leagueId, currentMatchday, numberOfMatchdays) {
            footballApi.setActiveLeague(leagueId);
            footballApi.setCurrentMatchday(currentMatchday);
            footballApi.setNumberOfMatchdays(numberOfMatchdays);
            $state.go("app.leagueTable");
        }

        vm.refreshData(false);
    }

})();
