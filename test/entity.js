var assert = require('assert');
var ecstasy = require('../index.js');

describe('Entity', function() {
  var engine, entity;
  beforeEach(function() {
    engine = new ecstasy.Engine();
    engine.c('test', function() {this.data = '11'});
    entity = engine.e();
  });
  describe('#add()', function() {
    it('should add component in entity', function() {
      var comp = '11';
      entity.add('test', comp);
      assert.equal(comp, entity.get('test'));
    });
    it('should emit componentAdded', function(done) {
      var comp = '11';
      entity.on('componentAdded', function(e, key, component) {
        assert.equal(entity, e);
        assert.equal('test', key);
        assert.equal(comp, component);
        done();
      });
      entity.add('test', comp);
    });
  });
  describe('#create()', function() {
    it('should create component with engine\'s constructor', function() {
      entity.create('test', {});
      assert.equal('11', entity.get('test').data);
    });
    it('should emit componentAdded', function(done) {
      entity.on('componentAdded', function(e, key, component) {
        assert.equal(entity, e);
        assert.equal('test', key);
        assert.equal('11', component.data);
        done();
      });
      entity.create('test', {});
    });
  });
  describe('#remove()', function() {
    beforeEach(function() {
      entity.c('test', {});
    });
    it('should remove component in entity', function() {
      entity.remove('test');
      assert.equal(null, entity.get('test'));
    });
    it('should emit componentRemoved', function(done) {
      entity.on('componentRemoved', function(e, key) {
        assert.equal(entity, e);
        assert.equal('test', key);
        done();
      });
      entity.remove('test');
    });
  });
  describe('#has()', function() {
    beforeEach(function() {
      entity.c('test', {});
    });
    it('should has if there is component in entity', function() {
      assert.equal(true, entity.has('test'));
      assert.equal(false, entity.has('test2'));
    });
  });
  describe('#serialize()', function() {
    beforeEach(function() {
      entity.c('test', {});
    });
    it('should return correctly serialized object', function() {
      assert.deepEqual(entity.serialize(), {
        id: 0,
        components: {
          'test': {
            data: '11'
          }
        }});
    });
  });
  describe('#deserialize()', function() {
    it('should correctly deserialize object', function() {
      var data = {
        id: 0,
        components: {
          'test': {
            data: '11'
          }
        }
      };
      var ent = ecstasy.Entity.deserialize(engine, data);
      assert.equal(ent.id, 0);
      assert.deepEqual(data.components['test'], ent.c('test'));
    });
  });
});
