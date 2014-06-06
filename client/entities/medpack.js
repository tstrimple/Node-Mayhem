var me = require('melonjs');
var game = require('../game');
var audio = require('../audio');

exports = module.exports = me.CollectableEntity.extend({
  init: function(x, y, settings) {
    this._super(me.CollectableEntity, 'init', [x, y, settings]);
    this.type = me.game.COLLECTABLE_OBJECT;
  },
  onCollision: function(res, obj) {
    if (obj.type === me.game.PLAYER_OBJECT || obj.type === game.ENEMY_OBJECT) {
      this.collidable = false;
      me.game.world.removeChild(this);
      audio.playSound('powerup');
    }
  }
});
