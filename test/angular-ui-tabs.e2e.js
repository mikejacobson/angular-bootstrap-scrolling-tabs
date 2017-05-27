describe('angular-ui-tabs', function () {

  it('should load page', function () {
    browser.get('http://localhost:3000/run/angular-ui-tabs/index-uib-0.14.html');
    var tabs = element.all(by.css('ul.nav-tabs > li'));
    expect(tabs.count()).toEqual(12);

  });

});
