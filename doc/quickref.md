Quick Reference
===============

This page is the quick reference of the framework.

This only include basic features of the engine. If you need detailed
documentation, you can find full documentation
[here](http://yoo2001818.github.io/ecstasy/).

# Engine

Engine stores all the Entity, Component, System used in the game.

## Entity functions

### engine.e()

Adds an empty Entity to the engine and returns it.

### engine.e(id)

Returns the Entity with that ID, or null if not found.

### engine.e(components...)

Returns the Entity having all the components in arguments.

### engine.addEntity(entity)

Adds given Entity to the engine.

### engine.removeEntity(entity)

Removes given Entity from the engine.

### engine.getEntities()

Returns an array having all the entities in the engine.

## Component functions

### engine.c(key, constructor)

Registers a Component type to the Engine.

This will rewrite the constructor to the engine if the component is already
registered before. This is expected behavior.

## System functions

### engine.s(key)

If the system with that key exist in the engine, it returns that System.

If the system doesn't exist, it returns a new SystemBuilder with that
key.

### engine.s(key, system)

Registers the System to the engine.

### engine.removeSystem(key)

Removes the System from the engine.

## Etc 

### engine.serialize()

Returns serialized engine object. Systems and Components won't be included in
serialized object, so you should prepare them before deserializing.

### engine.deserialize(object)

Deserializes the serialized object and places on the provided engine.

### engine.update(delta)

Calls System.update(delta) on the systems.

# Entity

Entity is an object holding sets of Components.

## Component Functions

### entity.c(key)

Returns the Component with that key.

### entity.c(key, options)

Creates the Component with the options and returns the Entity itself to make it
chainable.

### entity.add(key, component)

Adds the Component to the Entity.

### entity.remove(key)

Removes the Component from the Entity.

## Serialize functions

### entity.serialize()

Returns serialized entity object.

### Entity.deserialize(engine, data) -static-

Returns new deserialized Entity object.


