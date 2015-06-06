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
  describe('#getComponentName()', function() {
    it('should return name correctly', function() {
      for(var i = 0; i < 100; ++i) {
        engine.c("c_"+i, "c_"+i);
      }
      for(var i = 0; i < 100; ++i) {
        assert.equal("c_"+i, engine.getComponentName(i));
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
    it('should add entity with defined entity id', function() {
      var entity2 = new ecstasy.Entity(engine);
      entity2.id = 3;
      engine.addEntity(entity2);
      assert(entity2.listeners('componentAdded').length == 1);
      assert(entity2.listeners('componentRemoved').length == 1);
      entity.id = 6;
      engine.addEntity(entity);
      assert(entity.listeners('componentAdded').length == 1);
      assert(entity.listeners('componentRemoved').length == 1);
    });
    it('should add event listeners', function() {
      engine.addEntity(entity);
      assert(entity.listeners('componentAdded').length == 1);
      assert(entity.listeners('componentRemoved').length == 1);
    });
    it('should emit entityAdded', function(done) {
      engine.on('entityAdded', function(e) {
        assert(entity, e);
        done();
      });
      engine.addEntity(entity);
    });
    it('should add to componentGroups', function() {
      var entities = engine.e('hello');
      entity.add('hello', {});
      engine.addEntity(entity);
      assert.equal(entity, entities[0]);
    });
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
    it('should remove event listeners', function() {
      engine.removeEntity(entity);
      assert(entity.listeners('componentAdded').length == 0);
      assert(entity.listeners('componentRemoved').length == 0);
    });
    it('should remove from componentGroups', function() {
      var entities = engine.e('hello');
      entity.add('hello', {});
      assert.equal(entity, entities[0]);
      engine.removeEntity(entity);
      assert.equal(null, entities[0]);
    });
  });
  describe('#e()', function() {
    var entity;
    beforeEach(function() {
      engine.c('test', function() {});
      entity = engine.e().c('test', {});
    });
    it('should create new entity if there is no arguments', function() {
      assert.equal(1, engine.e().id);
      assert(engine.e() instanceof ecstasy.Entity);
    });
    it('should get an entity with that id if a number is given', function() {
      assert.equal(entity, engine.e(0));
    });
    it('should call getEntitiesFor otherwise', function() {
      assert.deepEqual([entity], engine.e('test'));
    });
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
    it('should not register duplicate instances', function() {
      var p1 = engine.registerComponentGroup(group);
      var p2 = engine.registerComponentGroup(group);
      assert.deepEqual([entity], p1);
      assert.deepEqual([entity], p2);
      assert.equal(p1, p2);
    });
    it('should not register different duplicate instances', function() {
      var groupDup = ecstasy.ComponentGroup.createBuilder(engine)
        .contain('test').build();
      var p1 = engine.registerComponentGroup(group);
      var p2 = engine.registerComponentGroup(groupDup);
      assert.deepEqual([entity], p1);
      assert.deepEqual([entity], p2);
      assert.equal(p1, p2);
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
  describe('#updateComponentGroup()', function() {
    var entity, entities;
    beforeEach(function() {
      entity = engine.e();
      entities = engine.e('test');
    });
    it('should add to componentGroups if matches', function() {
      entity.add('test', {});
      assert.equal(entity, entities[0]);
    });
    it('should remove from componentGroups if not matches anymore', function() {
      entity.add('test', {});
      assert.equal(entity, entities[0]);
      entity.remove('test');
      assert.equal(null, entities[0]);
    });
  });
  describe('#s()', function() {
    it('should return SystemBuilder if that key doesn\'t exist', function() {
      assert(engine.s('test') instanceof ecstasy.SystemBuilder);
    });
    it('should return the System if that key exists', function() {
      var system = {};
      engine.addSystem('test', system);
      assert.equal(system, engine.s('test'));
    });
    it('should add the System otherwise', function() {
      var system = {};
      engine.s('test', system);
      assert.equal(system, engine.s('test'));
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
    it('should set _systemsSortRequired', function() {
      engine.addSystem('key', system);
      assert(engine._systemsSortRequired);
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
  describe('#sortSystem()', function() {
    var system1, system2, system3;
    beforeEach(function() {
      system1 = {priority: 0};
      system2 = {priority: 0};
      system3 = {priority: 0};
      system4 = {priority: 100};
    });
    it('should sort the systems array in right order', function() {
      engine.addSystem('4', system4);
      engine.addSystem('3', system3);
      engine.addSystem('2', system2);
      engine.addSystem('1', system1);
      engine.sortSystems();
      assert.equal(system3, engine.systems[0]);
      assert.equal(system2, engine.systems[1]);
      assert.equal(system1, engine.systems[2]);
      assert.equal(system4, engine.systems[3]);
    });
    it('should sort the systems array in right order', function() {
      engine.addSystem('1', system1);
      engine.addSystem('2', system2);
      engine.addSystem('3', system3);
      engine.addSystem('4', system4);
      engine.sortSystems();
      assert.equal(system1, engine.systems[0]);
      assert.equal(system2, engine.systems[1]);
      assert.equal(system3, engine.systems[2]);
      assert.equal(system4, engine.systems[3]);
    });
    it('should sort the systems array in right order', function() {
      engine.addSystem('1', system1);
      engine.addSystem('2', system2);
      engine.addSystem('3', system3);
      system1._id = 2;
      system3._id = 0;
      engine.sortSystems();
      assert.equal(system3, engine.systems[0]);
      assert.equal(system2, engine.systems[1]);
      assert.equal(system1, engine.systems[2]);
    });
    it('should sort the systems array in right order', function() {
      engine.addSystem('1', system1);
      engine.addSystem('2', system2);
      engine.addSystem('3', system3);
      system2._id = 0;
      engine.sortSystems();
      assert.equal(system1, engine.systems[0]);
      assert.equal(system2, engine.systems[1]);
      assert.equal(system3, engine.systems[2]);
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
  describe('#serialize()', function() {
    it('should serialize engine correctly', function() {
      // I don't think systems and components should be serialized
      engine.c('test', function() {this.data = '11'});
      engine.e().c('test', {});
      assert.deepEqual({
        entities: [
          {
            id: 0,
            components: {
              'test': {
                data: '11'
              }
            }
          }
        ],
        entityPos: 1
      }, engine.serialize());
    });
  });
  describe('#deserialize()', function() {
    it('should deserialize engine correctly', function() {
      engine.c('test', function() {this.data = '11'});
      engine.deserialize({
        entities: [
          {
            id: 0,
            components: {
              'test': {
                data: '11'
              }
            }
          }
        ],
        entityPos: 1
      });
      assert.deepEqual({
        data: '11'
      }, engine.e(0).c('test'));
    });
  });
});
