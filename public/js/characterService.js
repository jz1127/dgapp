/// <reference path="public\controllers\controllers.js"

var app = angular.module('dgApp', ['ui.router']);

app.factory('characterService', function($http) {
    // console.log($http);
    return {
        getCharacters: function () {
         return $http({
                method: 'GET',
                url: '/characters'
                }).then(function(response) {
                    // console.log('response: ' + response);
                    return response.data;
                }, function(response) {
                    console.log('no response given');
            });
        }
    };
});
