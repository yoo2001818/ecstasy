ecstasy
=======

[![Build Status](https://travis-ci.org/yoo2001818/ecstasy.svg?branch=master)](https://travis-ci.org/yoo2001818/ecstasy)
[![Coverage Status](https://coveralls.io/repos/yoo2001818/ecstasy/badge.svg?branch=master)](https://coveralls.io/r/yoo2001818/ecstasy)

A fast Entity-Component-System framework for Javascript.

Additonally it supports Action and Turns - it's really useful when you're making
turn based strategy game or multiplayer game.

Documentation
=============

You can find the documentation [here](http://yoo2001818.github.io/ecstasy/).

Examples
========

Simple Example
--------------
```javascript
var Engine = require('ecstasy').Engine;
var engine = new Engine();

// Define components
engine.c('pos', function PositionComponent(options) {
  this.x = options.x || 0;
  this.y = options.y || 0;
});
engine.c('vel', function VelocityComponent(options) {
  this.x = options.x || 0;
  this.y = options.y || 0;
});

// Define systems
engine.s('vel').add(function(engine) {
  this.engine = engine;
  this.entities = engine.e('pos', 'vel');
}).update(function(delta) {
  this.entities.forEach(function(entity) {
    entity.c('pos').x += entity.c('vel').x;
    entity.c('pos').y += entity.c('vel').y;
  });
});

// Define entities
engine.e()
  .c('pos', {x: 200, y: 200})
  .c('vel', {x: 3, y: 3});

setInterval(function() {
  engine.update(12);
}, 12);
```
