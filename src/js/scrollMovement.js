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
    } else if (stc.scrollToTabEdge) {
      smv.setMovableContainerLeftPosToTabEdge('right');

      if (stc.movableContainerLeftPos < minPos) {
        stc.movableContainerLeftPos = minPos;
      }
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
    } else if (stc.scrollToTabEdge) {
      smv.setMovableContainerLeftPosToTabEdge('left');

      if (stc.movableContainerLeftPos > 0) {
        stc.movableContainerLeftPos = 0;
      }
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

  p.scrollToActiveTab = function (options) {
    var smv = this,
        stc = smv.stc,
        offset = 0,
        $activeTab,
        activeTabWidth,
        activeTabLeftPos,
        activeTabRightPos,
        rightArrowLeftPos,
        leftArrowRightPos,
        visibleAreaLeftPos,
        visibleAreaRightPos,
        minPos;

    // if the active tab is not fully visible, scroll till it is
    if (!stc.scrollArrowsVisible) {
      return;
    }

    $activeTab = stc.$tabsUl.find('li.active');

    if (!$activeTab.length) {
      return;
    }

    activeTabLeftPos = $activeTab.offset().left;
    activeTabWidth = $activeTab.outerWidth();
    activeTabRightPos = activeTabLeftPos + activeTabWidth + parseInt(stc.scrollingTabsActiveOffset || 0, 10);

    rightArrowLeftPos = stc.$rightScrollArrow.offset().left;
    leftArrowRightPos = stc.$leftScrollArrow.outerWidth(); // its leftpos is 0
    visibleAreaLeftPos = leftArrowRightPos;
    visibleAreaRightPos = rightArrowLeftPos;

    if (activeTabLeftPos < visibleAreaLeftPos) {
      offset = activeTabLeftPos - visibleAreaLeftPos;
      stc.movableContainerLeftPos = stc.movableContainerLeftPos - offset;
    } else if (activeTabRightPos > visibleAreaRightPos) {
      offset = activeTabRightPos - visibleAreaRightPos;
      stc.movableContainerLeftPos = stc.movableContainerLeftPos - offset;
    }

    if (offset) {
      minPos = smv.getMinPos();

      if (stc.movableContainerLeftPos < minPos) {
        stc.movableContainerLeftPos = minPos;
      } else if (stc.movableContainerLeftPos > 0) {
        stc.movableContainerLeftPos = 0;
      }

      smv.slideMovableContainerToLeftPos();
    } else if (stc.scrollingTabsActiveOffset) {
      stc.handleArrowsClassNames('left');
    }
  };

  p.setMovableContainerLeftPosToTabEdge = function (scrollArrowClicked) {
    var smv = this,
        stc = smv.stc,
        offscreenWidth = -stc.movableContainerLeftPos,
        totalTabWidth = 0;

      // make sure LeftPos is set so that a tab edge will be against the
      // left scroll arrow so we won't have a partial, cut-off tab
      stc.$tabsLiCollection.each(function (index) {
        var tabWidth = $(this).width();

        totalTabWidth += tabWidth;

        if (totalTabWidth > offscreenWidth) {
          stc.movableContainerLeftPos = (scrollArrowClicked === 'left') ? -(totalTabWidth - tabWidth) : -totalTabWidth;
          return false; // exit .each() loop
        }

      });
  };

  p.slideMovableContainerToLeftPos = function () {
    var smv = this,
        stc = smv.stc,
        leftVal;

    stc.movableContainerLeftPos = stc.movableContainerLeftPos / 1;
    leftVal = smv.getMovableContainerCssLeftVal();

    stc.$movableContainer.stop().animate({ left: leftVal }, 'slow', function () {
      var newMinPos = smv.getMinPos();

      // if we slid past the min pos--which can happen if you resize the window
      // quickly--move back into position
      if (stc.movableContainerLeftPos < newMinPos) {
        smv.decrementMovableContainerLeftPos(newMinPos);
        stc.$movableContainer.stop().animate({ left: smv.getMovableContainerCssLeftVal() }, 'fast');
      }

      if (stc.scrollingTabsActiveOffset) {
        var edge;
        // taking 2px offset error
        if (stc.movableContainerLeftPos <= 0 && stc.movableContainerLeftPos >= -2) {
          // left edge
          edge = 'left';
        } else if ((stc.movableContainerLeftPos - newMinPos) >= 0 &&
                   (stc.movableContainerLeftPos - newMinPos) <= 2) {
          edge = 'right';
        }

        stc.handleArrowsClassNames(edge);
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
