var game = require('./game');
var input = require('./input');
var io = require('socket.io-client');
var socket = io.connect();

window.addEventListener('load', function() {
  //  Adding touch-action attribute to the  melon.js canvas to support pointer events.
  var canvas = document.getElementById('screen').firstChild;
  canvas.setAttribute('touch-action', 'none');

  canvas.addEventListener('pointerdown', input.touchStart);
  canvas.addEventListener('pointermove', input.touchMove);
  canvas.addEventListener('pointerup', input.touchEnd);

  setTimeout(function() {
    window.scrollTo(0, 1);
  }, 0);
});

window.onReady(function onReady() {
  game.onload();
});

game.socket = socket;

game.gameReady = function() {
  socket.emit('gameReady', { name: 'fred' });
};

socket.on('fireBullet', function(id, source, target) {
  game.fireBullet(source, target, id);
});
