describe('validate-commit-msg.js', function() {
  var m = require('./validate-commit-msg');
  var errors = [];
  var logs = [];

  var VALID = true;
  var INVALID = false;

  beforeEach(function() {
    errors.length = 0;
    logs.length = 0;

    spyOn(console, 'error').andCallFake(function(msg) {
      errors.push(msg.replace(/\x1B\[\d+m/g, '')); // uncolor
    });

    spyOn(console, 'log').andCallFake(function(msg) {
      logs.push(msg.replace(/\x1B\[\d+m/g, '')); // uncolor
    });
  });

  describe('validateMessage', function() {

    it('should be valid', function() {
      expect(m.validateMessage('rr&zh: something')).toBe(VALID);
      expect(m.validateMessage('[refactor]rr&zh: something')).toBe(VALID);
      expect(errors).toEqual([]);
    });


    it('should contain committer name', function() {
      var msg = "something";
      
      expect(m.validateMessage(msg)).toBe(INVALID);
      expect(errors).toEqual(['INVALID COMMIT MSG: does not match "[<type>]<author>: <subject>"!']);
    });

    it('should only contain & in committer name', function() {
      var msg = "rr_zh: something";
      
      expect(m.validateMessage(msg)).toBe(INVALID);
      expect(errors).toEqual(['INVALID COMMIT MSG: other symbol rather than & or space is given!']);
    });

    it('should not allow empty subject', function() {
      var msg = "rr&zh: ";
      
      expect(m.validateMessage(msg)).toBe(INVALID);
      expect(errors).toEqual(['INVALID COMMIT MSG: does not match "[<type>]<author>: <subject>"!']);
    });

    it('should not allow invalid type', function() {
      var msg = "[weird]rr&zh: something";
      
      expect(m.validateMessage(msg)).toBe(INVALID);
      expect(errors).toEqual(['INVALID COMMIT MSG: "weird" is not a valid type!']);
    });
  });
});
