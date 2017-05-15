scrollingTabsModule.directive('scrollingTabs', scrollingTabsDirective);

scrollingTabsDirective.$inject = ['$timeout', '$sce'];
function scrollingTabsDirective($timeout, $sce) {

  function sanitize (html) {
    return $sce.trustAsHtml(html);
  }


  // ------------ Directive Object ---------------------------
  return {
    restrict: 'E',
    template: scrollingTabsTemplate,
    transclude: false,
    replace: true,
    scope: {
      tabs: '@',
      watchTabs: '=',
      propPaneId: '@',
      propTitle: '@',
      propActive: '@',
      propDisabled: '@',
      localTabClick: '&tabClick',
      refreshOn: '='
    },
    link: function(scope, element, attrs) {
      var scrollingTabsControl = new ScrollingTabsControl(element, $timeout),
          scrollToTabEdge = attrs.scrollToTabEdge && attrs.scrollToTabEdge.toLowerCase() === 'true';

      scope.tabsArr = scope.$eval(scope.tabs);
      scope.propPaneId = scope.propPaneId || 'paneId';
      scope.propTitle = scope.propTitle || 'title';
      scope.propActive = scope.propActive || 'active';
      scope.propDisabled = scope.propDisabled || 'disabled';
      scope.sanitize = sanitize;


      element.on('click.scrollingTabs', '.nav-tabs > li', function __handleClickOnTab(e) {
        var clickedTabElData = $(this).data();

        scope.localTabClick({
          $event: e,
          $index: clickedTabElData.index,
          tab: clickedTabElData.tab
        });

      });

      if (attrs.refreshOn) {
        scope.$watch('refreshOn', function (newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            scrollingTabsControl.handleTriggeredRefresh();
          }
        });
      }

      if (!attrs.watchTabs) {

        // we're not watching the tabs array for changes so just init
        // the tabs without adding a watch
        scrollingTabsControl.initTabs({
          isWrapperDirective: false,
          scrollToTabEdge: scrollToTabEdge,
          scrollingTabsActiveOffset: attrs.scrollingTabsActiveOffset
        });

        return;
      }

      // we're watching the tabs array for changes...
      scope.$watch('watchTabs', function (latestTabsArray, prevTabsArray) {
        var $activeTabLi,
            activeIndex;

        scope.tabsArr = scope.$eval(scope.tabs);

        if (latestTabsArray.length && latestTabsArray[latestTabsArray.length - 1].active) { // new tab should be active

          // the tab we just added should be active, so, after giving the
          // elements time to render (thus the $timeout), force a click on it so
          // bootstrap's built-in tab/pane activation can do its thing, otherwise
          // the tab will show as active but its content pane won't be
          $timeout(function () {

            element.find('ul.nav-tabs > li:last').removeClass('active').find('a[role="tab"]').click();

          }, 0);

        } else { // --------- preserve the currently active tab

          // we've replaced the nav-tabs so, to get the currently active tab
          // we need to get it from the DOM because clicking a tab doesn't update
          // the tabs array (Bootstrap's js just makes the clicked tab and its
          // corresponding tab-content pane active); then we need to update
          // the tabs array so it reflects the currently active tab before we
          // call initTabs() because initTabs() generates the tab elements based
          // on the array data.

          // get the index of the currently active tab
          $activeTabLi = element.find('.nav-tabs > li.active');

          if ($activeTabLi.length) {

            activeIndex = $activeTabLi.data('index');

            scope.tabsArr.some(function __forEachTabsArrItem(t) {
              if (t[scope.propActive]) {
                t[scope.propActive] = false;
                return true; // exit loop
              }
            });

            scope.tabsArr[activeIndex][scope.propActive] = true;
          }
        }

        scrollingTabsControl.initTabs({
          isWrapperDirective: false,
          isWatchingTabs: true,
          scrollToTabEdge: scrollToTabEdge
        });

      }, true);

    }

  };
}
