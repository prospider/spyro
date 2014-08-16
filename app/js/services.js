(function() {
   'use strict';

   /* Services */

   angular.module('spyro.services', ['firebase.utils'])

      // put your services here!
      // .service('serviceName', ['dependency', function(dependency) {}]);

     .service('messageList', ['fbutil', function(fbutil) {
       this.messages = fbutil.syncArray('messages', {limit: 10, endAt: null});

        this.addMessage = function(newMessage, user) {
          var callback = newMessage.callback || "none";

          this.messages.$add({
            type: newMessage.type,
            recipient: newMessage.recipient,
            sender: newMessage.sender,
            text: newMessage.text,
            callback: callback,
            creatorUid: user.uid,
            creatorDisplayName: user.displayName
          });
        };
     }])

     .service('userList', ['fbutil', function(fbutil) {
      this.users = fbutil.syncArray('users');
     }]);

})();

