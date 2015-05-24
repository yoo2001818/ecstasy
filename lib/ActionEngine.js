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
  /**
   * An array holding all the {@link Action} used in the game.
   * @var {Array}
   * @see Action
   */
  this.actions = [];
  this._actions = {};
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

ActionEngine.prototype.a = function(name, player, entity, options) {
  if(typeof name !== 'string') {
    return this.runAction(name);
  }
  if(arguments.length == 2 && typeof player == 'function') {
    return this.defineAction(name, player);
  }
  return this.createAction(name, player, entity, options);
}

ActionEngine.prototype.aa = function(name, player, entity, options) {
  return this.runAction(this.createAction(name, player, entity, options));
}

ActionEngine.prototype.defineAction = function(name, constructor) {
  this._actions[name] = constructor;
}

ActionEngine.prototype.getActionConstructor = function(name) {
  return this._actions[name];
}

ActionEngine.prototype.createAction = function(name, player, entity, options) {
  return new (this.getActionConstructor(name))(player, entity, options);
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
  /**
   * This event is fired before the action executes.
   * @event ActionEngine#preAction
   * @property {Action} 1 - The Action object.
   */
  this.emit('preAction', turn, action, this);
  this.systems.forEach(function(system) {
    if(system.onPreAction) {
      system.onPreAction(turn, action, this);
    }
  }, this);
  if(turn) {
    turn.addAction(action);
  } else {
    this.actions.push(action);
  }
  action.run(this);
  /**
   * This event is fired when the action executes.
   * @event TurnEngine#action
   * @property {Turn} 0 - The current Turn.
   * @property {Action} 1 - The Action object.
   */
  this.emit('action', turn, action, this);
  this.systems.forEach(function(system) {
    if(system.onAction) {
      system.onAction(turn, action, this);
    }
  }, this);
  return action.result;
}

if(typeof module !== 'undefined') {
  module.exports = ActionEngine;
}
