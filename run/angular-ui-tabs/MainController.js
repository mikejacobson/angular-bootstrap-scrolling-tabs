;(function () {
  'use strict';

function dummyComponent() {
  var dcCount = 0;

  return {
    restrict: 'EA',
    template: '<div>dc {{dcCount}}</div>',
    link: function(scope) {
      scope.dcCount = ++dcCount;
      console.log("Dummy component! ", scope.dcCount);
    }
  };
}

  function MainController(MainService) {
    var ctrl = this;

    ctrl.tabs = MainService.data.tabs;
    ctrl.identifyData = { tabs: ctrl.tabs }; // for Karen
ctrl.show1 = true;

var tabNum = 4;
ctrl.addTab = function () {
  ctrl.tabs.push({
    paneId: 'tab' + (++tabNum),
    title: 'Tab ' + tabNum + ' of 12',
    content: 'Tab Number ' + tabNum + ' Content',
    active: true,
    disabled: false });
};

    ctrl.handleClickOnTab = function (e, idx, tab) {
    };

    ctrl.junk = function () {
      console.log("MJJ-- junk");
    };

    ctrl.junk1 = function () {
      console.log("MJJ-- junk1");
    };
  }

  MainController.$inject = ['MainService'];

  angular.module('myapp')
  .controller('MainController', MainController)
  .directive('dummyComponent', dummyComponent);
  
}());
