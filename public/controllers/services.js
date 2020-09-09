var app = angular.module('dgApp');

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