var me = require('melonjs');
var game = require('../game');

exports = module.exports = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    this._super(me.ObjectEntity, 'init', [x, y, settings]);
    this.addShape(new me.Rect(new me.Vector2d(7, 10), 32, 32));

    this.gravity = 0;
    this.isFiring = false;
    this.isWeaponCoolDown = false;
    this.weaponCoolDownTime = 500;

    this.health = 3;
    this.id = settings.id;

    this.isCollidable = true;
    this.name = 'player';
    this.type = me.game.PLAYER_OBJECT;
    this.state = { up: false, down: false, right: false, left: false };
    this.stateChanged = false;
    this.lastAnimationUsed = 'run-down';
    this.animationToUseThisFrame = 'run-down';
    this.target = new me.Vector2d();

    this.renderable.addAnimation('run-down', [0, 1, 2, 3], 1);
    this.renderable.addAnimation('run-left', [4, 5, 6, 7], 1);
    this.renderable.addAnimation('run-up', [8, 9, 10, 11], 1);
    this.renderable.addAnimation('run-right', [12, 13, 14, 15], 1);
    this.renderable.addAnimation('hit', [0, 4, 8, 12], 1);
    this.renderable.setCurrentAnimation('run-down');

    var accel = this.accel;
    this.accelForce = 4.5;

    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
  },

  setFacing: function(vel) {
    if (vel.x < 0 && Math.abs(vel.x) > Math.abs(vel.y)) {
      this.animationToUseThisFrame = 'run-left';
    }

    if (vel.y < 0 && Math.abs(vel.y) > Math.abs(vel.x)) {
      this.animationToUseThisFrame = 'run-up';
    }

    if (vel.x >= 0 && Math.abs(vel.x) > Math.abs(vel.y)) {
      this.animationToUseThisFrame = 'run-right';
    }

    if (vel.y >= 0 && Math.abs(vel.y) > Math.abs(vel.x)) {
      this.animationToUseThisFrame = 'run-down';
    }
  },

  update: function(dt) {
    this.setFacing(this.serverData.velocity);
    this.pos.x = this.serverData.position.x;
    this.pos.y = this.serverData.position.y;

    if (!this.renderable.isCurrentAnimation(this.animationToUseThisFrame)) {
      this.renderable.setCurrentAnimation(this.animationToUseThisFrame);
    }

    if (this.isFiring && !this.isWeaponCoolDown) {
      this.isWeaponCoolDown = true;

      game.fireBullet({ x: this.pos.x + 12, y: this.pos.y + 12 },
        new me.Vector2d(this.target.x, this.target.y), this.id, true);
      setTimeout(function() {
        this.isWeaponCoolDown = false;
      }.bind(this), this.weaponCoolDownTime);
    }

    return true;
  }
});
