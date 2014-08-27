(function() {
   'use strict';

   /* Services */

   angular.module('spyro.services', ['firebase.utils'])

      // put your services here!
      // .service('serviceName', ['dependency', function(dependency) {}]);

     .service('messageList', ['fbutil', 'notificationList', function(fbutil, notificationList) {
       this.messages = fbutil.syncArray('messages', {limit: 10, endAt: null});

        this.addMessage = function(newMessage, user) {
          var callback = newMessage.callback || "none";

          this.messages.$add({
            type: newMessage.type,
            recipientDisplayName: newMessage.recipient.name,
            recipientUid: newMessage.recipient.$id,
            sender: newMessage.sender,
            text: newMessage.text,
            callback: callback,
            creatorUid: user.uid,
            creatorDisplayName: user.displayName
          }).then(function(ref) {
            notificationList.addNotification(
              ref.name(),
              newMessage,
              notificationList.getNotifications(newMessage.recipient.$id)
            );
          });
        };

        this.deleteMessage = function(message) {
          console.log("Deleting message");
          this.messages.$remove(message);
        };
     }])

     .service('notificationList', ['fbutil', function(fbutil) {
      this.getNotifications = function(userUid) {
        return fbutil.syncArray('notifications/' + userUid, {limit: 10, endAt: null});
      };

      this.addNotification = function(id, msg, notificationArray) {
        notificationArray.$add({
          messageId: id,
          type: msg.type,
          sender: msg.sender
        });
      };

      this.deleteNotification = function(notification, notificationArray) {
        notificationArray.$remove(notification);
      };
     }])

     .service('userList', ['fbutil', function(fbutil) {
      this.users = fbutil.syncArray('users');
     }]);

})();

