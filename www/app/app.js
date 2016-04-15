angular.module('leaguesApp', ['ionic', 'angular-cache'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            //cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('home', {
        abstract: true,
        url: '/home',
        templateUrl: 'app/home/home.html'
    })

    .state('home.leagues', {
        url: '/leagues',
        views: {
            'tab-leagues': {
                templateUrl: 'app/home/leagues.html'
            }
        }
    })

    .state('home.about', {
        url: '/about',
        views: {
            'tab-about': {
                templateUrl: 'app/about/about.html'
            }
        }
    })

    .state('app', {
        abstract: true,
        url: '/app',
        templateUrl: 'app/layout/menu-layout.html'
    })

    .state('app.leagueTable', {
        url: '/leagueTable',
        views: {
            'mainContent': {
                templateUrl: 'app/leagues/league-table.html'
            }
        }
    })

    .state('app.games', {
        url: '/games',
        views: {
            'mainContent': {
                templateUrl: 'app/leagues/league-games.html'
            }
        }
    })

    .state('app.teams', {
        url: '/teams',
        views: {
            'mainContent': {
                templateUrl: 'app/teams/teams.html'
            }
        }
    })

    .state('app.team-detail', {
        url: '/teams/:id',
        views: {
            'mainContent': {
                templateUrl: 'app/teams/team-detail.html'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home/leagues');
});
