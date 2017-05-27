describe('bootstrap-tabs', function () {

  it('should load page with 3 instances of the directive', function () {
    browser.get('http://localhost:3000/run/bootstrap-tabs/index.html');
    var container = element.all(by.css('.scrtabs-tab-container'));
    expect(container.count()).toEqual(1);

    var wrapperContainers = element.all(by.css('.scrtabs-tab-wrapper-container'));
    expect(wrapperContainers.count()).toEqual(2);
  });

});
