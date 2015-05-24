var assert = require('assert');
var ecstasy = require('../index.js');

describe('Engine', function() {
  var engine;
  beforeEach(function() {
    engine = new ecstasy.Engine();
  });
  describe('#c() (registerComponent)', function() {
    it('should return bit position of new component', function() {
      for(var i = 0; i < 100; ++i) {
        assert.equal(i, engine.c("c_"+i, null));
      }
    });
    it('should return bit position of already added component', function() {
      for(var i = 0; i < 100; ++i) {
        engine.c("c_"+i, null);
        assert.equal(i, engine.c("c_"+i, null));
      }
    });
  });
  describe('#getComponentConstructor()', function() {
    it('should return correct constructor', function() {
      for(var i = 0; i < 100; ++i) {
        engine.c("c_"+i, "c_"+i);
      }
      for(var i = 0; i < 100; ++i) {
        assert.equal("c_"+i, engine.getComponentConstructor("c_"+i));
      }
    });
    it('should return null if unknown', function() {
      assert.equal(null, engine.getComponentConstructor("value"));
    });
  });
  describe('#getComponentBit()', function() {
    it('should return bit position of already added component', function() {
      for(var i = 0; i < 100; ++i) {
        engine.c("c_"+i, "c_"+i);
      }
      for(var i = 0; i < 100; ++i) {
        assert.equal(i, engine.getComponentBit("c_"+i));
      }
    });
    it('should call registerComponent if not added', function() {
      for(var i = 0; i < 100; ++i) {
        assert.equal(i, engine.getComponentBit("c_"+i));
      }
    });
  });
  describe('#getComponentsBitSet()', function() {
    var valid, componentSet;
    beforeEach(function() {
      for(var i = 0; i < 100; ++i) {
        engine.c("c_"+i, "c_"+i);
      }
    });
    it('should return BitSet with the component bits', function() {
      valid = new ecstasy.BitSet();
      componentSet = [];
      for(var i = 0; i < 100; ++i) {
        valid.set(i, true);
        componentSet.push("c_"+i);
      }
      assert.deepEqual(valid, engine.getComponentsBitSet(componentSet));
      valid = new ecstasy.BitSet();
      componentSet = [];
      for(var i = 0; i < 100; i += 2) {
        valid.set(i, true);
        componentSet.push("c_"+i);
      }
      assert.deepEqual(valid, engine.getComponentsBitSet(componentSet));
    });
  });
  describe('#obtainEntityId()', function() {
    it('should return unique incrementing numbers', function() {
      for(var i = 0; i < 100; ++i) {
        assert.equal(i, engine.obtainEntityId());
      }
    });
  });
  describe('#addEntity()', function() {
    var entity;
    beforeEach(function() {
      entity = new ecstasy.Entity(engine);
    });
    it('should set entity id after adding', function() {
      engine.addEntity(entity);
      assert.equal(0, entity.id);
    });
    it('should not add already added entity', function() {
      engine.addEntity(entity);
      assert.equal(0, entity.id);
      engine.addEntity(entity);
      assert.equal(0, entity.id);
    });
    it('should add event listeners after adding', function() {
      engine.addEntity(entity);
      assert(entity.listeners('componentAdded').length == 1);
      assert(entity.listeners('componentRemoved').length == 1);
    });
    it('should emit entityAdded after adding', function(done) {
      engine.on('entityAdded', function(e) {
        assert(entity, e);
        done();
      });
      engine.addEntity(entity);
    });
    // TODO componentGroups
  });
  describe('#createEntity()', function() {
    it('should return entity with id', function() {
      for(var i = 0; i < 100; ++i) {
        assert.equal(i, engine.createEntity().id);
      }
    });
    it('should emit entityAdded', function(done) {
      engine.on('entityAdded', function(e) {
        done();
      });
      engine.createEntity();
    });
  });
  describe('#removeEntity()', function() {
    var entity;
    beforeEach(function() {
      entity = engine.createEntity();
    });
    it('should remove reference to entity from array', function() {
      engine.removeEntity(entity);
      assert.equal(null, engine.getEntity(entity.id));
    });
    it('should emit entityRemoved', function(done) {
      engine.on('entityRemoved', function(e) {
        assert(entity, e);
        done();
      });
      engine.removeEntity(entity);
    });
    it('should remove event listeners after removing', function() {
      engine.removeEntity(entity);
      assert(entity.listeners('componentAdded').length == 0);
      assert(entity.listeners('componentRemoved').length == 0);
    });
    // TODO componentGroups
  });
  describe('#removeAllEntities()', function() {
    var entity;
    beforeEach(function() {
      entity = engine.createEntity();
    });
    it('should remove all the entities', function() {
      assert.equal(1, engine.getEntities().length);
      engine.removeAllEntities();
      assert.equal(0, engine.getEntities().length);
    });
    it('should emit entityRemoved', function(done) {
      engine.on('entityRemoved', function(e) {
        done();
      });
      engine.removeAllEntities();
    });
  });
  describe('#getEntity()', function() {
    var entity;
    beforeEach(function() {
      entity = engine.createEntity();
    });
    it('should return specified entity', function() {
      assert.equal(entity, engine.getEntity(0));
    });
    it('should return null if not found', function() {
      assert.equal(null, engine.getEntity(1));
    });
  });
  describe('#registerComponentGroup()', function() {
    var entity, group, group2;
    beforeEach(function() {
      engine.c('test', function() {});
      engine.c('test2', function() {});
      entity = engine.e().c('test', {});
      group = ecstasy.ComponentGroup.createBuilder(engine)
        .contain('test').build();
      group2 = ecstasy.ComponentGroup.createBuilder(engine)
        .contain('test2').build();
    });
    it('should return entities array', function() {
      assert.deepEqual([entity], engine.registerComponentGroup(group));
      assert.deepEqual([], engine.registerComponentGroup(group2));
    });
    it('should set id of ComponentGroup', function() {
      engine.registerComponentGroup(group);
      engine.registerComponentGroup(group2);
      assert.equal(0, group.id);
      assert.equal(1, group2.id);
    });
    it('should emit entityAdded', function(done) {
      group.on('entityAdded', function(e) {
        assert(entity, e);
        done();
      });
      engine.registerComponentGroup(group);
    });
  });
  describe('#getEntitiesFor()', function() {
    var entity, group;
    beforeEach(function() {
      engine.c('test', function() {});
      entity = engine.e().c('test', {});
      group = ecstasy.ComponentGroup.createBuilder(engine)
        .contain('test').build();
    });
    it('should create ComponentGroup if string', function() {
      assert.deepEqual([entity], engine.getEntitiesFor('test'));
    });
    it('should call registerComponentGroup if ComponentGroup', function() {
      assert.deepEqual([entity], engine.getEntitiesFor(group));
    });
  });
  describe('#getComponentGroup()', function() {
    var entity, group;
    beforeEach(function() {
      engine.c('test', function() {});
      entity = engine.e().c('test', {});
      group = ecstasy.ComponentGroup.createBuilder(engine)
        .contain('test').build();
    });
    it('should return its ComponentGroup', function() {
      var entities = engine.getEntitiesFor(group);
      assert.equal(group, engine.getComponentGroup(entities));
    });
  });
  describe('#addSystem()', function() {
    var system;
    beforeEach(function() {
      system = {};
    });
    it('should set id of the system', function() {
      engine.addSystem('key', system);
      assert.equal(0, system._id);
    });
    it('should call system.add()', function(done) {
      system.add = function(e) {
        assert.equal(engine, e);
        done();
      }
      engine.addSystem('key', system);
    });
  });
  describe('#createSystem()', function() {
    it('should return a SystemBuilder', function() {
      assert(engine.createSystem('key') instanceof ecstasy.SystemBuilder);
    });
  });
  describe('#getSystem()', function() {
    var system;
    beforeEach(function() {
      system = {};
      engine.addSystem('key', system);
    });
    it('should return a system with that key', function() {
      assert.equal(system, engine.getSystem('key'));
    });
  });
  describe('#removeSystem()', function() {
    var system;
    beforeEach(function() {
      system = {};
      engine.addSystem('key', system);
    });
    it('should remove reference to system', function() {
      engine.removeSystem('key');
      assert.equal(null, engine.getSystem('key'));
    });
    it('should call system.remove()', function(done) {
      system.remove = function(e) {
        assert.equal(engine, e);
        done();
      }
      engine.removeSystem('key');
    });
  });
  describe('#update()', function() {
    var system;
    beforeEach(function() {
      system = {};
      engine.addSystem('key', system);
    });
    it('should call system.update()', function(done) {
      system.update = function(delta) {
        assert.equal(12, delta);
        done();
      }
      engine.update(12);
    });
  });
});
