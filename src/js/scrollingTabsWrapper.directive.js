scrollingTabsModule.directive('scrollingTabsWrapper', scrollingTabsWrapperDirective);

scrollingTabsWrapperDirective.$inject = ['$timeout'];
function scrollingTabsWrapperDirective($timeout) {
    // ------------ Directive Object ---------------------------
    return {
      restrict: 'A',
      template: scrollingTabsWrapperTemplate,
      transclude: true,
      replace: true,
      link: function(scope, element, attrs) {
        var scrollingTabsControl = new ScrollingTabsControl(element, $timeout, { scrollingTabsActiveOffset: attrs.scrollingTabsActiveOffset }),
            isWrappingAngularUIBTabset = element.find('uib-tabset').length > 0,
            isWrappingAngularUITabset = isWrappingAngularUIBTabset || element.find('tabset, .scrtabs-tabs-movable-container div > ul.nav').length > 0,
            scrollToTabEdge = attrs.scrollToTabEdge && attrs.scrollToTabEdge.toLowerCase() === 'true',
            scrtc = {
              hasTabContentOutsideMovableContainer: true
            };

        angular.extend(scope, { scrtc: scrtc });

        if (attrs.refreshOn) {
          scope.$watch(attrs.refreshOn, function (newVal, oldVal) {
            if (newVal && newVal !== oldVal) {
              scrollingTabsControl.handleTriggeredRefresh();
            }
          });
        }

        if (!isWrappingAngularUITabset) {
          scrollingTabsControl.removeTranscludedTabContentOutsideMovableContainer();
          scrtc.hasTabContentOutsideMovableContainer = false;
        }

        if (!isWrappingAngularUIBTabset && !attrs.watchTabs) {
          // we don't need to watch the tabs for changes, so just
          // init the tabs control and return
          scrollingTabsControl.initTabs({
            isWrapperDirective: true,
            isWrappingAngularUITabset: isWrappingAngularUITabset,
            scrollToTabEdge: scrollToTabEdge
          });

          return;
        }


        // ----- watch the tabs DOM for changes --------------
        // if we're watching angular uib-tabset after version 1.2.0, we
        // need to explicitly watch the tabs for DOM changes because
        // from 1.2.0, they added controllerAs and bindToController,
        // which messed up the direct connection between the tabs
        // model data and the transcluded DOM that allowed the tab-content
        // outside the movable container to update itself when the
        // active tab inside the movable container changed.
        // So if we're watching uib-tabset AND there is not a watch-tabs
        // attribute pointing to the tabs array, we set up this watch,
        // just watching for the active tab to change.
        // We also set up this watch if there's a watch-tabs="true"
        // attribute.
        if (isWrappingAngularUIBTabset ||
            (attrs.watchTabs && attrs.watchTabs.toLowerCase() === 'true')) {

          if (isWrappingAngularUITabset) {
            scrollingTabsControl.removeTranscludedTabContentOutsideMovableContainer();
            scrtc.hasTabContentOutsideMovableContainer = false;
          }

          // we're watching the tabs html (rather than array) for changes,
          // so init them then set up a watch that watches for changes
          // to the number of tabs or to the active tab
          initTabsAsWrapperWatchingTabs();

          // give the DOM changes time to process, then set up our watch
          $timeout(watchForTabDomChanges, 10);

          // we can return out of here UNLESS we're wrapping uib-tabset AND
          // also watching the tabs array for changes, in which case we need
          // to continue on and set up the watch on the tabs array.
          if (!isWrappingAngularUIBTabset || !attrs.watchTabs || attrs.watchTabs.toLowerCase() === 'true') {
            return;
          }
        }


        // ----- watch the tabs array for changes --------------
        // watch the tabs array for changes and refresh the tabs
        // control any time it changes (whether the change is a
        // new tab or just a change in which tab is selected)
        scope.$watch(attrs.watchTabs, function (latestTabsArray, prevTabsArray) {

          if (!isWrappingAngularUITabset) { // wrapping regular bootstrap nav-tabs
            // if we're wrapping regular bootstrap nav-tabs, we need to
            // manually track the active tab because, if a tab is clicked,
            // the tabs array doesn't update to reflect the new active tab;
            // so if we make each dynamically added tab the new active tab,
            // we need to deactivate whatever the currently active tab is,
            // and we have no way of knowing that from the state of the tabs
            // array--we need to check the tab elements on the page
            // listen for tab clicks and update our tabs array accordingly because
            // bootstrap doesn't do that
            if (latestTabsArray.length && latestTabsArray[latestTabsArray.length - 1].active) {

              // the tab we just added should be active, so, after giving the
              // elements time to render (thus the $timeout), force a click on it so
              // bootstrap's built-in tab/pane activation can do its thing, otherwise
              // the tab will show as active but its content pane won't be
              $timeout(function () {

                element.find('ul.nav-tabs > li:last').removeClass('active').find('a[role="tab"]').click();

              }, 0);

            }

          } else if (isWrappingAngularUIBTabset) {

            if (latestTabsArray.length && latestTabsArray[latestTabsArray.length - 1].active) {
              $timeout(function () {
                element.find('.scrtabs-tabs-movable-container ul.nav-tabs > li:last').find('a[role="tab"],a.nav-link').click();
              }, 0);
            }

          }

          initTabsAsWrapperWatchingTabs();

        }, true);


        function initTabsAsWrapperWatchingTabs(options) {
          scrollingTabsControl.initTabs({
            isWrapperDirective: true,
            isWrappingAngularUITabset: isWrappingAngularUITabset,
            isWatchingTabs: true,
            scrollToTabEdge: scrollToTabEdge,
            isWatchingDom: options && options.isWatchingDom
          });
        }

        function watchForTabDomChanges() {
            var $navTabs = element.find('ul.nav-tabs'),
                currActiveTabIdx,
                showingActiveTabIdx;

            if (!$navTabs.length) {
              return;
            }

            // ---- watch for tabs being added or removed ----
            scope.$watch(function () {
              return $navTabs[0].childNodes.length;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                  initTabsAsWrapperWatchingTabs({
                    isWatchingDom: true
                  });
                }
            });

            // ---- watch for a change in the active tab ----
            // we can't just use the built-in watch functionality
            // to check for a change in the active tab because the
            // function we pass to $watch sometimes executes before the
            // active class changes to the newly-clicked tab, so our watch
            // doesn't detect any change; to detect the change, we need
            // to perform the check after a timeout, so we just hook
            // into the $watch because we need to perform the check
            // when a digest occurs, but we don't use the $watch's
            // callback to make any changes, we just do it in our
            // timeout function.
            scope.$watch(function () {
              // pass false as 3rd arg so digest is not initiated,
              // otherwise we end up in infinite loop
              $timeout(checkForActiveTabChange, 0, false);
              return $navTabs.find('li.active').index();
            }, angular.noop);


            function checkForActiveTabChange() {
              currActiveTabIdx = $navTabs.find('li.active').index();

              if (currActiveTabIdx !== showingActiveTabIdx) {
                showingActiveTabIdx = currActiveTabIdx;
                initTabsAsWrapperWatchingTabs({
                  isWatchingDom: true
                });
              }

              return false;
            }
        }

      }
    };

}
