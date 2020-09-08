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

    var adminState = {
        name: 'admin',
        url: '/admin',
        templateUrl: '/partials/admin.html',
        controller: 'dashCtrl'
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


app.controller('editAgentDetailsController', function($scope, $http, $stateParams, characterService, refreshService, Upload, $window, $location) {
    var vm = this;

    $scope.updateAgent = function(agent) {
        // console.log(agent);
        console.log("The agent was: " + JSON.stringify(agent));
        $http.put('/characters/' + agent._id, agent).then(function(response){
            console.log("This is response: " + JSON.stringify(response));
        },function(response){
            console.log('no response given');
        });
    }

    vm.submit = function(agent){ //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file); //call upload function
        }
    }

    vm.upload = function (file) {
        Upload.upload({
            url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                $window.alert('Success ' + JSON.stringify(resp.data.modname) + ' uploaded. Response: ');
                console.log("response was " +JSON.stringify(resp.data));
                $scope.$parent.agent.image = resp.data.modname;
                $scope.updateAgent($scope.$parent.agent);
                $location.path('/dashboard/editagent/' +$scope.$parent.agent._id);
                // console.log("Parent, Parnet is " +$scope.$parent.$parent.image);
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };

    $http({
        url: "/agent/" + $stateParams.id,
        method: "GET",
        params: { id: $stateParams.id }
    }).then(function (response) {
        $scope.agent = response.data;
        $scope.$parent.$parent.image = refreshService.setImage($scope.agent.image);
        $scope.$parent.$parent.tronname = refreshService.setTronText($scope.agent.name);
    });

    $scope.changeVal = function(row) {
        $scope.characters.find((o, i) => {
            if (o.name === row.name) {
                $scope.characters[i] = { name: o.name, occupation: o.occupation, hp: row.hp, str: row.str, dex: row.dex, con: row.con, image: row.image };
                return true;    
            }
        });
        $scope.updateAgent(row);
    }

    $scope.addBond = function() {
        var keys = Object.keys($scope.agent.bnd);
        numBonds = keys.length + 1;
        console.log("agentBonds is" + JSON.stringify($scope.agent.bnd));
        var newBondName = "bond" + numBonds;
        $scope.agent.bnd[newBondName] = {name: "test", score: 0 };
        // var divElement = angular.element(document.querySelector('.bndList'));
        // var bndInputs = '<div class="row"><div class="col-sm-10"><input type="text" class="form-control"  aria-label="Default" aria-describedby="input-sizing-default" ng-model="agent.bnd.bond' + numBonds + '.name" ng-change="changeVal(agent)"></div><div class="col-sm-2"><input type="text" class="form-control"  aria-label="Default" aria-describedby="input-sizing-default" ng-model="agent.bnd.bond' + numBonds +  '.score"></div></div>';
        // var htmlElement = angular.element(bndInputs);
        // divElement.append(htmlElement);
        // $compile(divElement)($scope);
        // alert("Num Bonds " +numBonds);
    }

    // $scope.uploadFile = function() {               
    //     var file = $scope.myFile;
    //     console.log('file is ' + file);
    //     console.dir(file);
    //     var uploadUrl = "/img/";
    //     fileUpload.uploadFileToUrl(file, uploadUrl);
    //  };
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
