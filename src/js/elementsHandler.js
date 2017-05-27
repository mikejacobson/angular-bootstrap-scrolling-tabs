/* ***********************************************************************************
 * ElementsHandler - Class that each instance of ScrollingTabsControl will instantiate
 * **********************************************************************************/
function ElementsHandler(scrollingTabsControl) {
  var ehd = this;

  ehd.stc = scrollingTabsControl;
}

// ElementsHandler prototype methods
(function (p) {
    p.initElements = function (options) {
      var ehd = this,
          stc = ehd.stc,
          $tabsContainer = stc.$tabsContainer;

      ehd.setElementReferences();

      if (options.isWrappingAngularUITabset) {
        ehd.moveTabContentOutsideScrollContainer(options);
      }

      ehd.setEventListeners();
    };

    p.moveTabContentOutsideScrollContainer = function (options) {
      var ehd = this,
          stc = ehd.stc,
          $tabsContainer = stc.$tabsContainer,
          tabContentCloneCssClass = 'scrtabs-tab-content-clone',
          $tabContentInMovableContainer = $tabsContainer.find('.scrtabs-tabs-movable-container .tab-content'),
          $currTcClone,
          $newTcClone;

      // if the tabs won't be changing, we can just move the
      // the .tab-content outside the scrolling container right now
      if (!options.isWatchingTabs) {
        $tabContentInMovableContainer.show().appendTo($tabsContainer);
        return;
      }

      /* if we're watching the tabs for changes, we can't just
       * move the .tab-content outside the scrolling container because
       * that will break the angular-ui directive dependencies, and
       * an error will be thrown as soon as the tabs change;
       * so we leave the .tab-content where it is but hide it, then
       * make a clone and move the clone outside the scroll container,
       * which will be the visible .tab-content.
       */

      // create new clone
      $newTcClone = $tabContentInMovableContainer
                      .clone()
                      .addClass(tabContentCloneCssClass);

      // get the current clone, if it exists
      $currTcClone = $tabsContainer.find('.' + tabContentCloneCssClass);

      if ($currTcClone.length) { // already a clone there so replace it
        $currTcClone.replaceWith($newTcClone);
      } else {
        $tabsContainer.append($newTcClone);
      }

    };

    p.refreshAllElementSizes = function () {
      var ehd = this,
          stc = ehd.stc,
          smv = stc.scrollMovement,
          scrollArrowsWereVisible = stc.scrollArrowsVisible,
          actionsTaken = {
            didScrollToActiveTab: false
          },
          minPos;

      ehd.setElementWidths();
      ehd.setScrollArrowVisibility();

      if (stc.scrollArrowsVisible) {
        ehd.setFixedContainerWidthForJustVisibleScrollArrows();
      }

      // this could have been a window resize or the removal of a
      // dynamic tab, so make sure the movable container is positioned
      // correctly because, if it is far to the left and we increased the
      // window width, it's possible that the tabs will be too far left,
      // beyond the min pos.
      if (stc.scrollArrowsVisible || scrollArrowsWereVisible) {
        if (stc.scrollArrowsVisible) {
          // make sure container not too far left
          minPos = smv.getMinPos();
          if (stc.movableContainerLeftPos < minPos) {
            smv.incrementScrollRight(minPos);
          } else {
            smv.scrollToActiveTab({
              isOnWindowResize: true
            });

            actionsTaken.didScrollToActiveTab = true;
          }
        } else {
          // scroll arrows went away after resize, so position movable container at 0
          stc.movableContainerLeftPos = 0;
          smv.slideMovableContainerToLeftPos();
        }
      }

      return actionsTaken;
    };

    p.removeTranscludedTabContentOutsideMovableContainer = function () {
      var ehd = this,
          stc = ehd.stc,
          $tabsContainer = stc.$tabsContainer;

      $tabsContainer.find('.scrtabs-tab-content-outside-movable-container').remove();
    };

    p.setElementReferences = function () {
      var ehd = this,
          stc = ehd.stc,
          $tabsContainer = stc.$tabsContainer;

      stc.isNavPills = false;

      stc.$fixedContainer = $tabsContainer.find('.scrtabs-tabs-fixed-container');
      stc.$movableContainer = $tabsContainer.find('.scrtabs-tabs-movable-container');
      stc.$tabsUl = stc.$movableContainer.find('.nav-tabs');

      // check for pills
      if (!stc.$tabsUl.length) {
        stc.$tabsUl = stc.$movableContainer.find('.nav-pills');

        if (stc.$tabsUl.length) {
          stc.isNavPills = true;
        }
      }

      stc.$tabsLiCollection = stc.$tabsUl.find('> li');
      stc.$leftScrollArrow = $tabsContainer.find('.scrtabs-js-tab-scroll-arrow-left');
      stc.$rightScrollArrow = $tabsContainer.find('.scrtabs-js-tab-scroll-arrow-right');
      stc.$scrollArrows = stc.$leftScrollArrow.add(stc.$rightScrollArrow);

      stc.$win = $(window);
    };

    p.setElementWidths = function () {
      var ehd = this,
          stc = ehd.stc;

      if (!stc.$win) {
        return;
      }

      stc.containerWidth = stc.$tabsContainer.outerWidth();
      stc.winWidth = stc.$win.width();

      stc.scrollArrowsCombinedWidth = stc.$leftScrollArrow.outerWidth() + stc.$rightScrollArrow.outerWidth();

      ehd.setFixedContainerWidth();
      ehd.setMovableContainerWidth();
    };

    p.setEventListeners = function () {
      var ehd = this,
          stc = ehd.stc,
          evh = stc.eventHandlers; // eventHandlers

      stc.$leftScrollArrow.off('.scrtabs').on({
        'mousedown.scrtabs touchstart.scrtabs': function (e) { evh.handleMousedownOnLeftScrollArrow.call(evh, e); },
        'mouseup.scrtabs touchend.scrtabs': function (e) { evh.handleMouseupOnLeftScrollArrow.call(evh, e); },
        'click.scrtabs': function (e) { evh.handleClickOnLeftScrollArrow.call(evh, e); }
      });

      stc.$rightScrollArrow.off('.scrtabs').on({
        'mousedown.scrtabs touchstart.scrtabs': function (e) { evh.handleMousedownOnRightScrollArrow.call(evh, e); },
        'mouseup.scrtabs touchend.scrtabs': function (e) { evh.handleMouseupOnRightScrollArrow.call(evh, e); },
        'click.scrtabs': function (e) { evh.handleClickOnRightScrollArrow.call(evh, e); }
      });

      stc.$win.smartresize(function (e) { evh.handleWindowResize.call(evh, e); });
    };

    p.setFixedContainerWidth = function () {
      var ehd = this,
          stc = ehd.stc,
          tabsContainerRect = stc.$tabsContainer.get(0).getBoundingClientRect();

      stc.fixedContainerWidth = tabsContainerRect.width || (tabsContainerRect.right - tabsContainerRect.left);
      stc.$fixedContainer.width(stc.fixedContainerWidth);
    };

    p.setFixedContainerWidthForJustHiddenScrollArrows = function () {
      var ehd = this,
          stc = ehd.stc;

      stc.$fixedContainer.width(stc.fixedContainerWidth);
    };

    p.setFixedContainerWidthForJustVisibleScrollArrows = function () {
      var ehd = this,
          stc = ehd.stc;

      stc.$fixedContainer.width(stc.fixedContainerWidth - stc.scrollArrowsCombinedWidth);
    };

    p.setMovableContainerWidth = function () {
      var ehd = this,
          stc = ehd.stc,
          $tabLi = stc.$tabsUl.find('li'),
          fixedContainerHeight = stc.$fixedContainer.height(),
          maxWidthExpansions = 10; // prevent infinite loop

      stc.movableContainerWidth = 0;

      if ($tabLi.length) {

        $tabLi.each(function __getLiWidth() {
          var $li = $(this),
              totalMargin = 0;

          if (stc.isNavPills) { // pills have a margin-left, tabs have no margin
            totalMargin = parseInt($li.css('margin-left'), 10) + parseInt($li.css('margin-right'), 10);
          }

          stc.movableContainerWidth += ($li.outerWidth() + totalMargin);
        });

        stc.movableContainerWidth += 1;

        // if the tabs don't span the width of the page, force the
        // movable container width to full page width so the bottom
        // border spans the page width instead of just spanning the
        // width of the tabs
        if (stc.movableContainerWidth < stc.fixedContainerWidth) {
          stc.movableContainerWidth = stc.fixedContainerWidth;
        }
      }

      stc.$movableContainer.width(stc.movableContainerWidth);

      // when we have >35 pills, sometimes the movable container width ends
      // up being a pixel short, causing the last pill to wrap; so we do
      // this check for a wrapped pill--we check if the movable container
      // height has expanded beyond the fixed container height (indicating
      // a wrapped pill), and if it has, we increase the movable container
      // width 1 pixel at a time until there's no wrap. We also put a
      // limit on the number of checks/expansions to prevent an infinite
      // loop, in case we get into some weird situation where adding width
      // never fixes the wrap.
      while ((stc.$movableContainer.height() > fixedContainerHeight) && maxWidthExpansions--) {
        stc.$movableContainer.width(stc.movableContainerWidth += 1);
      }

    };

    p.setScrollArrowVisibility = function () {
      var ehd = this,
          stc = ehd.stc,
          shouldBeVisible = stc.movableContainerWidth > stc.fixedContainerWidth;

      if (shouldBeVisible && !stc.scrollArrowsVisible) {
        stc.$scrollArrows.show();
        stc.scrollArrowsVisible = true;
        ehd.setFixedContainerWidthForJustVisibleScrollArrows();
      } else if (!shouldBeVisible && stc.scrollArrowsVisible) {
        stc.$scrollArrows.hide();
        stc.scrollArrowsVisible = false;
        ehd.setFixedContainerWidthForJustHiddenScrollArrows();
      }
    };

}(ElementsHandler.prototype));
