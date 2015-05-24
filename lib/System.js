/**
 * Represents a System.
 * System manages Engine's Entity by its own method.
 * @constructor
 * @see System
 * @see Entity
 */
function System() {
  
}

/**
 * Called when the System is added to the Engine.
 * @param engine {Engine} - The Engine added to.
 */
System.prototype.add = function(engine) {
  
}

/**
 * Called when the System is removed from the Engine.
 * @param engine {Engine} - The Engine removed from.
 */
System.prototype.remove = function(engine) {
  
}

/**
 * Called when the {@link Engine#update} is called.
 */
System.prototype.update = function() {
  
}

if(typeof module !== 'undefined') {
  module.exports = System;
}
