/* index.js
 */
var StatusBar = null;

// objects largely populated by Parse Views
var screens = {};
var userData = {};

//init Parse SDK
Parse.initialize("OeE65uxh8dmmJiuNxP3U8EIAg8BEDtZysMrBmEJA", "5gwS4nddIb23bbV8vBL5aMcVfeWCKjaqPbZaSHUb");


// Parse Object Models

var Review = Parse.Object.extend('Review');
var Product = Parse.Object.extend('Product');


// Parse Collections

var ReviewsCollection = Parse.Collection.extend({
  model: Review,
  query: (new Parse.Query(Review)).equalTo('owner',Parse.User.current())
});

var ProductsCollection = Parse.Collection.extend({
  model: Product,
  query: (new Parse.Query(Product)).equalTo('owner',Parse.User.current())
});



// Parse Views

var StartScreen = Parse.View.extend({
  selector: 'screen#start',
  el: 'app',
  events: {
    'click #btn_currentUser': 'showLogin',
    'click #btn_newUser': 'showSignup',
    'mousedown .touchable': 'touched',
    'mouseup .touchable': 'released',
    'touchstart .touchable': 'touched',
    'touchend .touchable': 'released'
  },
  initialize: function (renderBoolean, showBoolean) {
    'use strict';
    console.log('Parse View: StartScreen INIT');
    if (renderBoolean) {
      this.render(showBoolean);
    }
  },
  render: function (showBoolean) {
    'use strict';
    console.log('Parse View: StartScreen RENDER ' + this.selector);
    var tpl = _.template( $('#tpl_view_start').html() );
    if ( $(this.selector).length == 0 ) {
      this.$el.append( tpl() );
    } else {
      $(this.selector).replaceWith( tpl() );
    }

    if (showBoolean){
      // Now that the screen#item is rendered...
      // ...tell the app to make it visible
      app.showScreen('start');
    }
  },
  showLogin: function () {
    app.showScreen('login');
  },
  showSignup: function () {
    app.showScreen('signup');
  },
  touched: function (event) {
    $(event.target).addClass('touched');
  },
  released: function (event) {
    $(event.target).removeClass('touched');
  }
});
var LoginScreen = Parse.View.extend({
  selector: 'screen#login',
  el: 'app',
  events: {
    'click #btn_login': 'doLogin',
    'mousedown .touchable': 'touched',
    'mouseup .touchable': 'released',
    'touchstart .touchable': 'touched',
    'touchend .touchable': 'released'
  },
  initialize: function (renderBoolean, showBoolean) {
    'use strict';
    console.log('Parse View: LoginScreen INIT');
    if (renderBoolean) {
      this.render(showBoolean);
    }
  },
  render: function (showBoolean) {
    'use strict';
    console.log('Parse View: LoginScreen RENDER ' + this.selector);
    var tpl = _.template( $('#tpl_view_login').html() );
    if ( $(this.selector).length == 0 ) {
      this.$el.append( tpl() );
    } else {
      $(this.selector).replaceWith( tpl() );
    }

    if (showBoolean){
      // Now that the screen#item is rendered...
      // ...tell the app to make it visible
      app.showScreen('login');
    }
  },
  doLogin: function () {
    var feedbackObj = $(this.selector + ' #btn_login');
    var oldLabel = feedbackObj.html();
    feedbackObj.removeClass('touched');
    feedbackObj.prop('disabled', true);
    feedbackObj.html('Working...');
    //place the Login code here
    Parse.User.logIn($(this.selector + ' #frm_login #txt_username').val(), $('#frm_login #txt_password').val(), {
      success: function(u) {
        feedbackObj.addClass('success');
        feedbackObj.html('success!');

        // Do stuff after successful login.
        $('input').blur();
        setTimeout(function() {
          feedbackObj.prop('disabled', false);
          feedbackObj.removeClass('success');
          feedbackObj.html(oldLabel);
        },3000);

        //do the user sign-in
        app.enter();

      },
      error: function(u, error) {
        feedbackObj.prop('disabled', false);
        feedbackObj.addClass('error');
        // The login failed. Check error to see why.
        if (error.code == 101) {
          feedbackObj.html('nope!');
          setTimeout(function() {
            feedbackObj.removeClass('error');
            feedbackObj.html(oldLabel);
          },3000);
        }
        console.error(error);
      }
    });
  },
  touched: function (event) {
    $(event.target).addClass('touched');
  },
  released: function (event) {
    $(event.target).removeClass('touched');
  }
});
var SignupScreen = Parse.View.extend({
  selector: 'screen#signup',
  el: 'app',
  events: {
    'submit #frm_signup': 'doSignup',
    'click #btn_cancel': 'goBack',
    'keyup #txt_email': 'checkEmail',
    'keyup #txt_pass1': 'checkPass',
    'keyup #txt_pass2': 'checkPass',
    'mousedown .touchable': 'touched',
    'mouseup .touchable': 'released',
    'touchstart .touchable': 'touched',
    'touchend .touchable': 'released'
  },
  initialize: function (renderBoolean, showBoolean) {
    'use strict';
    console.log('Parse View: SignupScreen INIT');
    if (renderBoolean) {
      this.render(showBoolean);
    }
  },
  render: function (showBoolean) {
    'use strict';
    console.log('Parse View: SignupScreen RENDER ' + this.selector);
    var tpl = _.template( $('#tpl_view_signup').html() );
    if ( $(this.selector).length == 0 ) {
      this.$el.append( tpl() );
    } else {
      $(this.selector).replaceWith( tpl() );
    }

    if (showBoolean){
      // Now that the screen#item is rendered...
      // ...tell the app to make it visible
      app.showScreen('signup');
    }
  },
  doSignup: function (event) {
    console.log(event);
    var lblObj = $(this.selector + ' #btn_signup');
    var oldLabel = lblObj.html();
    
    var user = new Parse.User();
    user.set('username', $(this.selector + ' #txt_username').val());
    user.set('password', $(this.selector + ' #txt_pass1').val());
    user.set('email', $(this.selector + ' #txt_email').val());
    // other fields to set
    user.set('firstName', $(this.selector + ' #txt_firstName').val());
    user.set('lastName', $(this.selector + ' #txt_lastName').val());
    user.set('dob', util.parseHTMLDateToJS($(this.selector + ' #dte_dob').val()));
    user.set('gender', parseInt($(this.selector + ' #sel_gender').val()));
    user.set('postalCode', $(this.selector + ' #txt_postalCode').val().toUpperCase());
    
    lblObj.html('working...');
    lblObj.prop('disabled', true);
    
    user.signUp(null, {
      success: function(user) {
        lblObj.addClass('success');
        lblObj.html('success!');
        setTimeout(function () {
          lblObj.removeClass('success');
          lblObj.html(oldLabel);
        }, 3000);
        // Hooray! Let them use the app now.
        app.checkUser();
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        lblObj.addClass('error');
        lblObj.html('Signup Failed');
        console.log(JSON.stringify(error, null, 2), 2);
        setTimeout(function() {
          lblObj.removeClass('error');
          lblObj.html(oldLabel);
        },3000);
      }
    });
    
    event.preventDefault();
    return false;
  },
  goBack: function () {
    app.showScreen('start');
  },
  checkEmail: function () {
    var email = $(this.selector + ' #txt_email');
    if (util.validateEmail(email.val())) {
      email.addClass('good');
      email.removeClass('bad');
      this.checkForm();
    } else {
      email.addClass('bad');
      email.removeClass('good');
      this.checkForm();
    }
  },
  checkPass: function () {
    var pass1 = $(this.selector + ' #txt_pass1');
    var pass2 = $(this.selector + ' #txt_pass2');
    if (pass2.val() == pass1.val()) {
      pass2.removeClass('bad');
      pass1.addClass('good');
      pass2.addClass('good');
      this.checkForm();
    } else {
      pass1.removeClass('good');
      pass2.removeClass('good');
      pass2.addClass('bad');
      this.checkForm();
    }
  },
  checkForm: function () {
    var email = $(this.selector + ' #txt_email');
    var pass1 = $(this.selector + ' #txt_pass1');
    var pass2 = $(this.selector + ' #txt_pass2');
    
    if ( email.hasClass('good') && pass1.hasClass('good') && pass2.hasClass('good') ) {
      $(this.selector + ' #btn_signup').prop('disabled', false);
    } else {
      $(this.selector + ' #btn_signup').prop('disabled', true);
    }
    
  },
  touched: function (event) {
    $(event.target).addClass('touched');
  },
  released: function (event) {
    $(event.target).removeClass('touched');
  }
});
var DashboardScreen = Parse.View.extend({
  selector: 'screen#dashboard',
  el: 'app',
  events: {
    'click #btn_menu': 'showMenu',
    'mousedown .touchable': 'touched',
    'mouseup .touchable': 'released',
    'touchstart .touchable': 'touched',
    'touchend .touchable': 'released'
  },
  initialize: function (renderBoolean, showBoolean) {
    'use strict';
    console.log('Parse View: DashboardScreen INIT');
    if (renderBoolean) {
      this.render(showBoolean);
    }
  },
  render: function (showBoolean) {
    'use strict';
    console.log('Parse View: DashboardScreen RENDER ' + this.selector);
    var tpl = _.template( $('#tpl_view_dashboard').html() );
    
    if (showBoolean){
      // Now that the screen#item is rendered...
      // ...tell the app to make it visible
      this.$el.html( tpl() );
    }
  },
  showMenu: function () {
    'use strict';
    $('app').addClass('deepTilt');
    $('app').one('click', function () {
      $('app').removeClass('deepTilt');
    });
  },
  touched: function (event) {
    $(event.target).addClass('touched');
  },
  released: function (event) {
    $(event.target).removeClass('touched');
  }
});


