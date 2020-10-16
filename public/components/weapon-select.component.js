function WeaponSelectController(weaponsSvc) {
    var vm = this;
    weaponsSvc.getWeapons().then(response => {
        vm.weapons = response.data;
    });
}

// angular.module('dgApp').component('weaponSelect', {
//     templateUrl: 'components/weapon-select.html',
//     controller: WeaponSelectController,
//     controllerAs: 'mm',
//     bindings: {
//         agentId: '<',         
//         weaponObj: '<',
//         setAgentWeapon: '<'
//     }

angular.module('dgApp').component('weaponSelect', {
    templateUrl: 'components/weapon-select.html',
    controller: WeaponSelectController,
    controllerAs: 'wpctrl',
    bindings: {
        value: '<',
        callback: '<'
    }
});