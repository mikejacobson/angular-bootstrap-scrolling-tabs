/* **********************************************************************
 * ScrollingTabsControl - Class that each directive will instantiate
 * **********************************************************************/
function ScrollingTabsControl($tabsContainer, $timeout) {
  var stc = this;

  stc.$tabsContainer = $tabsContainer;
  stc.$timeout = $timeout;

  stc.movableContainerLeftPos = 0;
  stc.scrollArrowsVisible = false;
  stc.scrollToTabEdge = false;

  stc.scrollMovement = new ScrollMovement(stc);
  stc.eventHandlers = new EventHandlers(stc);
  stc.elementsHandler = new ElementsHandler(stc);
}

// prototype methods
(function (p) {
  p.handleTriggeredRefresh = function () {
    var stc = this,
        scrollMovement = stc.scrollMovement,
        actionsTaken = stc.elementsHandler.refreshAllElementSizes(true);

    if (!actionsTaken.didScrollToActiveTab) {
      stc.$timeout(function __scrollToActiveAfterRefreshSizes() {
        scrollMovement.scrollToActiveTab({
          isOnTabsRefresh: true
        });
      }, 100);
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


}(ScrollingTabsControl.prototype));
