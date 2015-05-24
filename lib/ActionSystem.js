var System = require('./System');

/**
 * Represents a System for a action based game.
 * ActionSystem manages ActionEngine's Entity by its own method.
 * @constructor
 * @extends System
 * @see Entity
 */
function TurnSystem() {
  System.call(this);
}

ActionSystem.prototype = Object.create(System.prototype);
ActionSystem.prototype.constructor = ActionSystem;

/**
 * Called when before action runs.
 * @param turn {Turn} - The current Turn if available.
 * @param action {Action} - The action about to run.
 */
ActionSystem.prototype.onPreAction = function(turn, action) {
  
}

/**
 * Called when the action runs.
 * @param turn {Turn} - The current Turn if available.
 * @param action {Action} - The action that has run.
 */
ActionSystem.prototype.onAction = function(turn, action) {
  
}

/**
 * Called when the new action is required to sent to the server.
 * @param turn {Turn} - The current Turn if available.
 * @param action {Action} - The action that has run.
 */
ActionSystem.prototype.sendAction = function(turn, action) {
  return false;
}


if(typeof module !== 'undefined') {
  module.exports = ActionSystem;
}
