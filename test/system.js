var assert = require('assert');
var ecstasy = require('../index.js');

describe('TurnSystem', function() {
  it('should be instance of ActionSystem', function() {
    var sys = new ecstasy.TurnSystem();
    assert(sys instanceof ecstasy.ActionSystem);
  });
  it('should be instance of System', function() {
    var sys = new ecstasy.TurnSystem();
    assert(sys instanceof ecstasy.System);
  });
});

describe('ActionSystem', function() {
  it('should be instance of System', function() {
    var sys = new ecstasy.ActionSystem();
    assert(sys instanceof ecstasy.System);
  });
});

describe('System', function() {
  
});
