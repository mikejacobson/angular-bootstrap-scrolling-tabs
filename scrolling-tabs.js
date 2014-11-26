;(function () {
  'use strict';

  var CONSTANTS = {
    CONTINUOUS_SCROLLING_TIMEOUT_INTERVAL: 50, // timeout interval for repeatedly moving the tabs container 
                                                // by one increment while the mouse is held down--decrease to 
                                                // make mousedown continous scrolling faster
    SCROLL_OFFSET_FRACTION: 6, // each click moves the container this fraction of the fixed container--decrease 
                               // to make the tabs scroll farther per click
    SCROLL_ARROW_WIDTH: 20, // total element width, including padding and border
    DATA_KEY_IS_MOUSEDOWN: 'ismousedown'
  },

  scrollingTabsModule = angular.module('mj.scrollingTabs', []),

  scrollingTabsTemplate = [
    '<div class="scrtabs-tab-container">',
    ' <div class="scrtabs-tab-scroll-arrow scrtabs-js-tab-scroll-arrow-left"><span class="glyphicon glyphicon-chevron-left"></span></div>',
    '   <div class="scrtabs-tabs-fixed-container">',
    '     <div class="scrtabs-tabs-movable-container">',
    '       <ul class="nav nav-tabs" role="tablist">',
    '         <li ng-class="{ \'active\': tabObj.isActive }" data-tab-obj="{{tabObj}}" data-index="{{$index}}" ng-repeat="tabObj in tabsArr">',
    '           <a ng-href="{{\'#\' + tabObj.id}}" role="tab" data-toggle="tab">{{tabObj.title}}</a>',
    '         </li>',
    '       </ul>',
    '     </div>',
    ' </div>',
    ' <div class="scrtabs-tab-scroll-arrow scrtabs-js-tab-scroll-arrow-right"><span class="glyphicon glyphicon-chevron-right"></span></div>',
    '</div>'
  ].join('');



  // smartresize from Paul Irish (debounced window resize)
  (function ($, sr) {
    var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced() {
        var obj = this, args = arguments;
        function delayed() {
          if (!execAsap)
            func.apply(obj, args);
          timeout = null;
        };

        if (timeout)
          clearTimeout(timeout);
        else if (execAsap)
          func.apply(obj, args);

        timeout = setTimeout(delayed, threshold || 100);
      };
    }
    jQuery.fn[sr] = function (fn) { return fn ? this.bind('resize.scrtabs', debounce(fn)) : this.trigger(sr); };

  })(jQuery, 'smartresize');



  function scrollingTabsDirective($timeout) {
    var $fixedContainer,
        $leftScrollArrow,
        $movableContainer,
        $rightScrollArrow,
        $scrollArrows,
        $tabsContainer,
        $tabsUl,
        $win,
        containerWidth,
        continuousScrollingTimeoutInterval = CONSTANTS.CONTINUOUS_SCROLLING_TIMEOUT_INTERVAL,
        elementHandler,
        eventHandlers,
        fixedContainerWidth,
        movableContainerLeftPos = 0,
        movableContainerWidth,
        scrollArrowsCombinedWidth = CONSTANTS.SCROLL_ARROW_WIDTH * 2,
        scrollArrowsVisible = true,
        scrollArrowWidth = CONSTANTS.SCROLL_ARROW_WIDTH,
        scrollMovement,
        scrollOffsetFraction = CONSTANTS.SCROLL_OFFSET_FRACTION,
        winWidth;


    // --------------- Scroll Movement ---------------------
    scrollMovement = (function() {

      function _continueScrollLeft() {
        $timeout(function() {
          if ($leftScrollArrow.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN) && (movableContainerLeftPos < 0)) {
            if (!incrementScrollLeft()) { // scroll limit not reached, so keep scrolling
              _continueScrollLeft();
            }
          }
        }, continuousScrollingTimeoutInterval);
      }

      function _continueScrollRight(minPos) {
        $timeout(function() {
          if ($rightScrollArrow.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN) && (movableContainerLeftPos > minPos)) {
            // slide tabs LEFT -> decrease movable container's left position
            // min value is (movableContainerWidth - $tabHeader width)
            if (!incrementScrollRight(minPos)) {
              _continueScrollRight(minPos);
            }
          }
        }, continuousScrollingTimeoutInterval);
      }

      function _decrementMovableContainerLeftPos(minPos) {
        movableContainerLeftPos -= (fixedContainerWidth / scrollOffsetFraction);
        if (movableContainerLeftPos < minPos) {
          movableContainerLeftPos = minPos;
        }
      }

      function getMinPos() {
        return scrollArrowsVisible ? (fixedContainerWidth - movableContainerWidth - scrollArrowsCombinedWidth) : 0;
      }

      function _getMovableContainerCssLeftVal() {
        return (movableContainerLeftPos === 0) ? '0' : movableContainerLeftPos + 'px';
      }

      function incrementScrollLeft() {
        movableContainerLeftPos += (fixedContainerWidth / scrollOffsetFraction);
        if (movableContainerLeftPos > 0) {
          movableContainerLeftPos = 0;
        }

        slideMovableContainerToLeftPos();

        return (movableContainerLeftPos === 0); // indicates scroll limit reached
      }

      function incrementScrollRight(minPos) {
        _decrementMovableContainerLeftPos(minPos);
        slideMovableContainerToLeftPos();

        return (movableContainerLeftPos === minPos);
      }

      function scrollToActiveTab(isOnWindowResize) {
        var $activeTab,
            activeTabWidth,
            activeTabLeftPos,
            rightArrowLeftPos,
            overlap;

        // if the active tab is not fully visible, scroll till it is
        if (!scrollArrowsVisible) {
          return;
        }

        $activeTab = $tabsUl.find('li.active');

        if (!$activeTab.length) {
          return;
        }

        activeTabWidth = $activeTab.width();
        activeTabLeftPos = $activeTab.offset().left;

        rightArrowLeftPos = $rightScrollArrow.offset().left;
        overlap = activeTabLeftPos + activeTabWidth - rightArrowLeftPos;

        if (overlap > 0) {
          movableContainerLeftPos = isOnWindowResize ? (movableContainerLeftPos - overlap) : -overlap;
          slideMovableContainerToLeftPos();
        }
      }

      function slideMovableContainerToLeftPos() {
        var leftVal;

        movableContainerLeftPos = movableContainerLeftPos / 1;
        leftVal = _getMovableContainerCssLeftVal();

        $movableContainer.stop().animate({ left: leftVal }, 'slow', function __slideAnimComplete() {
          var newMinPos = getMinPos();

          // if we slid past the min pos--which can happen if you resize the window 
          // quickly--move back into position
          if (movableContainerLeftPos < newMinPos) {
            _decrementMovableContainerLeftPos(newMinPos);
            $movableContainer.stop().animate({ left: _getMovableContainerCssLeftVal() }, 'fast');
          }
        });

      }

      function startScrollLeft() {
        $leftScrollArrow.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN, true);
        _continueScrollLeft();
      }

      function startScrollRight() {
        $rightScrollArrow.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN, true);
        _continueScrollRight(getMinPos());
      }

      function stopScrollLeft() {
        $leftScrollArrow.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN, false);
      }

      function stopScrollRight() {
        $rightScrollArrow.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN, false);
      }


      return {
        getMinPos: getMinPos,
        incrementScrollLeft: incrementScrollLeft,
        incrementScrollRight: incrementScrollRight,
        scrollToActiveTab: scrollToActiveTab,
        slideMovableContainerToLeftPos: slideMovableContainerToLeftPos,
        startScrollLeft: startScrollLeft,
        startScrollRight: startScrollRight,
        stopScrollLeft: stopScrollLeft,
        stopScrollRight: stopScrollRight
    };

    }());




    // --------------- Event Handlers ---------------------
    eventHandlers = (function () {
      function handleClickOnLeftScrollArrow(e) {
        scrollMovement.incrementScrollLeft();
      }

      function handleClickOnRightScrollArrow(e) {
        scrollMovement.incrementScrollRight(scrollMovement.getMinPos());
      }

      function handleMousedownOnLeftScrollArrow(e) {
        scrollMovement.startScrollLeft();
      }

      function handleMousedownOnRightScrollArrow(e) {
        scrollMovement.startScrollRight();
      }

      function handleMouseupOnLeftScrollArrow(e) {
        scrollMovement.stopScrollLeft();
      }

      function handleMouseupOnRightScrollArrow(e) {
        scrollMovement.stopScrollRight();
      }

      function handleWindowResize(e) {
        var newWinWidth = $win.width();

        if (newWinWidth === winWidth) {
          return false; // false alarm
        }

        winWidth = newWinWidth;
        elementHandler.refreshAllElementSizes(true); // true -> check for scroll arrows not being necessary anymore
      }


      return {
        handleClickOnLeftScrollArrow: handleClickOnLeftScrollArrow,
        handleClickOnRightScrollArrow: handleClickOnRightScrollArrow,
        handleMousedownOnLeftScrollArrow: handleMousedownOnLeftScrollArrow,
        handleMousedownOnRightScrollArrow: handleMousedownOnRightScrollArrow,
        handleMouseupOnLeftScrollArrow: handleMouseupOnLeftScrollArrow,
        handleMouseupOnRightScrollArrow: handleMouseupOnRightScrollArrow,
        handleWindowResize: handleWindowResize
      };

    }());



    // --------------- Element Handler ---------------------
    elementHandler = (function () {
      function initElements() {
        _setElementReferences();
        _setEventListeners();
      }

      function refreshAllElementSizes(isPossibleArrowVisibilityChange) {
        var scrollArrowsWereVisible = scrollArrowsVisible,
            minPos;

        _setElementWidths();
        _setScrollArrowVisibility();

        if (scrollArrowsVisible) {
          _setFixedContainerWidthForJustVisibleScrollArrows();
        }

        // if this was a window resize, make sure the movable container is positioned
        // correctly because, if it is far to the left and we increased the window width, it's
        // possible that the tabs will be too far left, beyond the min pos.
        if (isPossibleArrowVisibilityChange && (scrollArrowsVisible || scrollArrowsWereVisible)) {
          if (scrollArrowsVisible) {
            // make sure container not too far left
            minPos = scrollMovement.getMinPos();
            if (movableContainerLeftPos < minPos) {
              scrollMovement.incrementScrollRight(minPos);
            } else {
              scrollMovement.scrollToActiveTab(true); // true -> isOnWindowResize
            }
          } else {
            // scroll arrows went away after resize, so position movable container at 0
            movableContainerLeftPos = 0;
            scrollMovement.slideMovableContainerToLeftPos();
          }
        }
      }

      function _setElementReferences() {
        $fixedContainer = $tabsContainer.find('.scrtabs-tabs-fixed-container');
        $movableContainer = $tabsContainer.find('.scrtabs-tabs-movable-container');
        $tabsUl = $tabsContainer.find('.nav-tabs');
        $leftScrollArrow = $tabsContainer.find('.scrtabs-js-tab-scroll-arrow-left');
        $rightScrollArrow = $tabsContainer.find('.scrtabs-js-tab-scroll-arrow-right');
        $scrollArrows = $leftScrollArrow.add($rightScrollArrow);

        $win = $(window);
      }

      function _setElementWidths() {
        containerWidth = $tabsContainer.width();
        winWidth = $win.width();

        _setFixedContainerWidth();
        _setMovableContainerWidth();
      }

      function _setEventListeners() {
        $leftScrollArrow.on({
          'mousedown.scrtabs': eventHandlers.handleMousedownOnLeftScrollArrow,
          'mouseup.scrtabs': eventHandlers.handleMouseupOnLeftScrollArrow,
          'click.scrtabs': eventHandlers.handleClickOnLeftScrollArrow
        });

        $rightScrollArrow.on({
          'mousedown.scrtabs': eventHandlers.handleMousedownOnRightScrollArrow,
          'mouseup.scrtabs': eventHandlers.handleMouseupOnRightScrollArrow,
          'click.scrtabs': eventHandlers.handleClickOnRightScrollArrow
        });

        $win.smartresize(eventHandlers.handleWindowResize);
      }

      function _setFixedContainerWidth() {
        $fixedContainer.width(fixedContainerWidth = $tabsContainer.width());
      }

      function _setFixedContainerWidthForJustHiddenScrollArrows() {
        $fixedContainer.width(fixedContainerWidth);
      }

      function _setFixedContainerWidthForJustVisibleScrollArrows() {
        $fixedContainer.width(fixedContainerWidth - scrollArrowsCombinedWidth);
      }

      function _setMovableContainerWidth() {
        movableContainerWidth = 0;

        $tabsUl.find('li').each(function __getLiWidth() {
          movableContainerWidth += $(this).width();
        });

        $movableContainer.width(movableContainerWidth);
      }

      function _setScrollArrowVisibility() {
        var shouldBeVisible = movableContainerWidth > fixedContainerWidth;

        if (shouldBeVisible && !scrollArrowsVisible) {
          $scrollArrows.show();
          scrollArrowsVisible = true;
          _setFixedContainerWidthForJustVisibleScrollArrows();
        } else if (!shouldBeVisible && scrollArrowsVisible) {
          $scrollArrows.hide();
          scrollArrowsVisible = false;
          _setFixedContainerWidthForJustHiddenScrollArrows();
        }
      }



      return {
        initElements: initElements,
        refreshAllElementSizes: refreshAllElementSizes
      };

    }());




    // --------------- Init ---------------------
    function initTabs($el) {
      $tabsContainer = $el;

      $timeout(function __initTabsAfterTimeout() {
        elementHandler.initElements();
        elementHandler.refreshAllElementSizes();
        scrollMovement.scrollToActiveTab();
      }, 100);
    }




    // ------------ Directive Object ---------------------------
    return {
      restrict: 'E',
      template: scrollingTabsTemplate,
      transclude: false,
      replace: true,
      scope: {
        tabs: '@',
        localTabClick: '&tabClick'
      },
      link: function(scope, $el, attrs) {

        scope.tabsArr = scope.$eval(scope.tabs);

        $el.on('click.scrollingTabs', '.nav-tabs > li', function __handleClickOnTab(e) {
          var clickedTabElData = $(this).data();

          scope.localTabClick({
            $event: e,
            $index: clickedTabElData.index,
            tab: clickedTabElData.tabObj
          });
        });

        initTabs($el);
      }

    };
  }



  scrollingTabsDirective.$inject = ['$timeout'];

  scrollingTabsModule.directive('scrollingTabs', scrollingTabsDirective);

}());
