;(function () {
  'use strict';

  MainController.$inject = ['$timeout', 'MainService'];

  function MainController($timeout, MainService) {
    var ctrl = this;

    ctrl.uc1Tabs = MainService.data.uc1Tabs;
    ctrl.uc2Tabs = MainService.data.uc2Tabs;


    ctrl.addUc1Tab = MainService.addUc1Tab;
    ctrl.rmvUc1Tab = MainService.rmvUc1Tab;

    ctrl.addUc2Tab = MainService.addUc2Tab;
    ctrl.rmvUc2Tab = MainService.rmvUc2Tab;

    ctrl.narrow = false;
    ctrl.refresh = false;
    ctrl.refresh2 = 0;

    ctrl.toggleNarrow = function() {
      ctrl.narrow = !ctrl.narrow;

      ctrl.refresh = true;
      $timeout(function () {
        ctrl.refresh = false;
      });

    };

    ctrl.toggleNarrow2 = function() {
      ctrl.narrow = !ctrl.narrow;
      ctrl.refresh2++;
    };


    ctrl.handleClickOnTab = function (e, idx, tab) {
    };

    ctrl.selectTab = function () {
      ctrl.uc1Tabs.forEach(function (t) {
        t.active = false;
      });

      ctrl.uc1Tabs[ctrl.tabNum-1].active = true;
    };

    ctrl.selectTab2 = function () {
      ctrl.uc2Tabs.forEach(function (t) {
        t.active = false;
      });

      ctrl.uc2Tabs[ctrl.tabNum2-1].active = true;
    };
  }


  angular.module('myapp').controller('MainController', MainController);
}());
