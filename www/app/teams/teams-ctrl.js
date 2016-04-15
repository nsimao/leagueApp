(function() {
    'use strict';

    angular.module('leaguesApp').controller('TeamsCtrl', ['$scope', 'footballApi', TeamsCtrl]);

    function TeamsCtrl($scope, footballApi) {
        var vm = this;

        vm.teams = [];

        vm.refreshData = function refreshData(forceRefresh) {
            footballApi.getLeagueTeams(forceRefresh).then(function(response) {
                vm.teams = response.data.teams;
            }).finally(function() {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        vm.extractTeamId = function(item) {
            var regex = /.*?(\d+)$/; // the ? makes the first part non-greedy
            var res = regex.exec(item._links.self.href);
            var teamId = res[1];

            return teamId;
        };

        $scope.$on('$ionicView.beforeEnter', function() {
            vm.refreshData(false);
        });
    }
})();
