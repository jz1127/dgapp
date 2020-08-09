var app = angular.module('dgApp');

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
    var helloState = {
      name: 'hello',
      url: '/hello',
      template: '<h3>hello world!</h3>'
    }
  
    var aboutState = {
      name: 'about',
      url: '/about',
      templateUrl: '/partials/hello.html',
      controller: 'homeCtrl'
    }

    var dashboardState = {
        name: 'dashboard',
        url: '/dashboard',
        templateUrl: '/partials/dashboard.html',
        controller: 'homeCtrl'
      }

      var viewagentsState = {
        name: 'dashboard.viewagents',
        url: '/viewagents',
        templateUrl: '/partials/viewagents.html',
        controller: 'homeCtrl'
      }

      var addagentState = {
        name: 'addagent',
        url: '/addagent',
        templateUrl: '/partials/addagent.html',
        controller: 'homeCtrl'
      }
      
      var editagentState = {
        name: 'dashboard.editagent',
        url: '/editagent/:id',
        // parent: 'dashboard',
        templateUrl: '/partials/editagent.html',
        controller: 'agentDetailsController'
      }

    var adminState = {
        name: 'admin',
        url: '/admin',
        templateUrl: '/partials/admin.html',
        controller: 'homeCtrl'
      }
  
    $stateProvider.state(helloState);
    $stateProvider.state(aboutState);
    $stateProvider.state(dashboardState);
    $stateProvider.state(addagentState);
    $stateProvider.state(editagentState);
    $stateProvider.state(viewagentsState);
    $stateProvider.state(adminState);


    // the known route, with missing '/' - let's create alias
$urlRouterProvider.when('', '/dasboard/viewagents');

// the unknown
$urlRouterProvider.otherwise('/dashboard');

  }]);

app.controller('agentDetailsController', function($scope, $http, $stateParams, characterService) {
    var vm = this;
    console.log("Like  " + $stateParams.id);
    $http({
        url: "/agent/" + $stateParams.id,
        method: "GET",
        params: { id: $stateParams.id }
    }).then(function (response) {
        console.log(response);
        $scope.agent = response.data;
        console.log("hello " + $scope.$parent.changeBanner);
        $scope.$parent.changeBanner($scope.agent.image);
        $scope.$parent.changeTronName($scope.agent.name);
        // $scope.$parent.$parent.image = $scope.agent.image;
    });
});
app.controller('homeCtrl', function($scope, $http, $stateParams, characterService) {
    var vm = this;

    $scope.changeBanner = function(pic) {
        console.log("MyPic " + pic);
        if (typeof pic !== "undefined") {
            return $scope.$parent.image = pic;
        }
        return $scope.$parent.image = "Front_Seal.png";
    }

    $scope.changeTronName = function(name) {
        if (typeof name !== "undefined") {
            return $scope.$parent.tronname = name;
        }
        return $scope.$parent.tronname = "Delta Green Agent";
    }

    var refresh = function () {

        characterService.getCharacters().then(function(char) {
            console.log("One DEBUG: "  + char);
            $scope.characters = char;
            // $scope.agents = char.filter(function(data){
            //     if (data.name == "George Williamson") {
            //         return true;
            //     }
            // });
            
        })

        // characterService.getCharacters().then(char => $scope.characters = char);
        // $scope.agent = $scope.characters;
        
        $scope.changeBanner("bannerTest2.png");
        $scope.changeTronName();


        for (var key in $scope.newChar ) {
            $scope.newChar[key] = null;
        }
    };

    refresh();

    $scope.changeVal = function(row) {
        // console.log(row);

        $scope.characters.find((o, i) => {
            if (o.name === row.name) {
                $scope.characters[i] = { name: o.name, occupation: o.occupation, hp: row.hp, str: row.str, dex: row.dex, con: row.con };
                return true;    
            }
        });
    }
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

    $scope.editAgent = function(id) {
        console.log(id);
        $http.get('/editagent/id/' + id).then(function(response){
            console.log("This is response: " + JSON.stringify(response));
            refresh();
        },function(response){
            console.log('no response given');
        });
    }

    $scope.updateChar = function(id) {
        // console.log(id);
        function result(char) {
            return char._id == id;
        }
        console.log($scope.characters.find(result => result._id == id));
        $http.put('/characters/' + id, $scope.characters.find(result => result._id == id)).then(function(response){
            console.log("This is response: " + JSON.stringify(response));
            refresh();
        },function(response){
            console.log('no response given');
        });
    }

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
