/* index.js
 */

var app = {
  initialize: function () {
    'use strict';
    this.bindEvents();
  },
  bindEvents: function () {
    'use strict';
    // common Cordova events are: 'load', 'deviceready', 'offline', and 'online'.
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  onDeviceReady: function () {
    'use strict';
    // do something when the device is ready
  }
};
