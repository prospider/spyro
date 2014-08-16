'use strict';

// Declare app level module which depends on filters, and services
angular.module('spyro', [
    'spyro.config',
    'spyro.controllers',
    'spyro.decorators',
    'spyro.directives',
    'spyro.filters',
    'spyro.routes',
    'spyro.services'
  ])

  .run(['simpleLogin', function(simpleLogin) {
    console.log('run'); //debug
    simpleLogin.getUser();
  }])
