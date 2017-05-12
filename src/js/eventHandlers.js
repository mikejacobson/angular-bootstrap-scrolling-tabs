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
    stc.elementsHandler.refreshAllElementSizes();
  };

}(EventHandlers.prototype));
