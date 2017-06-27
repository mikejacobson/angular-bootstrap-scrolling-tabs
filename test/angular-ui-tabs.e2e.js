describe('angular-ui-tabs', function () {

  it('loads page with first tab active', function () {
    browser.get('http://localhost:3000/run/angular-ui-tabs/index.html');
    var tabs = element.all(by.css('ul.nav-tabs > li'));
    var panes = element.all(by.css('.tab-content > .tab-pane'));

    expect(tabs.count()).toEqual(12);
    expect(panes.count()).toEqual(12);

    expect(tabs.get(0).getAttribute('class')).toContain('active');
    expect(panes.get(0).getAttribute('class')).toContain('active');
  });

});
