var me = require('melonjs');
var game = require('../game');

exports = module.exports = me.ObjectEntity.extend({
  init: function(x, y, velocity, settings) {
    this._super(me.ObjectEntity, 'init', [x, y, settings]);
    this.addShape(new me.Rect(new me.Vector2d(0, 0), 6, 6));
    this.gravity = 0;
    this.collidable = true;
    this.canBreakTile = true;
    this.id = settings.id;
    this.type = me.game.ACTION_OBJECT;

    this.maxVelocity = settings.maxVelocity || 10;
    this.accel.x = velocity.x;
    this.accel.y = velocity.y;
  },

  update: function(dt) {
    var delta = dt / 20;
    this.vel.x = this.accel.x;
    this.vel.y = this.accel.y;
    this.vel.scale(this.maxVelocity * delta);

    var env = this.updateMovement();
    if (this.hitEnvironment(env)) {
      me.game.world.removeChild(this);
      return true;
    }

    var col = me.game.world.collide(this);

    if (this.hitPlayer(col)) {
      me.game.world.removeChild(this);
      game.hitPlayer(this.id, col.obj.id);
      return true;
    }

    if (this.hitObject(col)) {
      me.game.world.removeChild(this);
      return true;
    }

    return true;
  },

  hitEnvironment: function(env) {
    return env && (env.x || env.y);
  },

  hitPlayer: function(col) {
    return col && col.obj.type === me.game.ENEMY_OBJECT && !col.obj.invincible;
  },

  hitObject: function(col) {
    return col && col.obj.type === me.game.ACTION_OBJECT;
  }
});
