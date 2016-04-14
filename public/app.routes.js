angular.module('app.routes', ['ngRoute'])

  .config(appRoutes);

  appRoutes.$inject = ['$routeProvider'];

  function appRoutes($routeProvider){

    $routeProvider

    .when('/', {
      templateUrl: 'templates/_home.html'
      ,controller: 'dashboardCtrl'
      ,controllerAs: 'dash'
    })

    .when('/new/password/:user_id', {
      templateUrl: 'templates/_newpassword.html'
      ,controller: 'passwordCtrl'
      ,controllerAs: 'password'
    })

    .otherwise('/');
  }
