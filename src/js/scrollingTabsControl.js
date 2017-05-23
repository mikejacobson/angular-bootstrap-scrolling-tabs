/* **********************************************************************
 * ScrollingTabsControl - Class that each directive will instantiate
 * **********************************************************************/
function ScrollingTabsControl($tabsContainer, $timeout, options) {
  var stc = this;

  options = options || {};

  stc.$tabsContainer = $tabsContainer;
  stc.$timeout = $timeout;

  stc.movableContainerLeftPos = 0;
  stc.scrollArrowsVisible = false;
  stc.scrollToTabEdge = false;

  stc.scrollMovement = new ScrollMovement(stc);
  stc.eventHandlers = new EventHandlers(stc);
  stc.elementsHandler = new ElementsHandler(stc);

  stc.scrollingTabsActiveOffset = options.scrollingTabsActiveOffset || 0;
}

// prototype methods
(function (p) {
  p.handleTriggeredRefresh = function () {
    var stc = this,
        scrollMovement = stc.scrollMovement,
        actionsTaken = stc.elementsHandler.refreshAllElementSizes(true);

    if (!actionsTaken.didScrollToActiveTab) {
      stc.$timeout(function () {
        scrollMovement.scrollToActiveTab({
          isOnTabsRefresh: true
        });
      }, stc.scrollingTabsActiveOffset ? 200 : 100);
    }
  };

  p.initTabs = function (options) {
    var stc = this,
        elementsHandler = stc.elementsHandler,
        scrollMovement = stc.scrollMovement;

    if (options.scrollToTabEdge) {
      stc.scrollToTabEdge = true;
    }

    stc.$timeout(function __initTabsAfterTimeout() {
      var actionsTaken;

      elementsHandler.initElements(options);
      actionsTaken = elementsHandler.refreshAllElementSizes();

      if (!actionsTaken.didScrollToActiveTab) {
        scrollMovement.scrollToActiveTab({
          isOnTabsRefresh: options.isWatchingTabs
        });
      }


    }, 100);
  };

  p.removeTranscludedTabContentOutsideMovableContainer = function() {
    var stc = this,
        elementsHandler = stc.elementsHandler;

    elementsHandler.removeTranscludedTabContentOutsideMovableContainer();
  };

  /**
   * Handles control arrows classnames
   *
   * @param {string} edge ('left'|'right')
   * @return {undefined}
   */
  p.handleArrowsClassNames = function (edge) {
    var stc = this;
    var edgeClassName = 'scrtabs-tab-scroll-arrow--is-on-edge';
    var arrows = {
      left: stc.$leftScrollArrow,
      right: stc.$rightScrollArrow,
    };

    if (edge) {
      arrows[edge].addClass(edgeClassName);
      arrows[edge == 'left' ? 'right' : 'left'].removeClass(edgeClassName);
    } else {
      arrows.left.removeClass(edgeClassName);
      arrows.right.removeClass(edgeClassName);
    }
  };

}(ScrollingTabsControl.prototype));
