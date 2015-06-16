Concepts
========

This describes the basic concepts of the framework.

Ecstasy is an Entity-component-system framework, which is flexable and
extendable.

Entity
------

Entity is an object holding sets of Components. 

Component
---------

Component is an serializable object (a.k.a. data bucket), which adds additional
behavior or functionality.

System
------

System is a collection of functions that is run by every update (or event).
It iterates through the list of Entities, and alters them if required.

Since iterating whole list of entities is expensive, Ecstasy provides a way to
'cache' the list of required Entities: ComponentGroup.

Engine
------

Engine stores all the Entity, Component, System used in the game.

Engine itself can be serialized, which means the whole state can be stored/sent.
You can save them to a file, or send to other clients/server.

ComponentGroup
-------------

ComponentGroup is a search criteria for finding Entities.

ComponentGroup has three BitSet which will be used to search Entity:
contain, intersect, exclude.

- contain will only match if a Entity has all the Component.
- intersect will match if a Entity has at least one of the Component.
- exclude will match if a Entity doesn't have a Component in them.

Action
------

Action represents a single 'action' issued by a player, system, or action.
It is typically used in multiplayer game.
It can be serialized and sent to other clients/server, and can be run on them.

With Action, you can greatly simplify the protocol part of the code.
Furthermore, you can make replay file if you want to.

If Action is doing something random (result should be set by the server),
on the server side, you can set the result, and on the client side, you can
alter the entities by Action's result.

Actions on client side shouldn't issue another Action, only server should do it.

Except these situations, the code between clients and servers can be shared.

Turn
----

Turn represents a 'turn' in turn based multiplayer game, such as tabletop game.
In turn based game, only a single player can issue an action and other players
should wait until the turn ends.
