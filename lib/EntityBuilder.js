var EntityTemplate = require('./EntityTemplate');
var Entity = require('./Entity'); 

var EntityBuilder = {};

function deepCopy(src, dest) {
  for(var i in src) {
    if(typeof src[i] == 'object' && !Array.isArray(src[i])) {
      if(dest[i] == null) dest[i] = {};
      deepCopy(src[i], dest[i]);
    } else {
      dest[i] = src[i];
    }
  }
  return dest;
}

EntityBuilder.getEntityTemplate = function(template) {
  var origin = EntityTemplate[template];
  if(origin == null) return {};
  var obj = {};
  if(origin['prototype']) {
    var protoObj = EntityBuilder.getEntityTemplate(origin['prototype']);
    deepCopy(protoObj, obj);
  }
  deepCopy(origin, obj);
  delete obj['prototype'];
  return obj;
}

EntityBuilder.buildEntity = function(engine, template) {
  var entity = new Entity(engine);
  for(var key in template) {
    var constructor = engine.getComponentConstructor(key);
    if(constructor) {
      var component = new constructor(template[key]);
      entity.add(template[key], component);
    } else {
      throw new Error('Component '+key+' not found');
    }
  }
  return entity;
}

if(typeof module !== 'undefined') {
  module.exports = EntityBuilder;
}
