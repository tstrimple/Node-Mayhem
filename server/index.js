var debug = require('debug')('8bit-mayhem:index');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var GameManager = require('./game-manager');
var manager = new GameManager();
var middleware = require('./game-middleware')(manager);

app.use(express.static('./public'));

app.get('/', function(req, res) {
  res.redirect('/html/game.html');
});

app.get('/games', function(req, res) {
  //  return a list of games
  return [];
});

app.get('/games:id', function(req, res) {
  //  return details of a game
  return {
    name: 'game-name',
    url: 'http://localhost:8000/:gameId?clientId=:clientId',
    players: 8,
    password: false
  };
});

app.post('/games', function(req, res) {

});

io.use(middleware.parseId);
io.use(middleware.reconnectPlayer);

manager.on('update-game', function(gameId, delta, players) {
  io.to(gameId).emit('update-game', delta, players);
})

io.on('connection', function(socket) {
  socket.on('create-game', function(name) {
    manager.createGame(name, function(err, game) {
      if(err) {
        return socket.emit('error', err);
      }

      return socket.emit('game-created', game);
    });
  });

  socket.on('join-game', function(gameId, playerName) {
    manager.addPlayer(socket.clientId, gameId, playerName, function(err, player) {
      if(err) {
        return socket.emit('join-error', err);
      }
      socket.player = player;
      debug('binding player events');
      socket.on('move-start', socket.player.moveStart.bind(socket.player));
      socket.on('move', socket.player.move.bind(socket.player));
      socket.on('move-end', socket.player.moveEnd.bind(socket.player));
      socket.on('shoot-start', socket.player.shootStart.bind(socket.player));
      socket.on('shoot', socket.player.shoot.bind(socket.player));
      socket.on('shoot-end', socket.player.shootEnd.bind(socket.player));

      socket.join(gameId, function(err) {
        io.to(gameId).emit('player-joined', player);
      });
    });
  });

  socket.on('disconnect', function() {
    manager.startPlayerTimeout(socket.clientId, socket.gameId, function(player) {
      socket.to(player.gameId).emit('player-dropped', player.clientId);
    });
  });
});

server.listen(process.env.PORT || 8000, function() {
  debug('waiting for connections');
});
