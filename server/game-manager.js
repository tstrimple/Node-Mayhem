var debug = require('debug')('8bit-mayhem:game-manager');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Game = require('./game');
var async = require('async');

function GameManager(settings) {
  this.settings = settings || {};
  this.games = [];
  this.cleanupInterval = settings.cleanupInterval || 10000;
  setInterval(this.cleanupGames, this.cleanupInterval);
}

util.inherits(GameManager, EventEmitter);

GameManager.prototype.getGameById = function(id, callback) {
  async.detect(this.games, function(game, next) { next(game.id === id); }, callback);
}

GameManager.prototype.getGameByName = function(name, callback) {
  async.detect(this.games, function(game, next) { next(game.name === name); }, callback);
}

GameManager.prototype.createGame = function(name, connection, callback) {
  if(!game || !connection) {
    return callback('Invalid parameters');
  }

  this.getGameByName(name, function(game) {
    if(game) {
      return callback('A game with that name already exists.');
    }

    game = new Game(name, connection);
    this.games.push(game);
    return callback(null, game);
  });
};

GameManager.prototype.cleanupGames = function() {
  async.filter(this.games, function(game, next) { next(game.remove); }, function(games) {
    var removedGames = this.games.length - games.length;
    if(removedGames > 0) {
      this.games = games;
    }

    debug('cleanupGames', 'Removed ' + removedGames + ' games');
  }.bind(this));
}

module.exports = GameManager;
