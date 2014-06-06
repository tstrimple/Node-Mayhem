var me = require('melonjs');

exports = module.exports = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    this._super(me.ObjectEntity, 'init', [x, y, settings]);
    this.gravity = 0;
    this.step = 0;
    this.id = settings.id;
    this.health = 3;

    this.isCollidable = true;
    this.type = me.game.ENEMY_OBJECT;

    this.renderable.addAnimation('run-down', [0, 4, 8, 12], 1);
    this.renderable.addAnimation('run-left', [1, 5, 9, 13], 1);
    this.renderable.addAnimation('run-up', [2, 6, 10, 14], 1);
    this.renderable.addAnimation('run-right', [3, 7, 11, 15], 1);
    this.renderable.addAnimation('hit', [0, 1, 2, 3], 1);
    this.renderable.setCurrentAnimation('run-down');
    this.state = {};
    this.lastAnimationUsed = 'run-down';
    this.animationToUseThisFrame = 'run-down';
  },

  update: function() {
    this.vel.x = 0;
    this.vel.y = 0;
    if (!Object.keys(this.state).length) {
      return false;
    }

    if (this.animationToUseThisFrame !== this.lastAnimationUsed) {
      this.lastAnimationUsed = this.animationToUseThisFrame;
      this.renderable.setCurrentAnimation(this.animationToUseThisFrame);
    }

    this.state = {};
    return true;
  }
});
