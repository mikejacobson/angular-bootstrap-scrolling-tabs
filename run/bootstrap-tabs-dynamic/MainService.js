;(function () {
  'use strict';


  
  var uc1Tabs = [],
      uc2Tabs = [];


  function MainService($timeout) {
    var svc = this,
        uc1TabNum = 0,
        uc2TabNum = 0;

    svc.data = {
      uc1Tabs: uc1Tabs,
      uc2Tabs: uc2Tabs
    };


    // start with 1 tab
    uc1Tabs.push({ paneId: 'uc1tab' + (++uc1TabNum) , title: 'Tab Number ' + uc1TabNum, content: 'Tab Number ' + uc1TabNum + ' Content', active: true, disabled: false });

    svc.addUc1Tab = function () {

      // we want the new tab to default active, so deactivate the currently
      // active tab before adding the new one
      uc1Tabs.some(function (t) {
        if (t.active) {
          t.active = false;
          return true; // exit loop
        }
      });

      uc1Tabs.push({ paneId: 'uc1tab' + (++uc1TabNum) , title: 'Tab Number ' + uc1TabNum, content: 'Tab Number ' + uc1TabNum + ' Content', active: true, disabled: false });
    };


    svc.rmvUc1Tab = function () {
      // make the new tab active; disable current active tab
      uc1Tabs.some(function __forEachTab(tab) {
        if (tab.active) {
          tab.active = false;
          return true; // exit loop
        }
      });

      uc1Tabs.pop();

      // make last tab active
      if (uc1Tabs.length) {
        uc1Tabs[uc1Tabs.length - 1].active = true;
      }

      --uc1TabNum;
    };




    // start with 1 tab
    uc2Tabs.push({ paneId: 'uc2tab' + (++uc2TabNum) , title: 'Tab Number ' + uc2TabNum, content: 'Tab Number ' + uc2TabNum + ' Content', active: true, disabled: false });

    svc.addUc2Tab = function () {

      // we want the new tab to default active, so deactivate the currently
      // active tab before adding the new one
      uc2Tabs.some(function (t) {
        if (t.active) {
          t.active = false;
          return true; // exit loop
        }
      });

      uc2Tabs.push({ paneId: 'uc2tab' + (++uc2TabNum) , title: 'Tab Number ' + uc2TabNum, content: 'Tab Number ' + uc2TabNum + ' Content', active: true, disabled: false });
    };

    svc.rmvUc2Tab = function () {
      // make the new tab active; disable current active tab
      uc2Tabs.some(function __forEachTab(tab) {
        if (tab.active) {
          tab.active = false;
          return true; // exit loop
        }
      });

      uc2Tabs.pop();

      // make last tab active
      if (uc2Tabs.length) {
        uc2Tabs[uc2Tabs.length - 1].active = true;
      }

      --uc2TabNum;
    };

  }

  MainService.$inject = ['$timeout'];

  angular.module('myapp').service('MainService', MainService);
}());
