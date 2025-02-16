'use strict';

var UtilityTray = require('./lib/utility_tray');

marionette('Utility Tray - Gestures', function() {
  var client = marionette.client({
    desiredCapabilities: { raisesAccessibilityExceptions: true }
  });

  var system;
  var utilityTray;

  setup(function() {
    system = client.loader.getAppClass('system');
    utilityTray = new UtilityTray(client);

    system.waitForFullyLoaded();
  });

  test('Swiping down when already opened', function() {
    var topPanel = system.topPanel;

    utilityTray.swipeDown(topPanel);
    utilityTray.waitForOpened();

    utilityTray.swipeDown(topPanel);
    utilityTray.waitForOpened();
  });

  test('Swiping down', function() {
    var topPanel = system.topPanel;

    utilityTray.swipeDown(topPanel);
    utilityTray.waitForOpened();
  });

  test('Swiping up', function() {
    var grippy = client.findElement(utilityTray.Selectors.grippy);

    utilityTray.open();
    utilityTray.swipeUp(grippy);
    utilityTray.waitForClosed();
  });

  test('Swiping up in the middle of the tray closes it', function() {
    var grippy = client.findElement(utilityTray.Selectors.element);

    utilityTray.open();
    utilityTray.swipeUp(grippy);
    utilityTray.waitForClosed();
  });
});
