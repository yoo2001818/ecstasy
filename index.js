module.exports = {
  Action: require('./src/Action.js'),
  ActionEngine: require('./src/ActionEngine.js'),
  ActionSystem: require('./src/ActionSystem.js'),
  BitSet: require('./src/BitSet.js'),
  Component: require('./src/Component.js'),
  ComponentGroup: require('./src/ComponentGroup.js'),
  Engine: require('./src/Engine.js'),
  Entity: require('./src/Entity.js'),
  EntityBuilder: require('./src/EntityBuilder.js'),
  EventEmitter: require('./src/EventEmitter.js'),
  System: require('./src/System.js'),
  SystemBuilder: require('./src/SystemBuilder.js'),
  Turn: require('./src/Turn.js'),
  TurnEngine: require('./src/TurnEngine.js'),
  TurnSystem: require('./src/TurnSystem.js')
};

// Export to global scope in web browsers
if(typeof window !== 'undefined') {
  for(var key in module.exports) {
    window[key] = module.exports[key];
  }
}
