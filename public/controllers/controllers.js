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

    var adminState = {
        name: 'admin',
        url: '/admin',
        templateUrl: '/partials/admin.html',
        controller: 'homeCtrl'
      }
  
    $stateProvider.state(helloState);
    $stateProvider.state(aboutState);
    $stateProvider.state(adminState);
  }]);

app.controller('homeCtrl', function($scope, $http, characterService) {

var refresh = function () {

    // characterService.getCharacters().then(function(char) {
    //     $scope.characters = char;
    // })

    characterService.getCharacters().then(char => $scope.characters = char);
    
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
        $serData = JSON.stringify($scope.newChar);
        $http({
                method: 'POST',
                url: '/characters',
                data: $serData
            }).then(function(response){
               console.log("This is response: " + JSON.stringify(response));
               refresh();
           },function(response){
               console.log('no response given');
           });
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