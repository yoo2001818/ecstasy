module.exports = {
  Action: require('./lib/Action.js'),
  ActionEngine: require('./lib/ActionEngine.js'),
  ActionSystem: require('./lib/ActionSystem.js'),
  BitSet: require('./lib/BitSet.js'),
  Component: require('./lib/Component.js'),
  ComponentGroup: require('./lib/ComponentGroup.js'),
  Engine: require('./lib/Engine.js'),
  Entity: require('./lib/Entity.js'),
  EntityBuilder: require('./lib/EntityBuilder.js'),
  EventEmitter: require('./lib/EventEmitter.js'),
  System: require('./lib/System.js'),
  SystemBuilder: require('./lib/SystemBuilder.js'),
  Turn: require('./lib/Turn.js'),
  TurnEngine: require('./lib/TurnEngine.js'),
  TurnSystem: require('./lib/TurnSystem.js')
};

// Export to global scope in web browsers
if(typeof window !== 'undefined') {
  for(var key in module.exports) {
    window[key] = module.exports[key];
  }
}
