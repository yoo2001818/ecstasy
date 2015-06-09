var assert = require('assert');
var ecstasy = require('../index.js');

describe('ActionEngine', function() {
  var engine;
  beforeEach(function() {
    engine = new ecstasy.ActionEngine(true);
  });
  describe('#runAction()', function() {
    it('should emit action in correct order', function(done) {
      var order = 0;
      engine.a('test1', ecstasy.Action.scaffold(function(engine) {
        assert.equal(order++, 0);
        engine.aa('test2', null, null, null);
        this.result = 1;
      }));
      engine.a('test2', ecstasy.Action.scaffold(function(engine) {
        assert.equal(order++, 1);
        this.result = 1;
      }));
      engine.s('sys').action(function(turn, action) {
        if(action.name == 'test1') {
          assert.equal(order++, 2, 'test1 should be called first');
        } else if(action.name == 'test2') {
          assert.equal(order++, 3, 'test2 should be called later');
          done();
        }
      });
      engine.aa('test1', null, null, null);
    });
  });
});
