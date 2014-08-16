'use strict';

/* verify config settings are present */

describe('service', function() {
   beforeEach(module('spyro.config'));

   it('should have the correct URL', inject(function(FBURL) {
      expect(FBURL).toBe('https://spyro.firebaseio.com');
   }));

   it('should have FBURL beginning with https', inject(function(FBURL) {
      expect(FBURL).toMatch(/^https:\/\/[a-zA-Z_-]+\.firebaseio\.com/i);
   }));

   it('should have a valid SEMVER version', inject(function(version) {
      expect(version).toMatch(/^\d\d*(\.\d+)+$/);
   }));
});
