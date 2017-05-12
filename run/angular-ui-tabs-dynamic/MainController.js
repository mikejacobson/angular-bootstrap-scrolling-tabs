;(function () {
  'use strict';

  function MainController(MainService) {
    var ctrl = this;

    ctrl.showHidden = true;

    ctrl.tabs = MainService.data.tabs;

    ctrl.showHiddenTabs = function() {
      ctrl.showHidden = true;
    };

    ctrl.addTab = function () {
      MainService.addTab();
    };

    ctrl.rmvTab = function () {
      MainService.rmvTab();
    };

    ctrl.handleClickOnTab = function (e, idx, tab) {
    };
  }

  MainController.$inject = ['MainService'];

  angular.module('myapp').controller('MainController', MainController);
}());
