exports.config = {
  //seleniumAddress : 'http://127.0.0.1:4444/wd/hub',
  seleniumServerJar: './node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.4.0.jar',
  specs: ['test/angular-ui-tabs.e2e.js']
}