// app

var app = {
  online: false,
  initialize: function () {
    'use strict';
    app.bindEvents();
    
    app.checkUser();
    
  },
  bindEvents: function () {
    'use strict';
    // common Cordova events are: 'load', 'deviceready', 'offline', and 'online'.
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener('online', this.onOnline, false);
    document.addEventListener('offline', this.onOffline, false);
    
    // main menu events
    $('menu #btn_logOut').hammer().on('tap', app.exit);
    $('menu #btn_closeMenu').hammer().on('tap', function () {
      $('app').removeClass('deepTilt');
    });
  },
  onDeviceReady: function () {
    'use strict';
    // do something when the device is ready
    StatusBar.hide();
  },
  onOffline: function () {
    'use strict';
    app.online = false;
    notify.alert('App online: ' + app.online, null);
  },
  onOnline: function () {
    'use strict';
    app.online = true;
    notify.alert('App online: ' + app.online, null);
  },
  // This toggle allows us to load screens asynchrounously,
  // then toggle their visibility independently.
  showScreen: function (id) {
    'use strict';
    //id refers to the "ID" attribute of the screen element to show
    $('screen').addClass('hidden');
    $('screen#' + id).removeClass('hidden');
  },
  checkUser: function () {
    if (Parse.User.current()){
      // Parse User is known, so...
      app.enter();
    } else {
      // Parse User is unknown, so...
      // INIT the Start Screen, with render = true, and show = true
      // ALl the other screens should be render = true, show = false.
      screens.start = new StartScreen(true, true);
      screens.login = new LoginScreen(true, false);
      screens.signup = new SignupScreen(true, false);
    }
  },
  enter: function () {
    'use strict';
    // GET User's Reviews
    userData.reviews = new ReviewsCollection;
    // GET User's Products
    userData.products = new ProductsCollection;
    
    // load the dashboard, render = true, and show = true ALWAYS
    screens.dashboard = new DashboardScreen(true, true);
  },
  exit: function () {
    Parse.User.logOut();
    location.reload(true);
  }
};

var notify = {
  alert: function (msg, cb) {
    'use strict';
    navigator.notification.alert(
      msg,//message
      cb,//callback
      'ALERT!',//[title]
      'OK'//[buttonNames]
    );
  }
};

var util = {
  validateEmail: function (email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },
  parseHTMLDateToJS: function (s) {
    if (s == "" || s == null){
      s = "1111-11-11";
    }
    var b = s.split(/\D/);
    return new Date(b[0], --b[1], b[2]);
  }
};
