;(function () {
  'use strict';

  var uc1Tabs = [],
      uc2Tabs = [];

  MainService.$inject = ['$timeout'];

  angular.module('myapp').service('MainService', MainService);

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

  }

}());
