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
        controller: 'editAgentController'
      }

     var editstatsState = {
        name: 'dashboard.editstats',
        url: '/editstats/:id',
        // parent: 'dashboard',
        templateUrl: '/partials/stats.html',
        controller: 'editAgentController'
      }

      var editpsychState = {
        name: 'dashboard.editpsych',
        url: '/editpsych/:id',
        // parent: 'dashboard',
        templateUrl: '/partials/editpsych.html',
        controller: 'editAgentController'
      }

      var editskillsState = {
        name: 'dashboard.editskills',
        url: '/editskills/:id',
        // parent: 'dashboard',
        templateUrl: '/partials/editskills.html',
        controller: 'editAgentController'
      }
      
      var editimageState = {
        name: 'dashboard.editimage',
        url: '/editimage/:id',
        // parent: 'dashboard',
        templateUrl: '/partials/editimage.html',
        controller: 'editAgentController'
      }

      var editinjuriesState = {
        name: 'dashboard.editinjuries',
        url: '/editinjuries/:id',
        // parent: 'dashboard',
        templateUrl: '/partials/editinjuries.html',
        controller: 'editAgentController'
      }

      var editarmorState = {
        name: 'dashboard.editarmor',
        url: '/editarmor/:id',
        // parent: 'dashboard',
        templateUrl: '/partials/editarmor.html',
        controller: 'editAgentController'
      }

      var editagentwepState = {
        name: 'dashboard.editagentwep',
        url: '/editagentwep/:id/:mode',
        // parent: 'dashboard',
        templateUrl: '/partials/editagentwep.html',
        controller: 'editAgentController',
        controllerAs: 'vm'
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
    $stateProvider.state(editagentwepState);
    $stateProvider.state(adminState);


    // the known route, with missing '/' - let's create alias
    $urlRouterProvider.when('', '/dasboard/viewagents');

    // the unknown
    $urlRouterProvider.otherwise('/dashboard/viewagents');

}]);

app.factory('refreshService', ['characterService', function(characterService) {   
        var setImage = function(pic) {
            console.log("The pic is: " +pic);
                if (typeof pic !== "undefined") {
                return image = pic;
            }
            return image = "Front_Seal.png";
        };

        var setTronText = function (text) {
            console.log("The Tron is: " +text);
            if (typeof text !== "undefined") {
                return text;
            }
            return "Delta Green Agent";
        }

        return {
            setImage: setImage,
            setTronText: setTronText
        }
}]);  


app.controller('navigationCtrl', function($scope, $stateParams, $state){
    
});


app.directive('editSimpleNavbar', function () {
    return {
        restrict: 'E',
        templateUrl: '/partials/editnavigation.html'
    };
});

app.controller('dashCtrl', function($scope, $http, $stateParams, characterService, refreshService) {
    var vm = this;
    var callRefresh = function () {

        // characterService.getCharacters().then(function(char) {
        //     console.log("One DEBUG: "  + char);
        //     $scope.characters = char;
        // })

        characterService.getCharacters().then(char => $scope.characters = char);
        $scope.$parent.tronname = refreshService.setTronText();
        $scope.$parent.image = refreshService.setImage();
        console.log("her e " +refreshService.setImage());


        for (var key in $scope.newChar ) {
            $scope.newChar[key] = null;
        }
    };

    callRefresh();

    $scope.addCharacter = function() {
        console.log("New Char is this: " + JSON.stringify($scope.newChar));
        if (typeof $scope.newChar !== "undefined" && typeof null !== $scope.newChar) {
            $serData = JSON.stringify($scope.newChar);
            $http({
                    method: 'POST',
                    url: '/characters',
                    data: $serData
                }).then(function(response){
                // console.log("This is response: " + JSON.stringify(response.data));
                alert("agent added");
                refresh();
            },function(response){
                console.log('no response given');
                alert("There was a problem");
            });
        }
        else {
            // alert("You must fill in at least one stat.");
        }
    }
    
    $scope.removeChar = function(id) {
        console.log("Char id this: " + id);
       $http.delete('/characters/' + id).then(function(response){
               console.log("This is response: " + JSON.stringify(response));
               refresh();
           },function(response){
               console.log('no response given');
           });
    }

    // Load card picked by user into edit state
    $scope.editAgent = function(id) {
        console.log(id);
        $http.get('/editagent/id/' + id).then(function(response){
            console.log("This is response: " + JSON.stringify(response));
            refresh();
        },function(response){
            console.log('no response given');
        });
    } 

    //actuallupdate the agent

    $scope.testSkill = function() {
        alert(setSkillValue($scope.skill));
    }

    getSkillValue = function(key) {
        return $scope.key;
    }

    setSkillValue = function($val) {
        return $val * 5;
    }

});
