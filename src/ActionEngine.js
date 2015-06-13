var Engine = require('./Engine');
 
/**
 * Represents an action based game engine.
 * It's like a normal ECS with Action.
 * @constructor
 * @extends Engine
 * @param {Boolean} [isServer=false] - Whether if it's a server or not
 * @see Action
 */
function ActionEngine(isServer) {
  Engine.call(this);
  /**
   * A boolean contains whether if it's a server or not.
   * @var {Boolean}
   */
  this.isServer = isServer || false;
  this._actions = {};
  this._actionQueue = [];
}

ActionEngine.prototype = Object.create(Engine.prototype);
ActionEngine.prototype.constructor = ActionEngine;

/* 
- Define Action in Engine
    engine.a('add', action)
- Create Action
    engine.a('add', player, entity, options)
- Run Action
    engine.a(action)
 */

ActionEngine.prototype.a = function(name, entity, player, options) {
  if(typeof name !== 'string') {
    return this.runAction(name);
  }
  if(arguments.length == 2 && typeof entity == 'function') {
    return this.defineAction(name, entity);
  }
  return this.createAction(name, entity, player, options);
}

ActionEngine.prototype.aa = function(name, entity, player, options) {
  return this.runAction(this.createAction(name, entity, player, options));
}

/**
 * Defines an {@link Action} type to the Engine.
 * @param name {String} - The name of the Action.
 * @param constructor {Function} - The constructor of the Action.
 */
ActionEngine.prototype.defineAction = function(name, constructor) {
  this._actions[name] = constructor;
  // TODO This isn't good way to do this, should be changed
  constructor.prototype.name = name;
}

/**
 * Returns the {@link Action}'s construtor with specified name.
 * @param name {String} - The name of the Action.
 * @returns {Function} The constructor of the Action.
 */
ActionEngine.prototype.getActionConstructor = function(name) {
  return this._actions[name];
}

/**
 * Creates a new {@link Action} using registered constructor.
 * @param name {String} - The name of the Action.
 * @param {Entity} entity - The entity associated with the action.
 * @param {Entity} player - The player who requested the action.
 * @param {Object} options - The arguments associated with the action.
 * @returns {Action} The created Action.
 */
ActionEngine.prototype.createAction = function(name, entity, player, options) {
  return new (this.getActionConstructor(name))(this, entity, player, options);
}

ActionEngine.prototype.getTurn = function() {
  return null;
}

/**
 * Runs the Action.
 * Action shouldn't have run yet if {@link ActionEngine#isServer} is true,
 * but it should have run on server and have {@link Action#result} if not.
 * @param action {Action} - The Action to run.
 * @fires ActionEngine#action
 * @fires ActionEngine#preAction
 */
ActionEngine.prototype.runAction = function(action) {
  var turn = this.getTurn();
  if(this.isServer) {
    if(action.result) {
      throw new Error('Action has already run');
    }
  } else {
    if(!action.result) {
      var handled = false;
      this.systems.forEach(function(system) {
        if(system.sendAction) {
          if(system.sendAction(turn, action, this)) handled = true;
        }
      }, this);
      if(!handled) throw new Error('Action hasn\'t run on server yet');
      return;
    }
  }
  var firstCall = this._actionQueue.length == 0;
  /**
   * This event is fired before the action executes.
   * @event ActionEngine#preAction
   * @property {Action} 1 - The Action object.
   */
  this.emit('preAction', turn, action, this);
  this.systems.forEach(function(system) {
    if(system.preAction) {
      system.preAction(turn, action, this);
    }
  }, this);
  if(turn) {
    turn.addAction(action);
  }
  this._actionQueue.push([turn, action, this]);
  try {
    action.run(this);
    if(action.result == null) {
      throw new Error('Action should set result after running');
    }
  } finally {
    while(firstCall && this._actionQueue.length > 0) {
      var obj = this._actionQueue.shift();
      /**
       * This event is fired when the action executes.
       * @event TurnEngine#action
       * @property {Turn} 0 - The current Turn.
       * @property {Action} 1 - The Action object.
       */
      this.emit('action', obj[0], obj[1], obj[2]);
      this.systems.forEach(function(system) {
        if(system.action) {
          system.action(obj[0], obj[1], obj[2]);
        }
      }, this);
    }
  }
  return action;
}

if(typeof module !== 'undefined') {
  module.exports = ActionEngine;
}
