var me = require('melonjs');
var Hud = require('../entities/hud');

exports = module.exports = me.ScreenObject.extend({
  init: function() {
    this.hud = new Hud();
    this.score = 0;
  },

  onResetEvent: function() {
    this.score = 0;
    me.levelDirector.loadLevel('middleearth');
    me.game.world.addChild(this.hud);

    var player = this.mainPlayer = me.pool.pull('player', 384, 96, {
      image: 'girl',
      spritewidth: 48,
      spriteheight: 48,
      width: 48,
      height: 48,
      id: '7e1cb3f6-a872-4313-a054-838ca2c3ebcc',
      health: 3
    });

    me.game.world.addChild(player, 6);
  },

  onDestroyEvent: function() {
    me.game.world.removeChild(this.hud);
  }
});
