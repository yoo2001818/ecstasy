/*
 * A helper class to create a System.
 */

function SystemBuilder(key, engine) {
  this.engine = engine;
  this.key = key;
  this.system = {};
}

SystemBuilder.prototype.add = function(callback) {
  this.system.onAddedToEngine = callback;
  return this;
}

SystemBuilder.prototype.remove = function(callback) {
  this.system.onRemovedFromEngine = callback;
  return this;
}

SystemBuilder.prototype.update = function(callback) {
  this.system.update = callback;
  return this;
}

SystemBuilder.prototype.priority = function(priority) {
  this.system.priority = priority;
  return this;
}

// TurnSystem

SystemBuilder.prototype.init = function(callback) {
  this.system.onInit = callback;
  return this;
}

SystemBuilder.prototype.turn = function(callback) {
  this.system.onTurn = callback;
  return this;
}

SystemBuilder.prototype.sequence = function(callback) {
  this.system.onSequence = callback;
  return this;
}

SystemBuilder.prototype.preAction = function(callback) {
  this.system.onPreAction = callback;
  return this;
}

SystemBuilder.prototype.action = function(callback) {
  this.system.onAction = callback;
  return this;
}

SystemBuilder.prototype.sendAction = function(callback) {
  this.system.sendAction = callback;
  return this;
}

// Done
SystemBuilder.prototype.done = function() {
  if(this.engine && this.key) {
    this.engine.addSystem(this.key, this.system);
  }
  return this.system;
}

if(typeof module !== 'undefined') {
  module.exports = SystemBuilder;
}
