angular-bootstrap-scrolling-tabs
================================

Angular directive for making Bootstrap 3 Tabs scroll horizontally. It works in modern browsers, plus IE8.


Usage
-----
1. Make sure you have <a href="http://getbootstrap.com/" target="_blank">Twitter Bootstrap</a> and <a href="https://angularjs.org/" target="_blank">AngularJS</a> on your page
2. Get the `scrolling-tabs.*` files from this repo
3. Include `scrolling-tabs.min.css` (or `scrolling-tabs.css`) on your page *after* Bootstrap's CSS
4. Include `scrolling-tabs.min.js` (or `scrolling-tabs.js`) on your page
5. Add `mj.scrollingTabs` as a module dependency to your app: `angular.module('myapp', ['mj.scrollingTabs']);`



Demo
----
<a href="http://jsfiddle.net/mikejacobson/f2kxr5jL/embedded/result/" target="_blank">Here's a fiddle</a> showing it in action.

And <a href="http://jsfiddle.net/mikejacobson/f2kxr5jL/" target="_blank">here's the fiddle</a> with the code, so you can see how to integrate it into a page.




Overview
--------
If you're using Bootstrap `nav-tabs` (and Angular, of course) and you don't want them to wrap if the page is too narrow to accommodate them all in one row, you can use this Angular directive to keep them in a row that scrolls horizontally.

It adjusts itself on window resize (debounced to prevent resize event wackiness), so if the window is widened enough to accommodate all tabs, scrolling will deactivate and the scroll arrows will disappear. (And, of course, vice versa if the window is narrowed.)


So if your `nav-tabs` markup looks like this (it assumes your tabs are data-driven and you're using `ng-repeat` to generate them rather than having them hardcoded in the markup since this is for a scenario in which you might have many tabs):
```html
<div class="scrolling-tabs-container" ng-controller="MainCtrl as main">

  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li ng-class="{ 'active': tab.isActive }" ng-repeat="tab in main.tabs">
      <a ng-href="{{'#' + tab.id}}" role="tab" data-toggle="tab">{{tab.title}}</a>
    </li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div class="tab-pane" ng-class="{ 'active': tab.isActive }" id="{{tab.id}}" ng-repeat="tab in main.tabs">{{tab.htmlContent}}</div>
  </div>

</div>
```

you could replace the `nav-tabs` with the `<scrolling-tabs />` directive, like so:
```html
<div class="scrolling-tabs-container" ng-controller="MainCtrl as main">

  <!-- Scrolling Nav tabs -->
  <scrolling-tabs tabs="{{main.tabs}}" tab-click="main.handleClickOnTab($event, $index, tab);"></scrolling-tabs>

  <!-- Tab panes -->
  <div class="tab-content">
    <div class="tab-pane" ng-class="{ 'active': tab.isActive }" id="{{tab.id}}" ng-repeat="tab in main.tabs">{{tab.htmlContent}}</div>
  </div>

</div>
```


The directive requires a `tabs` attribute, which must be an array of objects like this:
```javascript
var tabs = [
  { id: 'tab01', title: 'Tab 1 of 5', isActive: true },
  { id: 'tab02', title: 'Tab 2 of 5', isActive: false },
  { id: 'tab03', title: 'Tab 3 of 5', isActive: false },
  { id: 'tab04', title: 'Tab 4 of 5', isActive: false },
  { id: 'tab05', title: 'Tab 5 of 5', isActive: false }
];

```

The code as-is requires that each `tab` object in that array have the following properties:

| Property | Description |
| -------- | ----------- |
| id       | The id of the tab's content section; the tab's `href` attribute gets set to this id preceded by a `#` |
| title    | The text that will display in the tab |
| isActive | Boolean indicating if the tab is the active tab |


But, of course, the code can be tweaked to accommodate other object definitions.

An optional `tab-click` attribute can also be added to the directive. That function will be called when a tab is clicked. It can be configured to accept the Angular `$event` and `$index` arguments, as well as the `tab` object that was clicked (which must be assigned the parameter name `tab`).



License
-------
MIT License.
