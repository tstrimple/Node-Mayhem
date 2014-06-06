var game = require('./game');
var input = require('./input');
var debug = require('debug')('8bit-mayhem:index');
var io = require('socket.io-client');
var cookie = require('cookie-cutter');
var clientId = cookie.get('clientId');

if(!clientId) {
  var Guid = require('guid');
  clientId = Guid.raw();
  cookie.set('clientId', clientId);
}

var socket = io.connect('', { query: 'clientId=' + clientId });
debug('client connecting', clientId);

window.addEventListener('load', function() {
  me.input.registerPointerEvent('pointerdown', me.game.viewport, input.touchStart.bind(input), true);
  me.input.registerPointerEvent('pointermove', me.game.viewport, input.touchMove.bind(input), true);
  me.input.registerPointerEvent('pointerup', me.game.viewport, input.touchEnd.bind(input), true);

  setTimeout(function() {
    window.scrollTo(0, 1);
  }, 0);
});

input.on('move-start', socket.emit.bind(socket, 'move-start'));
input.on('move', socket.emit.bind(socket, 'move'));
input.on('move-end', socket.emit.bind(socket, 'move-end'));

input.on('shoot-start', socket.emit.bind(socket, 'shoot-start'));
input.on('shoot', socket.emit.bind(socket, 'shoot'));
input.on('shoot-end', socket.emit.bind(socket, 'shoot-end'));

window.onReady(function onReady() {
  game.onload();
  socket.emit('create-game', 'my test game');
});

game.socket = socket;

socket.on('error', console.error);

socket.on('game-created', function(game) {
  socket.emit('join-game', game.gameId, 'fred');
});

socket.on('update-game', function(delta, players) {
  for(var i = 0; i < players.length; i++) {
    var server = players[i];
    var local = game.players[server.clientId];
    local.position.x = server.position.x;
    local.position.y = server.position.y;
    local.velocity.x = server.velocity.x;
    local.velocity.y = server.velocity.y;
  }
});

socket.on('player-joined', function(player) {
  if(player.clientId === clientId) {
    game.localPlayer = player;
  }

  game.players[player.clientId] = player;
  debug('player joined game', player);
});
