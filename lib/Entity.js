var EventEmitter = require('./EventEmitter');
var BitSet = require('./BitSet');

/**
 * Represents a Entity.
 * Entity is a simple object that holds {@link Component}.
 * @constructor
 * @extends EventEmitter
 * @param engine {Engine} - The Engine associated with this object.
 */
function Entity(engine) {
  EventEmitter.call(this);
  /**
   * The ID of this object.
   * This will be given by Engine, and it shouldn't be edited.
   * @readonly
   * @var {Number}
   */
  this.id = null;
  /**
   * The Engine associated with this object.
   * @private
   * @var {Engine}
   */
  this._engine = engine;
  /**
   * The BitSet holding information about what kind of Component this has.
   * @var {BitSet}
   */
  this.componentBits = new BitSet();
  /**
   * The BitSet holding information about what ComponentGroup this matches.
   * @var {BitSet}
   */
  this.componentGroupBits = new BitSet();
  /**
   * The key-value storage of Components.
   * @var {Object}
   */
  this.components = {};
  /**
   * The array of Components.
   * @var {Array}
   */
  this.componentsArray = [];
}

Entity.prototype = Object.create(EventEmitter.prototype);
Entity.prototype.constructor = Entity;

/**
 * Adds the Component to the Entity.
 * @param key {String} - The key of the Component.
 * @param component {Component} - The Component to add.
 * @fires Entity#componentAdded
 */
Entity.prototype.add = function(key, component) {
  var bitPos = this._engine.getComponentBit(key);
  this.componentBits.set(bitPos, true);
  this.components[bitPos] = component;
  this.componentsArray.push(component);
  /**
   * This event is fired when a Component is added to the Entity.
   * @event Entity#componentAdded
   * @property {Entity} 0 - the Entity.
   * @property {String} 1 - the Component key added to Entity.
   * @property {Component} 2 - the Component added to Entity.
   */
  this.emit('componentAdded', this, key, component);
}

/**
 * Creates new Component with the args and adds to the Entity.
 * @param key {String} - The key of the Component.
 * @param args {Object} - A key-value storage to create the Component.
 * @return {Entity} the Entity to allow chains.
 */
Entity.prototype.create = function(key, args) {
  var constructor = this._engine.getComponentConstructor(key);
  var component = new constructor(args);
  this.add(key, component);
  return this;
}

Entity.prototype.c = function(key, args) {
  if(args == null) return this.get(key);
  return this.create(key, args);
}

/**
 * Removes the Component from the Entity.
 * @param key {String} - The key of the Component.
 * @fires Entity#componentRemoved
 */
Entity.prototype.remove = function(key) {
  var bitPos = this._engine.getComponentBit(key);
  this.componentBits.set(bitPos, false);
  var orig = this.components[bitPos];
  this.componentsArray.splice(this.componentsArray.indexOf(orig), 1);
  delete this.components[bitPos];
  /**
   * This event is fired when a Component is removed from the Entity.
   * @event Entity#componentRemoved
   * @property {Entity} 0 - the Entity.
   * @property {String} 1 - the Component key removed from the Entity.
   */
  this.emit('componentRemoved', this, key);
}

/**
 * Removes all the {@link Component} from the Entity.
 */
Entity.prototype.removeAll = function() {
  while(this.componentsArray.length > 0) {
    this.remove(this.componentsArray[0]);
  }
}

/**
 * Returns the Component which this Entity has.
 * @param key {String} - The key of the Component.
 * @returns {Component} The component.
 */
Entity.prototype.get = function(key) {
  var bitPos = this._engine.getComponentBit(key);
  return this.components[bitPos];
}

/**
 * Returns an array of this Entity's {@link Component}s.
 * @returns {Array} An array of Components.
 */
Entity.prototype.getComponents = function() {
  return this.componentsArray;
}

/**
 * Checks whether if this Entity has the Component.
 * @param key {String} - The key of the Component to check.
 * @returns {Boolean} Whether if this Entity has the Component.
 */
Entity.prototype.has = function(key) {
  var bitPos = this._engine.getComponentBit(key);
  return this.componentBits.get(bitPos);
}

if(typeof module !== 'undefined') {
  module.exports = Entity;
}
