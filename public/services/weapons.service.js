angular.module('dgApp').service('weaponsSvc', function($http) {
    this.$http = $http;
    this.getWeapons = function(){
        return $http.get('/weapons');
    };
});