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

### engine.e(template)

Returns new Entity populated with the template.

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

If the system doesn't exist, it returns a new SystemBuilder with that key.

### engine.s(key, system)

Registers the System to the engine.

### engine.removeSystem(key)

Removes the System from the engine.

## Etc

### engine.serialize()

Returns serialized engine object.

Systems and Components won't be included in serialized object, so you should
prepare them before deserializing.

### engine.deserialize(object)

Deserializes the serialized object and places on the provided engine.

### engine.update(delta)

Calls System.update(delta) on the systems.
Delta should be the delay between two update() calls, but developers can use
whatever they want.

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

## Properties

### entity.id

The ID of the entity.

This will be given by Engine, and it shouldn't be edited after being added to
the Engine.

# Component

Component is just a plain old Javascript object, you can use anything you want.
But you need to use serializable object if you're going to serialize the Engine.

Since `entity.c(key, options)` requires the constructor of the component
added in engine, you won't be able to use that function if you're going to
use regular objects. Use `entity.add(key, component)` instead, though it's not
recommended.

# System

System is a collection of functions that is run by every event.

If you don't define the function in the system, the Engine simply won't run
those functions.
You can use plain old Javascript object holding functions as Systems, because
System class doesn't have any defined methods that does something.

## Functions

### system.add(engine)

Called when the system is added to the Engine.

You should do initialization for the system in here, such as calling
```javascript
this.engine = engine;
this.entities = engine.e('test');
```

### system.remove(engine)

Called when the system is removed from the Engine.

### system.update(delta)

Called when the engine.update() is called.
Delta should be the delay between two update() calls, but developers can use
whatever they want.

## Properties

### system.priority

Sets the priority of the system. Systems with lower priority will be executed
first. Note that this doesn't set the priority of system.add or system.remove.
