angular-bootstrap-scrolling-tabs
================================

Angular directives for making Bootstrap 3 Tabs or AngularUI Bootstrap Tabs scroll horizontally rather than wrap. (Note that jQuery is required, not just JQLite.)

Here's what they look like:

![](https://raw.githubusercontent.com/mikejacobson/angular-bootstrap-scrolling-tabs/master/st-screenshot1.png)


And here are plunks showing them working with:

* <a href="http://plnkr.co/edit/43XQ0AkouE23UcTUJvIK?p=preview" target="_blank">Bootstrap 3 Tabs (and Pills)</a>
* <a href="http://plnkr.co/edit/jfuuLlIK32dTG5eXq3ip?p=preview" target="_blank">AngularUI Bootstrap Tabs</a>
* <a href="http://plnkr.co/edit/mV5ImxkQK4mnDJb88h0B?p=preview" target="_blank">Bootstrap 3 Tabs with tabs added dynamically after page load</a>
* <a href="http://plnkr.co/edit/d3KuB1x15HXHIAMqOWFi?p=preview" target="_blank">AngularUI Bootstrap Tabs with tabs added dynamically after page load</a>

Use Cases
---------
There are two directives to choose from, and three ways to use them:
* [Use Case #1: Replace Standard Bootstrap Tabs](#uc1)
* [Use Case #2: Wrap Standard Bootstrap Tabs (or Pills)](#uc2)
* [Use Case #3: Wrap AngularUI Bootstrap Tabs](#uc3)


Optional Features
-----------------
There are also some optional features available:
* [Support Adding Tabs Dynamically After Page Load](#ft1)
* [Force Scroll to Tab Edge](#ft2)
* [Force Refresh of Tab Container](#refreshOn)



Usage
-----
1. Download it or install it using bower: `bower install angular-bootstrap-scrolling-tabs` or npm: `npm install angular-bootstrap-scrolling-tabs`
2. Include `scrolling-tabs.min.css` (or `scrolling-tabs.css`) on your page *after* Bootstrap's CSS
3. Include `scrolling-tabs.min.js` (or `scrolling-tabs.js`) on your page (make sure that jQuery and Angular are included before it, and that jQuery is included before Angular)
4. Add `mj.scrollingTabs` as a module dependency to your app: `angular.module('myapp', ['mj.scrollingTabs']);`




Overview
--------
If you're using Bootstrap Tabs (`nav-tabs`) or AngularUI Bootstrap Tabs (`tabset`) and you don't want them to wrap if the page is too narrow to accommodate them all in one row, you can use these Angular directives to keep them in a row that scrolls horizontally.

It adjusts itself on window resize (debounced to prevent resize event wackiness), so if the window is widened enough to accommodate all tabs, scrolling will deactivate and the scroll arrows will disappear. (And, of course, vice versa if the window is narrowed.)

There are two directives to choose from, depending on your application:

`scrolling-tabs` is an element directive that *replaces* your standard Bootstrap `ul.nav-tabs` element.

`scrolling-tabs-wrapper` is an attribute directive that *wraps* either a standard Bootstrap `ul.nav-tabs` element or an AngularUI Bootstrap `tabset` element.

Note: Similar to [Bootstrap tabs](http://getbootstrap.com/javascript/#tabs), nested tabs are not supported.

Use Cases
---------
#### <a id="uc1"></a>Use Case #1: Replace Standard Bootstrap Tabs

If your `nav-tabs` markup looks like this (it assumes your tabs are data-driven and you're using `ng-repeat` to generate them):
```html
<div class="scrolling-tabs-container" ng-controller="MainCtrl as main">

  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li ng-class="{ 'active': tab.active, 'disabled': tab.disabled }" ng-repeat="tab in main.tabs">
      <a ng-href="{{'#' + tab.paneId}}" role="tab" data-toggle="tab">{{tab.title}}</a>
    </li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div class="tab-pane" ng-class="{ 'active': tab.active }" id="{{tab.paneId}}"
                                    ng-repeat="tab in main.tabs">{{tab.content}}</div>
  </div>

</div>
```

you can replace the `ul.nav-tabs` element with the `scrolling-tabs` element directive, like so:
```html
<div class="scrolling-tabs-container" ng-controller="MainCtrl as main">

  <!-- Scrolling Nav tabs -->
  <scrolling-tabs tabs="{{main.tabs}}"
                  prop-pane-id="paneId"
                  prop-title="title"
                  prop-active="active"
                  prop-disabled="disabled"
                  tab-click="main.handleClickOnTab($event, $index, tab);">
  </scrolling-tabs>

  <!-- Tab panes -->
  <div class="tab-content">
    <div class="tab-pane" ng-class="{ 'active': tab.active }" id="{{tab.paneId}}"
                                    ng-repeat="tab in main.tabs">{{tab.content}}</div>
  </div>

</div>
```


The only attribute the directive requires is a `tabs` attribute&mdash;the others are all optional, depending on your setup&mdash;which must be set to an array of objects like this (note that the tab titles can contain HTML):
```javascript
var tabs = [
  { paneId: 'tab01', title: 'Tab <em>1</em> of 12', content: 'Tab Number 1 Content', active: true, disabled: false },
  { paneId: 'tab02', title: 'Tab 2 of 12', content: 'Tab Number 2 Content', active: false, disabled: false },
  { paneId: 'tab03', title: 'Tab 3 of 12', content: 'Tab Number 3 Content', active: false, disabled: false },
  { paneId: 'tab04', title: 'Tab 4 of 12', content: 'Tab Number 4 Content', active: false, disabled: false },
  { paneId: 'tab05', title: 'Tab 5 of 12', content: 'Tab Number 5 Content', active: false, disabled: false }
];

```

Each object must have a property for the tab title, a property for the ID of its target pane (so its href property can be set), and a boolean property for its active state; optionally, it can also have a boolean for its disabled state.

By default, the directive assumes those properties will be named `title`, `paneId`, `active`, and `disabled`, but if you want to use different property names, you can pass them in as attributes on the directive element:


| Property | Default Property Name | Optional Attribute for Custom Property Name |
| -------- | ------------ | ----------------------- |
| Title    | title | prop-title |
| Target Pane ID | paneId | prop-pane-id |
| Active | active | prop-active |
| Disabled | disabled | prop-disabled |


So, for example, if your tab objects used the property name `tabLabel` for their titles, you would add attribute `prop-title="tabLabel"` to the `<scrolling-tabs>` element.


An optional `tab-click` attribute can also be added to the directive. That function will be called when a tab is clicked. It can be configured to accept the Angular `$event` and `$index` arguments, as well as the `tab` object that was clicked (which must be assigned the parameter name `tab`).




#### <a id="uc2"></a>Use Case #2: Wrap Standard Bootstrap Tabs (or Pills)

If you would prefer to keep your standard Bootstrap `ul.nav-tabs` (or `ul.nav-pills`) markup and just want to make it scrollable, you can wrap it in a `div` that has the `scrolling-tabs-wrapper` attribute directive on it:

```html
  <!-- wrap nav-tabs ul in a div with scrolling-tabs-wrapper directive on it -->
  <div scrolling-tabs-wrapper>

    <!-- Standard Bootstrap ul.nav-tabs -->
    <ul class="nav nav-tabs" role="tablist">
      <li ng-class="{ 'active': tab.active, 'disabled': tab.disabled }" ng-repeat="tab in main.tabs">
        <a ng-href="{{'#' + tab.paneId}}" role="tab" data-toggle="tab">{{tab.title}}</a>
      </li>
    </ul>

  </div>

  <!-- Tab panes -->
  <div class="tab-content">
    <div class="tab-pane" ng-class="{ 'active': tab.active }" id="{{tab.paneId}}"
                                        ng-repeat="tab in main.tabs">{{tab.content}}</div>
  </div>
```



#### <a id="uc3"></a>Use Case #3: Wrap AngularUI Bootstrap Tabs

Similarly, if you're using AngularUI Bootstrap Tabs, you can make them scrollable by wrapping the `tabset` element in a `div` that has the `scrolling-tabs-wrapper` attribute directive on it:

```html
  <!-- wrap tabset in a div with scrolling-tabs-wrapper directive on it -->
<div scrolling-tabs-wrapper>

  <tabset>
    <tab ng-repeat="tab in main.tabs" heading="{{tab.title}}" active="tab.active" disabled="tab.disabled">
      {{tab.content}}
    </tab>
  </tabset>

</div>
```




Optional Features
-----------------

#### <a id="ft1"></a>Support Adding Tabs Dynamically After Page Load

If you will be adding tabs after page load (via, say, button click), add attribute `watch-tabs` to the directive element and have it point to your tabs array:

```html
<scrolling-tabs tabs="{{main.tabs}}"
                watch-tabs="main.tabs"
```

```html
<div scrolling-tabs-wrapper watch-tabs="main.tabs">
```

This will add a watcher to your `tabs` array that triggers the directive to refresh itself if the array changes.


#### <a id="ft2"></a>Force Scroll to Tab Edge

If you want to ensure the scrolling always ends with a tab edge aligned with the left scroll arrow so there won't be a partially hidden tab, add attribute `scroll-to-tab-edge="true"` to the directive element:

```html
<scrolling-tabs tabs="{{main.tabs}}"
                scroll-to-tab-edge="true"
```

```html
<div scrolling-tabs-wrapper scroll-to-tab-edge="true">
```

There's no way to guarantee the left *and* right edges will be full tabs because that's dependent on the the width of the tabs and the window. So this just makes sure the left side will be a full tab.


#### <a id="refreshOn"></a>Force Refresh of Tabs Container

You can use the `refresh-on` attribute to force a refresh of the tabs container sizing (along with an automatic scroll to the active tab if it's not in view after the resize). If, for example, you will be programmatically changing the size of the container&mdash;and therefore no window resize event will trigger&mdash;the tabs container will need to be told that it should resize its various components.

```html
<scrolling-tabs tabs="{{main.tabs}}"
                refresh-on="main.triggerRefresh"
```

```html
<div scrolling-tabs-wrapper refresh-on="main.triggerRefresh">
```

If that attribute is present, the directive will set up a `$watch` on that scope property and force a refresh when the property is truthy. So there are different ways you can set it up:

```javascript
/* Option 1 - use a boolean that will need to get set back to false each
              time, otherwise the $watch will only trigger the first time
              you set it to true */
main.triggerRefresh = false;

function forceARefresh() {
  main.triggerRefresh = true;
  $timeout(function() {
    main.triggerRefresh = false;
  });
}

/* Option 2 - use an int and increment it each time */
main.triggerRefresh = 0;

function forceARefresh() {
  main.triggerRefresh++;
}

```


License
-------
MIT License.
