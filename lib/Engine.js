var EventEmitter = require('./EventEmitter');
var ComponentGroup = require('./ComponentGroup');
var BitSet = require('./BitSet');
var Entity = require('./Entity');
var SystemBuilder = require('./SystemBuilder');
var DEFAULT_SYSTEM_PRIORITY = 1000;

/**
 * Represents an game Engine.
 * It's like hub of all the objects - {@link Entity}, {@link Component}, etc.
 * It contains all the Entity in the game, and all the Component used,
 * and all the System.
 * @constructor
 * @extends EventEmitter
 * @see Entity
 * @see Component
 * @see System
 * @see ComponentGroup
 */
function Engine() {
  EventEmitter.call(this);
  this._entities = {};
  this._entitiesArray = [];
  this._entityPos = 0;
  this._components = [];
  this._componentConstructors = {};
  this._componentPos = 0;
  this._componentGroups = [];
  this._componentGroupEntities = [];
  /**
   * Array of all the {@link System} in the Engine.
   * You shouldn't edit this array directly, use
   * {@link Engine#addSystem} and {@link Engine#removeSystem} instead.
   * @var {Array}
   */
  this.systems = [];
  this._systemTable = {};
  this._systemPos = 0;
  this._systemsSortRequired = false;
}

Engine.prototype = Object.create(EventEmitter.prototype);
Engine.prototype.constructor = Engine;

/**
 * Registers a {@link Component} type to the Engine.
 * This won't do anything if Component type is already registered.
 * @param key {String} - {@link Component}'s string key.
 * @param constructor {Object] - {@link Component}'s constructor.
 */
Engine.prototype.registerComponent = function(key, constructor) {
  this._componentConstructors[key] = constructor;
  if(this._components.indexOf(key) != -1) return;
  this._components.push(key);
  return this._componentPos ++;
}

Engine.prototype.c = Engine.prototype.registerComponent;

/**
 * Returns {@link Component}'s constructor registered in the Engine/
 * @param key {String} - {@link Component}'s string key.
 * @return the Component's constructor.
 */
Engine.prototype.getComponentConstructor = function(key) {
  return this._componentConstructors[key];
}

/**
 * Returns {@link Component} type's unique ID in the Engine.
 * This unique ID is used in {@link BitSet}'s bit position.
 * This will call {@link Engine#registerComponent} if needed.
 * @param key {String} - {@link Component}'s string key.
 * @return the Component's unique ID.
 */
Engine.prototype.getComponentBit = function(key) {
  var bitPos = this._components.indexOf(key);
  if(bitPos == -1) {
    return this.registerComponent(key);
  } else {
    return bitPos;
  }
}

/**
 * Returns a BitSet holding combination of {@link Component}s type's unique ID.
 * @param components {Array} - An array holding {@link Component} keys.
 * @return {BitSet} A BitSet holding combination of Components.
 */
Engine.prototype.getComponentsBitSet = function(components) {
  var bits = new BitSet();
  for(var i = 0; i < components.length; ++i) {
    bits.set(this.getComponentBit(components[i]), true);
  }
  return bits;
}

/**
 * Returns a new Entity ID to use.
 * This changes its value each time it's called.
 * @return {Number} An integer that is used for Entity's ID
 * @see Entity
 */
Engine.prototype.obtainEntityId = function() {
  return this._entityPos ++;
}

/**
 * Adds an Entity to the Engine.
 * @param entity {Entity} - An Entity to add
 * @fires Engine#entityAdded
 * @fires ComponentGroup#entityAdded
 */
Engine.prototype.addEntity = function(entity) {
  if(entity.id != null) return;
  entity.id = this.obtainEntityId();
  entity._engine = this;
  this._entities[entity.id] = entity;
  this._entitiesArray.push(entity);
  /**
   * This event is fired when a Entity has added to {@link Engine}.
   *
   * @event Engine#entityAdded
   * @type {Entity}
   */
  this.emit('entityAdded', entity);
  this.updateComponentGroup(entity);
  entity.on('componentAdded', this.updateComponentGroup, this);
  entity.on('componentRemoved', this.updateComponentGroup, this);
}

/**
 * Creates an empty Entity and adds to the Engine.
 * @return {Entity} an empty Entity.
 * @fires Engine#entityAdded
 */
