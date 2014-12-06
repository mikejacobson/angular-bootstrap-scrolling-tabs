;(function () {
  'use strict';

  var CONSTANTS = {
    CONTINUOUS_SCROLLING_TIMEOUT_INTERVAL: 50, // timeout interval for repeatedly moving the tabs container 
                                                // by one increment while the mouse is held down--decrease to 
                                                // make mousedown continous scrolling faster
    SCROLL_OFFSET_FRACTION: 6, // each click moves the container this fraction of the fixed container--decrease 
                               // to make the tabs scroll farther per click
    DATA_KEY_IS_MOUSEDOWN: 'ismousedown'
  },

  scrollingTabsModule = angular.module('mj.scrollingTabs', []),

  /* *************************************************************
   * scrolling-tabs element directive template
   * *************************************************************/
  // plunk: http://plnkr.co/edit/YhKiIhuAPkpAyacu6tuk
  scrollingTabsTemplate = [
    '<div class="scrtabs-tab-container">',
    ' <div class="scrtabs-tab-scroll-arrow scrtabs-js-tab-scroll-arrow-left"><span class="glyphicon glyphicon-chevron-left"></span></div>',
    '   <div class="scrtabs-tabs-fixed-container">',
    '     <div class="scrtabs-tabs-movable-container">',
    '       <ul class="nav nav-tabs" role="tablist">',
    '         <li ng-class="{ \'active\': tab[propActive || \'active\'], ',
    '                         \'disabled\': tab[propDisabled || \'disabled\'] }" ',
    '             data-tab="{{tab}}" data-index="{{$index}}" ng-repeat="tab in tabsArr">',
    '           <a ng-href="{{\'#\' + tab[propPaneId || \'paneId\']}}" role="tab"',
    '                data-toggle="{{tab[propDisabled || \'disabled\'] ? \'\' : \'tab\'}}" ',
    '                ng-bind-html="sanitize(tab[propTitle || \'title\']);">',
    '           </a>',
    '         </li>',
    '       </ul>',
    '     </div>',
    ' </div>',
    ' <div class="scrtabs-tab-scroll-arrow scrtabs-js-tab-scroll-arrow-right"><span class="glyphicon glyphicon-chevron-right"></span></div>',
    '</div>'
  ].join(''),
  

  /* *************************************************************
   * scrolling-tabs-wrapper element directive template
   * *************************************************************/
  // plunk: http://plnkr.co/edit/lWeQxxecKPudK7xlQxS3
  scrollingTabsWrapperTemplate = [
    '<div class="scrtabs-tab-container">',
    ' <div class="scrtabs-tab-scroll-arrow scrtabs-js-tab-scroll-arrow-left"><span class="glyphicon glyphicon-chevron-left"></span></div>',
    '   <div class="scrtabs-tabs-fixed-container">',
    '     <div class="scrtabs-tabs-movable-container" ng-transclude></div>',
    '   </div>',
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
    };
    jQuery.fn[sr] = function (fn) { return fn ? this.bind('resize.scrtabs', debounce(fn)) : this.trigger(sr); };

  })(jQuery, 'smartresize');



  /* ***********************************************************************************
   * EventHandlers - Class that each instance of ScrollingTabsControl will instantiate
   * **********************************************************************************/
  function EventHandlers(scrollingTabsControl) {
    var evh = this;
    
    evh.stc = scrollingTabsControl;
  }
  
  // prototype methods
  (function (p){
    p.handleClickOnLeftScrollArrow = function (e) {
      var evh = this,
          stc = evh.stc;

      stc.scrollMovement.incrementScrollLeft();
    };

    p.handleClickOnRightScrollArrow = function (e) {
      var evh = this,
          stc = evh.stc,
          scrollMovement = stc.scrollMovement;

      scrollMovement.incrementScrollRight(scrollMovement.getMinPos());
    };

    p.handleMousedownOnLeftScrollArrow = function (e) {
      var evh = this,
          stc = evh.stc;

      stc.scrollMovement.startScrollLeft();
    };

    p.handleMousedownOnRightScrollArrow = function (e) {
      var evh = this,
          stc = evh.stc;

      stc.scrollMovement.startScrollRight();
    };

    p.handleMouseupOnLeftScrollArrow = function (e) {
      var evh = this,
          stc = evh.stc;

      stc.scrollMovement.stopScrollLeft();
    };

    p.handleMouseupOnRightScrollArrow = function (e) {
      var evh = this,
          stc = evh.stc;

      stc.scrollMovement.stopScrollRight();
    };

    p.handleWindowResize = function (e) {
      var evh = this,
          stc = evh.stc,
          newWinWidth = stc.$win.width();

      if (newWinWidth === stc.winWidth) {
        return false; // false alarm
      }

      stc.winWidth = newWinWidth;
      stc.elementsHandler.refreshAllElementSizes(true); // true -> check for scroll arrows not being necessary anymore
    };
    
  }(EventHandlers.prototype));



  /* ***********************************************************************************
   * ElementsHandler - Class that each instance of ScrollingTabsControl will instantiate
   * **********************************************************************************/
  function ElementsHandler(scrollingTabsControl) {
    var ehd = this;
    
    ehd.stc = scrollingTabsControl;
  }
  
  // prototype methods
  (function (p) {
      p.initElements = function (isWrapperDirective) {
        var ehd = this;
        
        ehd.setElementReferences();
        
        if (isWrapperDirective) {
          ehd.moveTabContentOutsideScrollContainer();
        }
        
        ehd.setEventListeners();
      };

      p.moveTabContentOutsideScrollContainer = function () {
        var ehd = this,
            stc = ehd.stc,
            $tabsContainer = stc.$tabsContainer;
        
        $tabsContainer.find('.tab-content').appendTo($tabsContainer);
      };

      p.refreshAllElementSizes = function (isPossibleArrowVisibilityChange) {
        var ehd = this,
            stc = ehd.stc,
            smv = stc.scrollMovement,
            scrollArrowsWereVisible = stc.scrollArrowsVisible,
            minPos;

        ehd.setElementWidths();
        ehd.setScrollArrowVisibility();

        if (stc.scrollArrowsVisible) {
          ehd.setFixedContainerWidthForJustVisibleScrollArrows();
        }

        // if this was a window resize, make sure the movable container is positioned
        // correctly because, if it is far to the left and we increased the window width, it's
        // possible that the tabs will be too far left, beyond the min pos.
        if (isPossibleArrowVisibilityChange && (stc.scrollArrowsVisible || scrollArrowsWereVisible)) {
          if (stc.scrollArrowsVisible) {
            // make sure container not too far left
            minPos = smv.getMinPos();
            if (stc.movableContainerLeftPos < minPos) {
              smv.incrementScrollRight(minPos);
            } else {
              smv.scrollToActiveTab(true); // true -> isOnWindowResize
            }
          } else {
            // scroll arrows went away after resize, so position movable container at 0
            stc.movableContainerLeftPos = 0;
            smv.slideMovableContainerToLeftPos();
          }
        }
      };

      p.setElementReferences = function () {
        var ehd = this,
            stc = ehd.stc,
            $tabsContainer = stc.$tabsContainer;

        stc.$fixedContainer = $tabsContainer.find('.scrtabs-tabs-fixed-container');
        stc.$movableContainer = $tabsContainer.find('.scrtabs-tabs-movable-container');
        stc.$tabsUl = $tabsContainer.find('.nav-tabs');
        stc.$leftScrollArrow = $tabsContainer.find('.scrtabs-js-tab-scroll-arrow-left');
        stc.$rightScrollArrow = $tabsContainer.find('.scrtabs-js-tab-scroll-arrow-right');
        stc.$scrollArrows = stc.$leftScrollArrow.add(stc.$rightScrollArrow);

        stc.$win = $(window);
      };

      p.setElementWidths = function () {
        var ehd = this,
            stc = ehd.stc;

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

        stc.$leftScrollArrow.on({
          'mousedown.scrtabs': function (e) { evh.handleMousedownOnLeftScrollArrow.call(evh, e); },
          'mouseup.scrtabs': function (e) { evh.handleMouseupOnLeftScrollArrow.call(evh, e); },
          'click.scrtabs': function (e) { evh.handleClickOnLeftScrollArrow.call(evh, e); }
        });

        stc.$rightScrollArrow.on({
          'mousedown.scrtabs': function (e) { evh.handleMousedownOnRightScrollArrow.call(evh, e); },
          'mouseup.scrtabs': function (e) { evh.handleMouseupOnRightScrollArrow.call(evh, e); },
          'click.scrtabs': function (e) { evh.handleClickOnRightScrollArrow.call(evh, e); }
        });

        stc.$win.smartresize(function (e) { evh.handleWindowResize.call(evh, e); });
        
      };

      p.setFixedContainerWidth = function () {
        var ehd = this,
            stc = ehd.stc;

        stc.$fixedContainer.width(stc.fixedContainerWidth = stc.$tabsContainer.outerWidth());
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
            stc = ehd.stc;

        stc.movableContainerWidth = 0;

        stc.$tabsUl.find('li').each(function __getLiWidth() {
          var $li = $(this);
          
          stc.movableContainerWidth += $li.outerWidth();
        });

        stc.$movableContainer.width(stc.movableContainerWidth += 1);
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
  

  
  /* ***********************************************************************************
   * ScrollMovement - Class that each instance of ScrollingTabsControl will instantiate
   * **********************************************************************************/
  function ScrollMovement(scrollingTabsControl) {
    var smv = this;
    
    smv.stc = scrollingTabsControl;
  }
  
  // prototype methods
  (function (p) {
    
    p.continueScrollLeft = function () {
      var smv = this,
          stc = smv.stc;
      
      stc.$timeout(function() {
        if (stc.$leftScrollArrow.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN) && (stc.movableContainerLeftPos < 0)) {
          if (!smv.incrementScrollLeft()) { // scroll limit not reached, so keep scrolling
            smv.continueScrollLeft();
          }
        }
      }, CONSTANTS.CONTINUOUS_SCROLLING_TIMEOUT_INTERVAL);
    };

    p.continueScrollRight = function (minPos) {
      var smv = this,
          stc = smv.stc;

      stc.$timeout(function() {
        if (stc.$rightScrollArrow.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN) && (stc.movableContainerLeftPos > minPos)) {
          // slide tabs LEFT -> decrease movable container's left position
          // min value is (movableContainerWidth - $tabHeader width)
          if (!smv.incrementScrollRight(minPos)) {
            smv.continueScrollRight(minPos);
          }
        }
      }, CONSTANTS.CONTINUOUS_SCROLLING_TIMEOUT_INTERVAL);
    };

    p.decrementMovableContainerLeftPos = function (minPos) {
      var smv = this,
          stc = smv.stc;

      stc.movableContainerLeftPos -= (stc.fixedContainerWidth / CONSTANTS.SCROLL_OFFSET_FRACTION);
      if (stc.movableContainerLeftPos < minPos) {
        stc.movableContainerLeftPos = minPos;
      }
    };

    p.getMinPos = function () {
      var smv = this,
          stc = smv.stc;

      return stc.scrollArrowsVisible ? (stc.fixedContainerWidth - stc.movableContainerWidth - stc.scrollArrowsCombinedWidth) : 0;
    };

    p.getMovableContainerCssLeftVal = function () {
      var smv = this,
          stc = smv.stc;

      return (stc.movableContainerLeftPos === 0) ? '0' : stc.movableContainerLeftPos + 'px';
    };

    p.incrementScrollLeft = function () {
      var smv = this,
          stc = smv.stc;

      stc.movableContainerLeftPos += (stc.fixedContainerWidth / CONSTANTS.SCROLL_OFFSET_FRACTION);
      if (stc.movableContainerLeftPos > 0) {
        stc.movableContainerLeftPos = 0;
      }

      smv.slideMovableContainerToLeftPos();

      return (stc.movableContainerLeftPos === 0); // indicates scroll limit reached
    };

    p.incrementScrollRight = function (minPos) {
      var smv = this,
          stc = smv.stc;

      smv.decrementMovableContainerLeftPos(minPos);
      smv.slideMovableContainerToLeftPos();

      return (stc.movableContainerLeftPos === minPos);
    };

    p.scrollToActiveTab = function (isOnWindowResize) {
      var smv = this,
          stc = smv.stc,
          $activeTab,
          activeTabWidth,
          activeTabLeftPos,
          rightArrowLeftPos,
          overlap;

      // if the active tab is not fully visible, scroll till it is
      if (!stc.scrollArrowsVisible) {
        return;
      }

      $activeTab = stc.$tabsUl.find('li.active');

      if (!$activeTab.length) {
        return;
      }

      activeTabWidth = $activeTab.outerWidth();
      activeTabLeftPos = $activeTab.offset().left;

      rightArrowLeftPos = stc.$rightScrollArrow.offset().left;
      overlap = activeTabLeftPos + activeTabWidth - rightArrowLeftPos;

      if (overlap > 0) {
        stc.movableContainerLeftPos = isOnWindowResize ? (stc.movableContainerLeftPos - overlap) : -overlap;
        smv.slideMovableContainerToLeftPos();
      }
    };

    p.slideMovableContainerToLeftPos = function () {
      var smv = this,
          stc = smv.stc,
          leftVal;

      stc.movableContainerLeftPos = stc.movableContainerLeftPos / 1;
      leftVal = smv.getMovableContainerCssLeftVal();

      stc.$movableContainer.stop().animate({ left: leftVal }, 'slow', function __slideAnimComplete() {
        var newMinPos = smv.getMinPos();

        // if we slid past the min pos--which can happen if you resize the window 
        // quickly--move back into position
        if (stc.movableContainerLeftPos < newMinPos) {
          smv.decrementMovableContainerLeftPos(newMinPos);
          stc.$movableContainer.stop().animate({ left: smv.getMovableContainerCssLeftVal() }, 'fast');
        }
      });
    };

    p.startScrollLeft = function () {
      var smv = this,
          stc = smv.stc;

      stc.$leftScrollArrow.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN, true);
      smv.continueScrollLeft();
    };

    p.startScrollRight = function () {
      var smv = this,
          stc = smv.stc;

      stc.$rightScrollArrow.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN, true);
      smv.continueScrollRight(smv.getMinPos());
    };

    p.stopScrollLeft = function () {
      var smv = this,
          stc = smv.stc;

      stc.$leftScrollArrow.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN, false);
    };

    p.stopScrollRight = function () {
      var smv = this,
          stc = smv.stc;

      stc.$rightScrollArrow.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN, false);
    };
    
  }(ScrollMovement.prototype));
  
  
  
  /* **********************************************************************
   * ScrollingTabsControl - Class that each directive will instantiate
   * **********************************************************************/
  function ScrollingTabsControl($tabsContainer, $timeout) {
    var stc = this;
    
    stc.$tabsContainer = $tabsContainer;
    stc.$timeout = $timeout,
    
    stc.movableContainerLeftPos = 0;
    stc.scrollArrowsVisible = true;
    
    stc.scrollMovement = new ScrollMovement(stc);
    stc.eventHandlers = new EventHandlers(stc);
    stc.elementsHandler = new ElementsHandler(stc);
  }
  
  // prototype methods
  (function (p) {
    p.initTabs = function (isWrapperDirective) {
      var stc = this,
          elementsHandler = stc.elementsHandler,
          scrollMovement = stc.scrollMovement;
      
      stc.$timeout(function __initTabsAfterTimeout() {
        elementsHandler.initElements(isWrapperDirective);
        elementsHandler.refreshAllElementSizes();
        scrollMovement.scrollToActiveTab();
      }, 100);
    };
   
    
  }(ScrollingTabsControl.prototype));
  
  

  /* ********************************************************
   * scrolling-tabs Directive
   * ********************************************************/

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
        propPaneId: '@',
        propTitle: '@',
        propActive: '@',
        propDisabled: '@',
        localTabClick: '&tabClick'
      },
      link: function(scope, element, attrs) {
        var scrollingTabsControl = new ScrollingTabsControl(element, $timeout);

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

        scrollingTabsControl.initTabs(false); // false -> not the wrapper directive
      }

    };
  }




  /* ********************************************************
   * scrolling-tabs-wrapper Directive
   * ********************************************************/
  function scrollingTabsWrapperDirective($timeout) {
      // ------------ Directive Object ---------------------------
      return {
        restrict: 'A',
        template: scrollingTabsWrapperTemplate,
        transclude: true,
        replace: true,
        link: function(scope, element, attrs) {
          var scrollingTabsControl = new ScrollingTabsControl(element, $timeout);

          scrollingTabsControl.initTabs(true); // true -> wrapper directive
        }
      };
  
  }


  scrollingTabsDirective.$inject = ['$timeout', '$sce'];
  scrollingTabsWrapperDirective.$inject = ['$timeout'];

  scrollingTabsModule.directive('scrollingTabs', scrollingTabsDirective);
  scrollingTabsModule.directive('scrollingTabsWrapper', scrollingTabsWrapperDirective);

}());
