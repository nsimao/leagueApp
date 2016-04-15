(function() {
    'use strict'

    angular.module('leaguesApp').controller('TeamDetailCtrl', ['$scope', '$stateParams', 'footballApi', TeamDetailCtrl]);

    function TeamDetailCtrl($scope, $stateParams, footballApi) {
        var vm = this;

        vm.teamId = Number($stateParams.id);

        function refreshData() {
            vm.name = '';
            vm.code = '';
            vm.shortName = '';
            vm.squadMarketValue = '';
            vm.crestUrl = '';
            vm.players = [];

            footballApi.getTeam(vm.teamId).then(function(team) {
                vm.name = team.name;
                vm.code = team.code;
                vm.shortName = team.shortName;
                vm.squadMarketValue = team.squadMarketValue;
                vm.crestUrl = team.crestUrl;
            });

            footballApi.getTeamPlayers(vm.teamId).then(function(response) {
                vm.players = response.data.players;
            });
        }

        $scope.$on('$ionicView.beforeEnter', function() {
            refreshData();
        });
    };
})();
