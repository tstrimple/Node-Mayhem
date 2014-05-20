var http = require('http');
var path = require('path');
var express = require('express');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sessionStore = session({ secret: 'something cleve', name: 'sid', cookie: { secure: true }});

var app = express();
var socketio = require('socket.io');

app.set('port', process.env.PORT || 8000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(sessionStore);

app.get('/', function(req, res) {
  res.redirect('/html/game.html?user=temp');
});

var server = http.createServer(app);

var io = new socketio.listen(server);
io.set('log level', 0);

var players = {};
var highScores = {};

io.set('authorization', function(handshakeData, accept) {
  if (!handshakeData.headers.cookie) {
    return accept('no cookies :(', false);
  }

  var cookies = cookie.parse(handshakeData.headers.cookie);
  handshakeData.sessionId = cookies.sessionId;
  accept(null, true);
});


io.on('connection', function(socket) {
  socket.on('disconnect', function() {
    socket.broadcast.emit('removePlayer', socket.sessionId);
    delete players[socket.sessionId];
    delete highScores[socket.sessionId];
    io.sockets.emit('highScores', highScores);
  });

  socket.on('gameReady', function(data) {
    data.id = socket.handshake.sessionId;
    socket.sessionId = data.id;
    socket.playerName = data.name;
    if(players[data.id]) {
      socket.broadcast.emit('removePlayer', socket.sessionId);
      delete players[socket.sessionId];
      delete highScores[socket.sessionId];
      io.sockets.emit('highScores', highScores);
    }

    var player = { id: data.id, z: 6, health: 3, score: 0, p: { x: 8 * 48, y: 2 * 48 }, n: socket.playerName };
    highScores[data.id] = { name: socket.playerName, score: 0 };
    socket.broadcast.emit('addPlayer', player);
    players[data.id] = player;
    socket.emit('addMainPlayer', player);
  });

  socket.on('updatePlayerState', function(position, state) {
    if(!players[socket.sessionId]) {
      return;
    }

    players[socket.sessionId].p = position;
    socket.broadcast.emit('updatePlayerState', { id: socket.sessionId, p: position, s: state });
  });

  socket.on('fireBullet', function(id, source, target) {
    socket.broadcast.emit('fireBullet', id, source, target);
  });

  socket.on('playerHit', function(data) {
    socket.broadcast.emit('remotePlayerHit', data);
  });

  socket.on('scoreHit', function() {
    var player = players[socket.sessionId];
    if(!player) {
      return;
    }
    player.score = player.score ? player.score + 100 : 100;
    socket.emit('score', player.score);
    highScores[player.id] = { name: player.n, score: player.score };
    io.sockets.emit('highScores', highScores);
  });

  socket.on('resetPlayer', function() {
    player = { id: socket.sessionId, z: 6, score: 0, health: 3, p: { x: 8 * 48, y: 2 * 48 }, n: socket.playerName };
    socket.broadcast.emit('removePlayer', player.id);
    socket.broadcast.emit('addPlayer', player);
    socket.emit('addMainPlayer', player);
  });

  socket.on('playerHealed', function(data) {
    socket.broadcast.emit('remotePlayerHealed', data);
  });
});

server.listen(app.get('port'), function() {
  console.log('Server listening on port ' + app.get('port'));
});
