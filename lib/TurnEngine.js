var ActionEngine = require('./ActionEngine');
var ComponentGroup = require('./ComponentGroup');
var Turn = require('./Turn');
 
/**
 * Represents an turn based game engine.
 * It's like a normal ECS with Action and Turn.
 * @constructor
 * @extends ActionEngine
 * @param {Boolean} [isServer=false] - Whether if it's a server or not
 * @see Action
 * @see Turn
 */
function TurnEngine(isServer) {
  ActionEngine.call(this, isServer);
  /**
   * An array holding all the {@link Turn} used in the game.
   * @var {Array}
   * @see Turn
   */
  this.turns = [];
  /**
   * An arraying holding all the player {@link Entity} in the game.
   * @var {Array}
   * @see Entity
   */
  this.players = this.getEntitiesFor('player');
}

TurnEngine.prototype = Object.create(ActionEngine.prototype);
TurnEngine.prototype.constructor = TurnEngine;

/**
 * Returns current Turn object.
 * It'll call {@link TurnEngine#nextTurn} if the game hasn't started yet.
 * @returns {Turn} The current Turn
 */
TurnEngine.prototype.getTurn = function() {
  if(this.turns.length == 0) {
    return this.nextTurn();
  }
  return this.turns[this.turns.length-1];
}

/**
 * Finishes the current Turn and starts next Turn.
 * @returns {Turn} The current Turn
 * @throws If there are no players in the game
 * @fires TurnEngine#gameInit
 * @fires TurnEngine#sequenceNext
 * @fires TurnEngine#turnNext
 */
TurnEngine.prototype.nextTurn = function() {
  this.sortSystems();
  if(this.turns.length == 0) {
    if(this.players[0] == null) {
      throw new Error('There should be at least one player in the game');
    }
    var turn = new Turn(0, 0, 0, this.players[0]);
    this.turns.push(turn);
    /**
     * This event is fired when the game starts.
     *
     * @event TurnEngine#gameInit
     * @type {Turn}
     */
    this.emit('gameInit', turn, this);
    /**
     * This event is fired when the sequence changes.
     *
     * @event TurnEngine#sequenceNext
     * @type {Turn}
     */
    this.emit('sequenceNext', turn, this);
    /**
     * This event is fired when the turn changes.
     *
     * @event TurnEngine#turnNext
     * @type {Turn}
     */
    this.emit('turnNext', turn, this);
    this.systems.forEach(function(system) {
      if(system.onInit) {
        system.onInit(turn, this);
      }
    }, this);
    this.systems.forEach(function(system) {
      if(system.onSequence) {
        system.onSequence(turn, this);
      }
    }, this);
    this.systems.forEach(function(system) {
      if(system.onTurn) {
        system.onTurn(turn, this);
      }
    }, this);
    return turn;
  }
  // 원래 있던 턴 객체의 플레이어 인덱스 + 1
  var prevTurn = this.getTurn();
  var seqId = prevTurn.seqId;
  var id = prevTurn.id;
  var order = this.players.indexOf(prevTurn.player) + 1;
  if(order >= this.players.length) {
    seqId ++;
    order = 0;
  }
  var turn = new Turn(id + 1, order, seqId, this.players[order]);
  this.turns.push(turn);
  if(order == 0) {
    this.emit('sequenceNext', turn, this);
    this.systems.forEach(function(system) {
      if(system.onSequence) {
        system.onSequence(turn, this);
      }
    }, this);
  }
  this.emit('turnNext', turn, this);
  this.systems.forEach(function(system) {
    if(system.onTurn) {
      system.onTurn(turn, this);
    }
  }, this);
  return turn;
}

if(typeof module !== 'undefined') {
  module.exports = TurnEngine;
}
