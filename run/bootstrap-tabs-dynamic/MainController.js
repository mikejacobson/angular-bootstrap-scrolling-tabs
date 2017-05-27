;(function () {
  'use strict';

  MainController.$inject = ['$timeout', 'MainService'];

  function MainController($timeout, MainService) {
    var ctrl = this;

    ctrl.uc1Tabs = MainService.data.uc1Tabs;
    ctrl.uc2Tabs = MainService.data.uc2Tabs;

    ctrl.addUc1Tab = MainService.addUc1Tab;
    ctrl.addUc2Tab = MainService.addUc2Tab;
  }


  angular.module('myapp').controller('MainController', MainController);
}());
