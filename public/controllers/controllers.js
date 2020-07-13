var app = angular.module('dgApp', []);
app.controller('homeCtrl', function($scope, $http) {    

var refresh = function () {
    $http({
     method: 'GET',
    url: '/characters'
    }).then(function(response){
        // console.log(response.data);
        $scope.characters = response.data;

        for (var key in $scope.newChar ) {
            $scope.newChar[key] = null;
          }

    },function(response){
        console.log('no response given');
    });
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

});