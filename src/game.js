var me = require('melonjs');
var audio = require('./audio');

var game = {
  players: {},
  gameReady: function() {
    console.log('default game ready');
  },

  onload: function() {
    me.sys.pauseOnBlur = false;
    if (!me.video.init('screen', 1136, 640, true, 'auto', true)) {
      throw('Your browser does not support HTML5 canvas.');
    }

    me.audio.init('ogg,mp3');
    me.loader.onload = this.loaded.bind(this);
    me.loader.preload(require('./resources'));
    me.state.change(me.state.LOADING);
  },

  loaded: function() {
    var PlayScreen = require('./screens/play');
    me.state.set(me.state.PLAY, new PlayScreen());

    me.pool.register('player', require('./entities/player'));
    me.pool.register('enemy', require('./entities/enemy'));
    me.pool.register('bullet', require('./entities/bullet'), true);
    me.pool.register('medpack', require('./entities/medpack'), true);
    me.pool.register('crate', require('./entities/crate'));
    this.gameReady();
    me.state.change(me.state.PLAY);
  },

  fireBullet: function(source, velocity, id, broadcast) {
    var obj = me.pool.pull('bullet', source.x, source.y, velocity, {
      image: 'bullet',
      spritewidth: 24,
      spriteheight: 24,
      width: 24,
      height: 24,
      id: id
    });

    me.game.world.addChild(obj, 6);
    audio.playSound('shoot');
    if (broadcast) {
      this.socket.emit('fireBullet', id, source, velocity);
    }
  },

  updatePlayerScore: function() {
    //  data.id
    //  data.score
  },

  updatePlayerState: function(data) {
    var player = this.players[data.id];
    if (player) {
      player.state = data.s;
      player.pos.x = data.p.x;
      player.pos.y = data.p.y;
    }
  },

  removeEnemy: function(data) {
    var enemy = this.players[data.id];
    console.log('removing child');
    me.game.world.removeChild(enemy);
    delete this.players[data.id];
  },

  remotePlayerHealthChanged: function(data) {
    if (!data.id || !this.players[data.id]) {
      return;
    }

    this.players[data.id].health = data.health;
  },

  killPlayer: function(id) {
    if (!id || !this.players[id]) {
      return;
    }

    this.socket.emit('resetPlayer');
    this.mainPlayer = {};
    console.log('removing child');
    me.game.world.removeChild(this.players[id]);
    delete this.players[id];
  },

  hitPlayer: function() {

  },

  addEnemy: function(data) {
    if (!data || this.players[data.id]) {
      return;
    }

    var player = me.pool.pull('enemy', data.p.x, data.p.y, {
      image: 'boy',
      spritewidth: 48,
      spriteheight: 48,
      width: 48,
      height: 48,
      id: data.id,
      health: data.health
    });
    this.players[data.id] = player;
    me.game.world.addChild(player, data.z);
  }
};

module.exports = game;
