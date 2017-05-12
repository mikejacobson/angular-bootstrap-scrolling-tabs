;(function () {
  'use strict';

  function MainController($scope, MainService) {
    var ctrl = this;

    ctrl.uc1Tabs = MainService.data.uc1Tabs;
    ctrl.uc2Tabs = MainService.data.uc2Tabs;

    ctrl.selectTab = function() {
      var t = ctrl.uc1Tabs.find(function(t) {
        return t.active;
      }).active = false;

var t = ctrl.uc1Tabs[ctrl.tabNum - 1];

      ctrl.uc1Tabs[ctrl.tabNum - 1].active = true;
console.log(t);
      //ctrl.uc1Tabs.push({ paneId: 'uc1tab13', title: 'Tab <strong>13</strong> of 17', content: 'Tab Number 13 Content', active: false, disabled: false });


      console.log(ctrl.uc1Tabs);

    };

    ctrl.handleClickOnTab = function (e, idx, tab) {
    };
  }

  MainController.$inject = ['$scope', 'MainService'];

  angular.module('myapp').controller('MainController', MainController);
}());
