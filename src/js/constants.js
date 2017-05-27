var CONSTANTS = {
  CONTINUOUS_SCROLLING_TIMEOUT_INTERVAL: 50, // timeout interval for repeatedly moving the tabs container
                                              // by one increment while the mouse is held down--decrease to
                                              // make mousedown continous scrolling faster
  SCROLL_OFFSET_FRACTION: 6, // each click moves the container this fraction of the fixed container--decrease
                             // to make the tabs scroll farther per click
  DATA_KEY_IS_MOUSEDOWN: 'ismousedown'
};
