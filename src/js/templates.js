/* *************************************************************
 * scrolling-tabs element directive template
 * *************************************************************/
// plunk: http://plnkr.co/edit/YhKiIhuAPkpAyacu6tuk
var scrollingTabsTemplate = [
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
].join('');


/* *************************************************************
 * scrolling-tabs-wrapper element directive template
 * *************************************************************/
// plunk: http://plnkr.co/edit/lWeQxxecKPudK7xlQxS3
var scrollingTabsWrapperTemplate = [
  '<div class="scrtabs-tab-wrapper-container" ng-class="{ \'force-height\': !scrtc.hasTabContentOutsideMovableContainer }">',
  ' <div class="scrtabs-tab-scroll-arrow scrtabs-js-tab-scroll-arrow-left"><span class="glyphicon glyphicon-chevron-left"></span></div>',
  '   <div class="scrtabs-tabs-fixed-container">',
  '     <div class="scrtabs-tabs-movable-container" ng-transclude></div>',
  '   </div>',
  ' <div class="scrtabs-tab-scroll-arrow scrtabs-js-tab-scroll-arrow-right"><span class="glyphicon glyphicon-chevron-right"></span></div>',
  '</div>'
].join('');
