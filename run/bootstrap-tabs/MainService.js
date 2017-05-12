;(function () {
  'use strict';

  var uc1Tabs = [
    { paneId: 'uc1tab01', title: 'Tab <strong>1</strong> of 17', content: 'Tab Number 1 Content', active: true, disabled: false },
    { paneId: 'uc1tab02', title: 'Tab <strong>2</strong> of 17', content: 'Tab Number 2 Content', active: false, disabled: false },
    { paneId: 'uc1tab03', title: 'Tab <strong>3</strong> of 17', content: 'Tab Number 3 Content', active: false, disabled: false },
    { paneId: 'uc1tab04', title: 'Tab <strong>4</strong> of 17', content: 'Tab Number 4 Content', active: false, disabled: false },
    { paneId: 'uc1tab05', title: 'Tab <strong>5</strong> of 17', content: 'Tab Number 5 Content', active: false, disabled: true },
    { paneId: 'uc1tab06', title: 'Tab <strong>6</strong> of 17', content: 'Tab Number 6 Content', active: false, disabled: false },
    { paneId: 'uc1tab07', title: 'Tab <strong>7</strong> of 17', content: 'Tab Number 7 Content', active: false, disabled: false },
    { paneId: 'uc1tab08', title: 'Tab <strong>8</strong> of 17', content: 'Tab Number 8 Content', active: false, disabled: false },
    { paneId: 'uc1tab09', title: 'Tab <strong>9</strong> of 17', content: 'Tab Number 9 Content', active: false, disabled: false },
    { paneId: 'uc1tab10', title: 'Tab <strong>10</strong> of 17', content: 'Tab Number 10 Content', active: false, disabled: false },
    { paneId: 'uc1tab11', title: 'Tab <strong>11</strong> of 17', content: 'Tab Number 11 Content', active: false, disabled: false },
    { paneId: 'uc1tab12', title: 'Tab <strong>12</strong> of 17', content: 'Tab Number 12 Content', active: false, disabled: false }/*,
    { paneId: 'uc1tab13', title: 'Tab <strong>13</strong> of 17', content: 'Tab Number 13 Content', active: false, disabled: false },
    { paneId: 'uc1tab14', title: 'Tab <strong>14</strong> of 17', content: 'Tab Number 14 Content', active: false, disabled: false },
    { paneId: 'uc1tab15', title: 'Tab <strong>15</strong> of 17', content: 'Tab Number 15 Content', active: false, disabled: false },
    { paneId: 'uc1tab16', title: 'Tab <strong>16</strong> of 17', content: 'Tab Number 16 Content', active: false, disabled: false },
    { paneId: 'uc1tab17', title: 'Tab <strong>17</strong> of 17', content: 'Tab Number 17 Content', active: false, disabled: false }*/
  ];

  var uc2Tabs = [
    { paneId: 'uc2tab01', title: 'Tab 1 of 12', content: 'Tab Number 1 Content', active: true, disabled: false },
    { paneId: 'uc2tab02', title: 'Tab 2 of 12', content: 'Tab Number 2 Content', active: false, disabled: false },
    { paneId: 'uc2tab03', title: 'Tab 3 of 12', content: 'Tab Number 3 Content', active: false, disabled: false },
    { paneId: 'uc2tab04', title: 'Tab 4 of 12', content: 'Tab Number 4 Content', active: false, disabled: false },
    { paneId: 'uc2tab05', title: 'Tab 5 of 12', content: 'Tab Number 5 Content', active: false, disabled: true },
    { paneId: 'uc2tab06', title: 'Tab 6 of 12', content: 'Tab Number 6 Content', active: false, disabled: false },
    { paneId: 'uc2tab07', title: 'Tab 7 of 12', content: 'Tab Number 7 Content', active: false, disabled: false },
    { paneId: 'uc2tab08', title: 'Tab 8 of 12', content: 'Tab Number 8 Content', active: false, disabled: false },
    { paneId: 'uc2tab09', title: 'Tab 9 of 12', content: 'Tab Number 9 Content', active: false, disabled: false },
    { paneId: 'uc2tab10', title: 'Tab 10 of 12', content: 'Tab Number 10 Content', active: false, disabled: false },
    { paneId: 'uc2tab11', title: 'Tab 11 of 12', content: 'Tab Number 11 Content', active: false, disabled: false },
    { paneId: 'uc2tab12', title: 'Tab 12 of 12', content: 'Tab Number 12 Content', active: false, disabled: false }
  ];


  function MainService($timeout) {
    var svc = this;

    svc.data = {
      uc1Tabs: uc1Tabs,
      uc2Tabs: uc2Tabs
    };
  }

  MainService.$inject = ['$timeout'];

  angular.module('myapp').service('MainService', MainService);
}());
