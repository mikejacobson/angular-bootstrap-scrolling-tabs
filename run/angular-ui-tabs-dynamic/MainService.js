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

    svc.rmvTab = function () {
      // make the new tab active; disable current active tab
      tabs.some(function __forEachTab(tab) {
        if (tab.active) {
          tab.active = false;
          return true; // exit loop
        }
      });

      tabs.pop();

      // make last tab active
      if (tabs.length) {
        tabs[tabs.length - 1].active = true;
      }

      --tabNum;
    };


  }

  MainService.$inject = ['$timeout'];

  angular.module('myapp').service('MainService', MainService);
}());
