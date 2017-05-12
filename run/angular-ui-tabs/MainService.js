;(function () {
  'use strict';

  var tabs = [
    { paneId: 'tab01', title: 'Tab 1 of 12', content: 'Tab Number 1 Content', active: true, disabled: false },
    { paneId: 'tab02', title: 'Tab 2 of 12', content: 'Tab Number 2 Content', active: false, disabled: false },
    { paneId: 'tab03', title: 'Tab 3 of 12', content: 'Tab Number 3 Content', active: false, disabled: false },
    { paneId: 'tab04', title: 'Tab 4 of 12', content: 'Tab Number 4 Content', active: false, disabled: false },
    { paneId: 'tab05', title: 'Tab 5 of 12', content: 'Tab Number 5 Content', active: false, disabled: true },
    { paneId: 'tab06', title: 'Tab 6 of 12', content: 'Tab Number 6 Content', active: false, disabled: false },
    { paneId: 'tab07', title: 'Tab 7 of 12', content: 'Tab Number 7 Content', active: false, disabled: false },
    { paneId: 'tab08', title: 'Tab 8 of 12', content: 'Tab Number 8 Content', active: false, disabled: false },
    { paneId: 'tab09', title: 'Tab 9 of 12', content: 'Tab Number 9 Content', active: false, disabled: false },
    { paneId: 'tab10', title: 'Tab 10 of 12', content: 'Tab Number 10 Content', active: false, disabled: false },
    { paneId: 'tab11', title: 'Tab 11 of 12', content: 'Tab Number 11 Content', active: false, disabled: false },
    { paneId: 'tab12', title: 'Tab 12 of 12', content: 'Tab Number 12 Content', active: false, disabled: false }
  ];


  function MainService($timeout) {
    var svc = this;

    svc.data = {
      tabs: tabs
    };


  }

  MainService.$inject = ['$timeout'];

  angular.module('myapp').service('MainService', MainService);
}());
