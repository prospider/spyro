(function() {
   'use strict';

   /* Services */

   angular.module('spyro.services', ['firebase.utils', 'simpleLogin'])

      // put your services here!
      // .service('serviceName', ['dependency', function(dependency) {}]);

     .service('messageList', ['fbutil', 'simpleLogin', function(fbutil, simpleLogin) {
       this.messages = fbutil.syncArray('messages', {limit: 10, endAt: null});

        this.addMessage = function(newMessage) {
          var callback = newMessage.callback || "none";
          var loggedInUser = simpleLogin.getUser().uid;

          this.messages.$add({
            type: newMessage.type,
            recipient: newMessage.recipient,
            sender: newMessage.sender,
            text: newMessage.text,
            callback: callback
          });
        };
     }]);

})();

