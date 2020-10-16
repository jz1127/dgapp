var app = angular.module('dgApp');

app.controller('editAgentController', function($scope, $http, $stateParams, characterService, refreshService, Upload, $window, $location, weaponsSvc, $state) {
    var vm = this;
    weaponsSvc.getWeapons().then(response => {
        this.weapons = response.data;
    });
    
    $scope.getWeapon = function(wep) {
        d =  JSON.parse(wep);
        return {name: d.name, base_range: d.base_range}
    }

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

    // if ($stateParams.mode === 'editwep') {
    //     $http({
    //         url: "/weapons",
    //         method: "GET",
    //     }).then(function (response) {
    //         $scope.weapons = response.data;
    //         // alert($scope.weapons);
    //     }, function(response) {
    //         console.log('no response given');
    //     });
    // }
 
    $scope.changeVal = function(row) {
        // alert(JSON.stringify(row));
        // alert(typeof(row._id));
        // var test = $scope.weapons.find(x => x._id == "5f5901f61eb68f786c161861");
        // alert(JSON.stringify(test));

        // alert(JSON.stringify(row));
        //if weapon find weapon by name and get its information to pass to the update agent function.
        $scope.characters.find((o, i) => {
            if (o.name === row.name) {
                $scope.characters[i] = { name: o.name, occupation: o.occupation, hp: row.hp, str: row.str, dex: row.dex, con: row.con, image: row.image };
                return true;    
            }
        });
        $scope.updateAgent(row);
    }

    // $scope.addBond = function() {
    //     var keys = Object.keys($scope.agent.bnd);
    //     numBonds = keys.length + 1;
    //     console.log("agentBonds is" + JSON.stringify($scope.agent.bnd));
    //     var newBondName = "bond" + numBonds;
    //     $scope.agent.bnd[newBondName] = {name: "Bond Name/Desc", score: 0 };
    // }

    $scope.addRow = function(obj, keyName) {
        if (!$scope.agent[obj]) {
            $scope.agent[obj] = {};
        }
        var keys = Object.keys($scope.agent[obj]);
        var now = new Date();
        // numKeys = keys.length + 1;
        // alert(keyName);
        var newKeyName = String(keyName) + "_" + String(now.getTime());
        // alert("The key is: " +newKeyName);
        $scope.agent[obj][newKeyName] = {"_id": newKeyName};
        }

    $scope.deletit = function(obj, weapon, wepid, agentid) {
        console.log("obj " + obj);
        console.log("wepid " + wepid);
        console.log("agentid " + agentid);
        console.log("weapon" + JSON.stringify(weapon));
        $http.delete('/characterssub/' + agentid + '/' + wepid).then(function(response){
            console.log("This is response: " + JSON.stringify(response));
            // refresh();
        },function(response){
            console.log('no response given');
        });
        $state.reload();
    }

    $scope.setAgentWeapon = function(){
        // $scope.agent[agentid]['weapons'][weaponObj.name]['name'] = 'test';
        alert('Hello');
        $scope.weapon.name = "Hello";
        // console.log(agentId);
        // console.log(weaponObj);
    }
    $scope.callback = function(newval){
        // alert(JSON.parse(newval).base_range);
        $scope.value = JSON.parse(newval).base_range;
      }

});