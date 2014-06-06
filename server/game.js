var Guid = require('guid');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var debug = require('debug')('8bit-mayhem:game');
var Player = require('./player');

function Game(name) {
  this.gameId = Guid.raw();
  this.name = name;
  this.map = 'map_name_here';
  this.players = {};
  this.playerReconnectTimeout = 10000;
  this.gameInterval = null;
}

util.inherits(Game, EventEmitter);

Game.prototype.getDetails = function() {
  return {
    id: this.gameId,
    name: this.name,
    map: this.map,
    players: this.players.length,
    password: false,
    url: '/game/' + id
  };
}

Game.prototype.update = function() {
  var updatedPlayers = [];
  for(var clientId in this.players) {
    var player = this.players[clientId];
    player.update();
    if(player.dirty) {
      updatedPlayers.push(player);
    }
  }
  // update projectiles
  // update objects
  this.emit('update', 0, updatedPlayers);
}

Game.prototype.addPlayer = function(clientId, name, callback) {
  callback = callback || function() {};

  if(this.players[clientId]) {
    return callback('The player is already in this game');
  }

  var player = new Player(clientId, name);
  player.position.x = 400;
  player.position.y = 96;
  this.players[clientId] = player;

  if(!this.gameInterval) {
    //  the game loop isn't running. Start it since a player joined.
    this.gameInterval = setInterval(this.update.bind(this), 30);
  }
  debug('player added', player);
  return callback(null, player);
}

Game.prototype.removePlayer = function(clientId, callback) {
  callback = callback || function() {};

  if(!this.players[clientId]) {
    return callback('The player is not in this game');
  }

  var player = this.players[clientId];
  delete this.players[clientId];

  if(!this.players) {
    //  stop the game loop, the last player left
    clearInterval(this.gameInterval);
    this.gameInterval = null;
  }

  return callback(null, player);
}

Game.prototype.removeTimeout = function(clientId) {
  var player = this.players[clientId];
  if(player && player.timeout) {
    clearTimeout(player.timeout);
  }
}

Game.prototype.timeoutPlayer = function(clientId, callback) {
  var player = this.players[clientId];
  if(!player) {
    return callback('The player is not in this game');
  }

  this.removeTimeout(clientId); // clear any existing timeouts

  player.timeout = setTimeout(function() {
    this.removePlayer(clientId, callback);
  }.bind(this), this.playerReconnectTimeout);
}

module.exports = Game;
