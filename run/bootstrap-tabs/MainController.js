;(function () {
  'use strict';

  function MainController($scope, MainService) {
    var ctrl = this;

    ctrl.uc1Tabs = MainService.data.uc1Tabs;
    ctrl.uc2Tabs = MainService.data.uc2Tabs;
    ctrl.uc3Pills = MainService.data.uc3Pills;
  }

  MainController.$inject = ['$scope', 'MainService'];

  angular.module('myapp').controller('MainController', MainController);
}());
