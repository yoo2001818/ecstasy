var ActionSystem = require('./ActionSystem');

/**
 * Represents a System for a turn based game.
 * TurnSystem manages TurnEngine's Entity by its own method.
 * @constructor
 * @extends ActionSystem
 * @see Entity
 */
function TurnSystem() {
  ActionSystem.call(this);
}

TurnSystem.prototype = Object.create(ActionSystem.prototype);
TurnSystem.prototype.constructor = TurnSystem;

/**
 * Called when the game starts.
 * @param turn {Turn} - The current Turn.
 */
TurnSystem.prototype.onInit = function(turn) {
  
}

/**
 * Called when the turn changes.
 * @param turn {Turn} - The current Turn.
 */
TurnSystem.prototype.onTurn = function(turn) {
  
}

/**
 * Called when the sequence id changes.
 * @param turn {Turn} - The current Turn.
 */
TurnSystem.prototype.onSequence = function(turn) {
  
}


if(typeof module !== 'undefined') {
  module.exports = TurnSystem;
}
