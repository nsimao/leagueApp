(function() {
    //http://blog.ionic.io/navigating-the-changes/

    'use strict';

    angular.module('leaguesApp').controller('LeagueTableCtrl', ['$ionicPopup', '$scope', 'footballApi', LeagueTableCtrl]);

    function LeagueTableCtrl($ionicPopup, $scope, footballApi) {
        var vm = this;

        vm.leagueTable = [];

        vm.refreshData = function refreshData(forceRefresh) {
            vm.showTable = true;
            vm.leagueTable = [];
            footballApi.getLeagueTable(forceRefresh).then(
                function(data) {
                    vm.leagueTable = data;
                },

                function(data) {
                    vm.showTable = false;
                    showAlert();
                }
            ).finally(function() {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        function showAlert() {
            var alertPopup = $ionicPopup.alert({
                title: 'Ops...',
                template: 'Liga não possui classificação!'
            });

            alertPopup.then();
        };

        $scope.$on('$ionicView.beforeEnter', function() {
            vm.refreshData(false);
        });
    }
})();
