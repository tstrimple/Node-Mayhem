var debug = require('debug')('8bit-mayhem:game-middleware');

function middleware(manager) {
  return {
    parseId: function(socket, next) {
      debug('parseId');
      socket.clientId = socket.handshake.query.clientId;
      if(!socket.clientId) {
        return next('Must pass clientId');
      }

      return next();
    },

    reconnectPlayer: function(socket, next) {
      debug('reconnectPlayer', socket.clientId);
      if(manager.clients[socket.clientId]) {
        debug(socket.clientId, 'reconnection detected');
        var game = manager.games[manager.clients[socket.clientId]];
        if(game) {
          game.removeTimeout(socket.clientId);
          debug(socket.clientId, 'Player reconnect timeout removed');
        }
      }

      next();
    }
  };
}

module.exports = middleware;
