var me = require('melonjs');

exports = module.exports = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    this._super(me.ObjectEntity, 'init', [x, y, settings]);
    this.type = me.game.ACTION_OBJECT;
    this.collidable = true;
  },

  onCollision: function(res, obj) {
    if (obj.type === me.game.ACTION_OBJECT) {
      this.collidable = false;
      me.game.world.removeChild(this);

      var medpack = me.pool.pull('medpack', this.pos.x, this.pos.y, {
        image: 'medpack',
        spritewidth: 48,
        spriteheight: 48,
        width: 48,
        height: 48
      });
      me.game.world.addChild(medpack, this.z);
    }
  }
});