Engine.prototype.createEntity = function() {
  var entity = new Entity(this);
  this.addEntity(entity);
  return entity;
}

Engine.prototype.e = function(id) {
  if(arguments.length === 0) {
    return this.createEntity();
  }
  if(typeof id === 'number') {
    return this.getEntity(id);
  }
  return this.getEntitiesFor.apply(this, arguments);
}

/**
 * Removes an Entity from the Engine.
 * @param entity {Entity} - An Entity to remove
 * @fires Engine#entityRemoved
 * @fires ComponentGroup#entityRemoved
 */
Engine.prototype.removeEntity = function(entity) {
  var entityPos = this._entitiesArray.indexOf(entity);
  if(entityPos == -1) return;
  delete this._entities[entity.id];
  this._entitiesArray.splice(entityPos, 1);
  /**
   * This event is fired when a Entity has removed from {@link Engine}.
   *
   * @event Engine#entityRemoved
   * @type {Entity}
   */
  this.emit('entityRemoved', entity);
  entity.removeListener('componentAdded', this.updateComponentGroup);
  entity.removeListener('componentRemoved', this.updateComponentGroup);
  // TODO Optimiziation
  for(var i = 0; i < this._componentGroups.length; ++i) {
    var componentGroup = this._componentGroups[i];
    if(entity.componentGroupBits.get(componentGroup.id)) {
      var componentEntities = this._componentGroupEntities[i];
      componentEntities.splice(componentEntities.indexOf(entity), 1);
      componentGroup.emit('entityRemoved', entity);
    }
  }
}

/**
 * Removes all {@link Entity} from the Engine.
 * @fires Engine#entityRemoved
 * @fires ComponentGroup#entityRemoved
 */
Engine.prototype.removeAllEntities = function(entity) {
  while(this._entitiesArray.length > 0) {
    this.removeEntity(this._entitiesArray[0]);
  }
}

/**
 * Returns an Entity with given ID.
 * This will return null if it can't be found.
 * @param id {Number} - An ID to find the Entity
 * @returns {Entity} The entity with given ID
 */
Engine.prototype.getEntity = function(id) {
  return this._entities[id];
}

/**
 * Returns an array of Entity.
 * It shouldn't be edited since the Engine uses it directly.
 * @returns {Array} An array holding {@link Entity}
 */
Engine.prototype.getEntities = function() {
  return this._entitiesArray;
}

/**
 * Updates the Entity to find if it matches {@link ComponentGroup}s' criteria.
 * @param entity {Entity} - the Entity to update
 * @private
 * @see ComponentGroup
 */
Engine.prototype.updateComponentGroup = function(entity) {
  for(var i = 0; i < this._componentGroups.length; ++i) {
    var componentGroup = this._componentGroups[i];
    if(componentGroup.matches(entity)) {
      if(!entity.componentGroupBits.get(componentGroup.id)) {
        // 추가
        entity.componentGroupBits.set(componentGroup.id, true);
        this._componentGroupEntities[i].push(entity);
        componentGroup.emit('entityAdded', entity);
      }
    } else {
      if(entity.componentGroupBits.get(componentGroup.id)) {
        // 삭제
        entity.componentGroupBits.set(componentGroup.id, false);
        var componentEntities = this._componentGroupEntities[i];
        componentEntities.splice(componentEntities.indexOf(entity), 1);
        componentGroup.emit('entityRemoved', entity);
      }
    }
  }
}

/**
 * Registers the ComponentGroup to the Engine.
 * Engine will check if an Entity matches ComponentGroup's criteria every time
 * when a Entity is added or removed.
 * @param componentGroup {ComponentGroup} - The ComponentGroup to register
 * @returns {Array} An array holding {@link Entity} matching its criteria
 * @fires ComponentGroup#entityAdded
 * @see Entity
 */
Engine.prototype.registerComponentGroup = function(componentGroup) {
  for(var i = 0 ; i < this._componentGroups.length; ++i) {
    if(this._componentGroups[i].equals(componentGroup)) {
      return this._componentGroupEntities[i];
    }
  }
  if(componentGroup.id != null && 
      this._componentGroups[componentGroup.id] == componentGroup) {
    return this._componentGroupEntities[componentGroup.id];
  }
  componentGroup.id = this._componentGroups.length;
  componentGroup._engine = this;
  this._componentGroups.push(componentGroup);
  var componentGroupEntity = [];
  this._componentGroupEntities.push(componentGroupEntity);
  // initialize componentGroup array
  this.getEntities().forEach(function(entity) {
    if(componentGroup.matches(entity)) {
      // 추가
      entity.componentGroupBits.set(componentGroup.id, true);
      componentGroupEntity.push(entity);
      componentGroup.emit('entityAdded', entity);
    }
  });
  return componentGroupEntity;
}

