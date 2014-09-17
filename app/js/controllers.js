'use strict';

/* Controllers */

angular.module('spyro.controllers', ['firebase.utils', 'simpleLogin', 'ui.bootstrap', 'mgcrea.bootstrap.affix'])
  .controller('HomeCtrl', ['$scope', 'fbutil', 'user', 'simpleLogin', 'FBURL', 'messageList', 'userList', 'notificationList', '$filter',
    function($scope, fbutil, user, simpleLogin, FBURL, messageList, userList, notificationList, $filter) {
    $scope.user = user;
    $scope.FBURL = FBURL;
    $scope.messages = messageList.messages;
    $scope.users = userList.users;
    $scope.newMessage = null;
    $scope.notifications = notificationList.getNotifications(user.uid);
    $scope.showNotifications = false;

    // expose logout function to scope
    $scope.logout = function() {
      simpleLogin.logout();
    };

    $scope.addMessage = function(newMessage) {
      messageList.addMessage(newMessage, user);
      $scope.addmessageform.$setPristine();
      $scope.newMessage = null;
    };

    $scope.deleteMessage = function(message) {
      messageList.deleteMessage(message);
      var messageId = message.$id;
      var notification = $filter('findByMessageId')($scope.notifications, messageId);
      //console.log("Deleting notification: " + notification);
      //notificationList.deleteNotification(notification);
    };

    $scope.readNotifications = function() {
      $scope.showNotifications = !$scope.showNotifications;
    };

    $scope.clearNotifications = function() {
      notificationList.clearNotifications($scope.notifications);
    };
  }])

  .controller('LoginCtrl', ['$scope', 'simpleLogin', '$location', function($scope, simpleLogin, $location) {
    $scope.email = null;
    $scope.pass = null;
    $scope.confirm = null;
    $scope.createMode = false;

    $scope.login = function(email, pass) {
      $scope.err = null;
      simpleLogin.login(email, pass)
        .then(function(/* user */) {
          $location.path('/account');
        }, function(err) {
          $scope.err = errMessage(err);
        });
    };

    $scope.loginGoogle = function() {
      $scope.err = null;
      simpleLogin.loginGoogle()
        .then(function(user) {
          console.log("phase 1");
          $scope.createAccountIfNecessary(user);
          console.log("phase 2");
          $location.path('/home');
        }, function(err) {
          $scope.err = errMessage(err);
        });
    };

    $scope.createAccountIfNecessary = function(user) {
      simpleLogin.createAccountIfNecessary(user);
    };

    $scope.createAccount = function() {
      $scope.err = null;

      if( assertValidAccountProps() ) {
        simpleLogin.createAccount($scope.email, $scope.pass)
          .then(function(/* user */) {
            $location.path('/account');
          }, function(err) {
            $scope.err = errMessage(err);
          });
      }
    };

    function assertValidAccountProps() {
      if( !$scope.email ) {
        $scope.err = 'Please enter an email address';
      }
      else if( !$scope.pass || !$scope.confirm ) {
        $scope.err = 'Please enter a password';
      }
      else if( $scope.createMode && $scope.pass !== $scope.confirm ) {
        $scope.err = 'Passwords do not match';
      }
      return !$scope.err;
    }

    function errMessage(err) {
      return angular.isObject(err) && err.code? err.code : err + '';
    }
  }])

  .controller('TestCtrl', ['$scope', 'fbutil', function($scope, fbutil) {
    /* Save for debugging purposes */
  }])

  .controller('MenuCtrl', ['$scope', '$location', '$route', 'simpleLogin',
    function($scope, $location, $route, simpleLogin) {
      $scope.logout = function() {
        simpleLogin.logout();
        $location.path('/login');
      };

      $scope.currentRoute = function(route) {
        return (route === $location.path());
      };

      $scope.changeRoute = function(route) {
        $location.path(route);
        $route.reload();
      }
  }])

  .controller('AccountCtrl', ['$scope', 'simpleLogin', 'fbutil', 'user', '$location',
    function($scope, simpleLogin, fbutil, user, $location) {
      // create a 3-way binding with the user profile object in Firebase
      var profile = fbutil.syncObject(['users', user.uid]);
      profile.$bindTo($scope, 'profile');

      // expose logout function to scope
      $scope.logout = function() {
        profile.$destroy();
        simpleLogin.logout();
        $location.path('/login');
      };

      $scope.changePassword = function(pass, confirm, newPass) {
        resetMessages();
        if( !pass || !confirm || !newPass ) {
          $scope.err = 'Please fill in all password fields';
        }
        else if( newPass !== confirm ) {
          $scope.err = 'New pass and confirm do not match';
        }
        else {
          simpleLogin.changePassword(profile.email, pass, newPass)
            .then(function() {
              $scope.msg = 'Password changed';
            }, function(err) {
              $scope.err = err;
            })
        }
      };

      $scope.clear = resetMessages;

      $scope.changeEmail = function(pass, newEmail) {
        resetMessages();
        profile.$destroy();
        simpleLogin.changeEmail(pass, newEmail)
          .then(function(user) {
            profile = fbutil.syncObject(['users', user.uid]);
            profile.$bindTo($scope, 'profile');
            $scope.emailmsg = 'Email changed';
          }, function(err) {
            $scope.emailerr = err;
          });
      };

      function resetMessages() {
        $scope.err = null;
        $scope.msg = null;
        $scope.emailerr = null;
        $scope.emailmsg = null;
      }
    }
  ]);