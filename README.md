angular-bootstrap-scrolling-tabs
================================

Angular directive for making Bootstrap 3 Tabs scroll horizontally. It works in modern browsers, plus IE8.

<a href="http://plnkr.co/edit/YhKiIhuAPkpAyacu6tuk" target="_blank">Here's a plunk</a>.



Usage
-----
1. Download it or install it using bower: `bower install angular-bootstrap-scrolling-tabs`
2. Include `scrolling-tabs.min.css` (or `scrolling-tabs.css`) on your page *after* Bootstrap's CSS
3. Include `scrolling-tabs.min.js` (or `scrolling-tabs.js`) on your page
4. Add `mj.scrollingTabs` as a module dependency to your app: `angular.module('myapp', ['mj.scrollingTabs']);`




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
      <a ng-href="{{'#' + tab.paneId}}" role="tab" data-toggle="tab" ng-bind-html="sanitize(tab.label)"></a>
    </li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div class="tab-pane" ng-class="{ 'active': tab.isActive }" id="{{tab.paneId}}"
                                    ng-repeat="tab in main.tabs">{{tab.paneContent}}</div>
  </div>

</div>
```

you could replace the `nav-tabs` with the `<scrolling-tabs />` directive, like so:
```html
<div class="scrolling-tabs-container" ng-controller="MainCtrl as main">

  <!-- Scrolling Nav tabs -->
  <scrolling-tabs tabs="{{main.tabs}}" prop-pane-id="paneId" prop-label="label" prop-active="isActive"
                              tab-click="main.handleClickOnTab($event, $index, tab);"></scrolling-tabs>

  <!-- Tab panes -->
  <div class="tab-content">
    <div class="tab-pane" ng-class="{ 'active': tab.isActive }" id="{{tab.paneId}}"
                                                ng-repeat="tab in main.tabs">{{tab.paneContent}}</div>
  </div>

</div>
```


The directive requires a `tabs` attribute, which must be set to an array of objects like this (note that the tab labels can contain HTML):
```javascript
var tabs = [
  { paneId: 'tab01', label: 'Tab <strong>1</strong> of 5', isActive: true },
  { paneId: 'tab02', label: 'Tab <strong>2</strong> of 5', isActive: false },
  { paneId: 'tab03', label: 'Tab <strong>3</strong> of 5', isActive: false },
  { paneId: 'tab04', label: 'Tab <strong>4</strong> of 5', isActive: false },
  { paneId: 'tab05', label: 'Tab <strong>5</strong> of 5', isActive: false }
];

```

Each object must have a property for its label, a property for the ID of its target pane (so its href property can be set), and a boolean property indicating whether it's active or not.

By default, the directive assumes those properties will be named `label`, `paneId`, and `isActive`, but if you want to use different property names, you can pass them in as attributes on the directive element:


| Property | Default Property Name | Optional Attribute for Custom Property Name |
| -------- | ------------ | ----------------------- |
| Label    | label | prop-label |
| Target Pane ID | paneId | prop-pane-id |
| Active | isActive | prop-active |


So, for example, if your tab objects used the property name `title` for their labels, you would add attribute `prop-label="title"` to the `<scrolling-tabs>` element.


An optional `tab-click` attribute can also be added to the directive. That function will be called when a tab is clicked. It can be configured to accept the Angular `$event` and `$index` arguments, as well as the `tab` object that was clicked (which must be assigned the parameter name `tab`).



License
-------
MIT License.
