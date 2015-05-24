/**
 * Represents a player in the game.
 * This is basic implementation, You can change the player component from
 * {@link TurnEngine}.
 * @constructor
 * @extends Component
 * @param args.id {Number} - The player's ID
 * @param args.name {String} - The player's name
 */
function PlayerComponent(args) {
  /**
   * The player's ID.
   * @var {Number}
   */
  this.id = args.id;
  /**
   * The player's name.
   * @var {String}
   */
  this.name = args.name;
}

if(typeof module !== 'undefined') {
  module.exports = PlayerComponent;
}
