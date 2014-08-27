'use strict';

/* Filters */

angular.module('spyro.filters', [])
   .filter('interpolate', ['version', function(version) {
      return function(text) {
         return String(text).replace(/\%VERSION\%/mg, version);
      }
   }])

   .filter('reverse', function() {
      return function(items) {
         return items.slice().reverse();
      };
   })

   .filter('findByMessageId', function() {
      return function(input, id) {
         var i=0, len=input.length;
         for (; i<len; i++) {
            console.log("+input[i].messageId = " + input[i].messageId);
            console.log("+id = " + id);
            if (+input[i].messageId === +id) {
               console.log("match!");
               return input[i];
            }
         }
         return null;
      }
   });
