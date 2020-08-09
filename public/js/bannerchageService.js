var app = angular.module('dgApp');

app.factory('bannerchangeSerice', function(pic) {
    return {
        changeBanner: function ($scope) {
            return $scope.image =  pic;
        }
    };
});