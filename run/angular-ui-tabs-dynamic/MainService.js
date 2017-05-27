;(function () {
  'use strict';

  function MainService($timeout) {
    var svc = this,
        tabs = [],
        tabNum = 0;

    svc.data = {
      tabs: tabs
    };

    svc.addTab = function () {
      // make the new tab active; disable current active tab
      tabs.some(function __forEachTab(tab) {
        if (tab.active) {
          tab.active = false;
          return true; // exit loop
        }
      });

      tabs.push({ paneId: 'tab' + (++tabNum), title: 'Tab Number ' + tabNum, content: 'Tab Number ' + tabNum + ' Content', active: true, disabled: false });
    };

  }

  MainService.$inject = ['$timeout'];

  angular.module('myapp').service('MainService', MainService);
}());
