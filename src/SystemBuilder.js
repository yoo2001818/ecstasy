/*
 * A helper class to create a System.
 */

function SystemBuilder(key, engine) {
  this.engine = engine;
  this.key = key;
  this.system = {};
  if(engine && key) {
    engine.addSystem(key, this.system);
  }
}

SystemBuilder.prototype.add = function(callback) {
  this.system.add = callback;
  callback.call(this.system, this.engine);
  return this;
}

SystemBuilder.prototype.remove = function(callback) {
  this.system.remove = callback;
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
  this.system.init = callback;
  return this;
}

SystemBuilder.prototype.turn = function(callback) {
  this.system.turn = callback;
  return this;
}

SystemBuilder.prototype.sequence = function(callback) {
  this.system.sequence = callback;
  return this;
}

SystemBuilder.prototype.preAction = function(callback) {
  this.system.preAction = callback;
  return this;
}

SystemBuilder.prototype.action = function(callback) {
  this.system.action = callback;
  return this;
}

SystemBuilder.prototype.sendAction = function(callback) {
  this.system.sendAction = callback;
  return this;
}

// Done, deprecated.
SystemBuilder.prototype.done = function() {
  /* if(this.engine && this.key) {
    this.engine.addSystem(this.key, this.system);
  } */
  return this.system;
}

if(typeof module !== 'undefined') {
  module.exports = SystemBuilder;
}
