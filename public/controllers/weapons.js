var app = angular.module('dgApp');

app.controller('weapons', function($scope, $http, $stateParams, characterService, refreshService) {
    $scope.addWeapon = function() {
        console.log("New Char is this: " + JSON.stringify($scope.newWep));
        if (typeof $scope.newWep !== "undefined" && typeof null !== $scope.newWep) {
            $serData = JSON.stringify($scope.newWep);
            $http({
                    method: 'POST',
                    url: '/weapons',
                    data: $serData
                }).then(function(response){
                // console.log("This is response: " + JSON.stringify(response.data));
                alert("weapon added");
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
});