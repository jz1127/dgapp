var app = angular.module('dgApp');

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
    var helloState = {
      name: 'hello',
      url: '/hello',
      template: '<h3>hello world!</h3>',
    }
  
    var aboutState = {
      name: 'about',
      url: '/about',
      templateUrl: '/partials/hello.html',
      controller: 'dashCtrl'
    }

    var dashboardState = {
        name: 'dashboard',
        url: '/dashboard',
        templateUrl: '/partials/dashboard.html',
        controller: 'dashCtrl'
      }

      var viewagentsState = {
        name: 'dashboard.viewagents',
        url: '/viewagents',
        templateUrl: '/partials/viewagents.html',
        controller: 'dashCtrl'
      }

      var addagentState = {
        name: 'addagent',
        url: '/addagent',
        templateUrl: '/partials/addagent.html',
        controller: 'dashCtrl'
      }
      
      var editagentState = {
        name: 'dashboard.editagent',
        url: '/editagent/:id',
        // parent: 'dashboard',
        templateUrl: '/partials/editagent.html',
        controller: 'editAgentDetailsController'
      }

     var editstatsState = {
        name: 'dashboard.editstats',
        url: '/editstats/:id',
        // parent: 'dashboard',
        templateUrl: '/partials/stats.html',
        controller: 'editAgentDetailsController'
      }

      var editpsychState = {
        name: 'dashboard.editpsych',
        url: '/editpsych/:id',
        // parent: 'dashboard',
        templateUrl: '/partials/editpsych.html',
        controller: 'editAgentDetailsController'
      }

      var editskillsState = {
        name: 'dashboard.editskills',
        url: '/editskills/:id',
        // parent: 'dashboard',
        templateUrl: '/partials/editskills.html',
        controller: 'editAgentDetailsController'
      }
      
      var editimageState = {
        name: 'dashboard.editimage',
        url: '/editimage/:id',
        // parent: 'dashboard',
        templateUrl: '/partials/editimage.html',
        controller: 'editAgentDetailsController'
      }

      var editinjuriesState = {
        name: 'dashboard.editinjuries',
        url: '/editinjuries/:id',
        // parent: 'dashboard',
        templateUrl: '/partials/editinjuries.html',
        controller: 'editAgentDetailsController'
      }

      var editarmorState = {
        name: 'dashboard.editarmor',
        url: '/editarmor/:id',
        // parent: 'dashboard',
        templateUrl: '/partials/editarmor.html',
        controller: 'editAgentDetailsController'
      }


    var adminState = {
        name: 'admin',
        url: '/admin',
        templateUrl: '/partials/admin.html',
        controller: 'dashCtrl'
      }

      var addweaponsState = {
        name: 'weapons',
        url: '/addweapons',
        templateUrl: '/partials/addweapons.html',
        controller: 'weapons'
      }      
  
    $stateProvider.state(helloState);
    $stateProvider.state(aboutState);
    $stateProvider.state(dashboardState);
    $stateProvider.state(addagentState);
    $stateProvider.state(editagentState);
    $stateProvider.state(editstatsState);
    $stateProvider.state(editpsychState);
    $stateProvider.state(editskillsState);
    $stateProvider.state(editimageState);
    $stateProvider.state(viewagentsState);
    $stateProvider.state(addweaponsState);
    $stateProvider.state(editinjuriesState);
    $stateProvider.state(editarmorState);
    $stateProvider.state(adminState);


    // the known route, with missing '/' - let's create alias
    $urlRouterProvider.when('', '/dasboard/viewagents');

    // the unknown
    $urlRouterProvider.otherwise('/dashboard/viewagents');

}]);