;(function () {
  'use strict';

  function MainController(MainService) {
    var ctrl = this;

    ctrl.tabs = MainService.data.tabs;

    ctrl.addTab = function () {
      MainService.addTab();
    };

    ctrl.Example = function(){

      alert('test');
    };

    ctrl.handleClickOnTab = function (e, idx, tab) {
    };
  }

  MainController.$inject = ['MainService'];

  angular.module('myapp').controller('MainController', MainController);
}());
