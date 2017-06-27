;(function () {
  'use strict';

  function MainController(MainService) {
    var ctrl = this;

    ctrl.tabs = MainService.data.tabs;

    ctrl.addTab = function () {
      MainService.addTab();
    };

    ctrl.handleClickOnTab = function (e, idx, tab) {
    };

    ctrl.testStrings = [];
    var testStringCount = 0;

    ctrl.clickInside = function() {
      console.log("click!!");
      ctrl.testStrings.push('click ' + testStringCount++);
      ctrl.testCount = testStringCount;
    }
  }

  MainController.$inject = ['MainService'];

  angular.module('myapp').controller('MainController', MainController);
}());