/**
 * Returns an array having {@link Entity} matching ComponentGroup's criteria.
 * The array will keep updated, so you can call this method only once
 * and check its contents if needed.
 * It's an alias function to {@link Engine#registerComponentGroup}
 * @param componentGroup {ComponentGroup} - The ComponentGroup
 * @returns {Array} An array holding {@link Entity} matching its criteria
 * @fires ComponentGroup#entityAdded
 * @see Engine#registerComponentGroup
 */
Engine.prototype.getEntitiesFor = function(componentGroup) {
  if(componentGroup instanceof ComponentGroup) {
    return this.registerComponentGroup(componentGroup);
  } else {
    // Build ComponentGroup with arguments
    var builder = ComponentGroup.createBuilder(this);
    builder.contain.apply(builder, arguments);
    var componentGroup = builder.build();
    return this.registerComponentGroup(componentGroup);
  }
}

/**
 * Searches ComponentGroup by its array.
 * @param entities {Array} An array of ComponentGroup
 * @returns {ComponentGroup} The ComponentGroup linked with the array
 */
Engine.prototype.getComponentGroup = function(entities) {
  return this._componentGroups[this._componentGroupEntities.indexOf(entities)];
}

/**
 * Adds the System to the Engine.
 * The System will be triggered when the {@link Engine#update} is called.
 * This will trigger {@link System#onAddedToEngine}.
 * @param key {String} - The System's string key
 * @param system {System} - The System to add
 */
Engine.prototype.addSystem = function(key, system) {
  if(this.systems.indexOf(system) != -1) return;
  this._systemTable[key] = system;
  system._id = this._systemPos ++;
  this.systems.push(system);
  if(typeof system.onAddedToEngine == 'function') {
    system.onAddedToEngine(this);
  }
  if(system.priority == null) {
    system.priority = DEFAULT_SYSTEM_PRIORITY;
  }
  system.engine = this;
  this._systemsSortRequired = true;
}

Engine.prototype.createSystem = function(key) {
  return new SystemBuilder(key, this);
}

Engine.prototype.s = function(key, system) {
  if(system == null) {
    if(this._systemTable[key] == null) return this.createSystem(key);
    return this.getSystem(key);
  }
  return this.addSystem(key, system);
}

/**
 * Returns the System registered to the Engine.
 * @param key {String} - The System's string key
 * @returns {System} The system registered to the Engine
 */
Engine.prototype.getSystem = function(key) {
  return this._systemTable[key];
}

/**
 * Removes the System from the Engine.
 * This will trigger {@link System#onRemovedFromEngine}.
 * @param key {String} - The System's string key to remove.
 */
Engine.prototype.removeSystem = function(key) {
  var system = this._systemTable[key];
  var systemPos = this.systems.indexOf(system);
  if(systemPos == -1) return;
  this.systems.splice(systemPos, 1);
  if(typeof system.onRemovedFromEngine == 'function') {
    system.onRemovedFromEngine(this);
  }
}

/**
 * Sorts the System array to match their priority.
 * @private
 * @see System
 */
Engine.prototype.sortSystems = function() {
  if(this._systemsSortRequired) {
    this.systems.sort(function(a, b) {
      if(a.priority > b.priority) {
        return 1;
      } else if(a.priority < b.priority) {
        return -1;
      } else {
        if(a._id > b._id) {
          return 1;
        } else if(a._id < b._id) {
          return -1;
        } else {
          return 0;
        }
      }
    });
    this._systemsSortRequired = false;
  }
}

/**
 * An update function called by every tick of the game.
 */
Engine.prototype.update = function(delta) {
  this.sortSystems();
  this.systems.forEach(function(system) {
    if(system.update) {
      system.update(delta);
    }
  })
}

if(typeof module !== 'undefined') {
  module.exports = Engine;
}
