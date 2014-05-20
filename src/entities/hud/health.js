var me = require('melonjs');

var Health = me.Renderable.extend({
  init: function(x, y) {
    this._super(me.Renderable, 'init', [new me.Vector2d(x, y), 10, 10]);
    this.font = new me.BitmapFont('32x32_font', 32);
    this.font.set('left');
    this.floating = true;
    this.health = 3;
  },

  update: function() {
    return true;
  },

  draw: function(context) {
    var playerHealth;

    playerHealth = new Array(this.health + 1).join('$');
    this.font.draw(context, playerHealth, this.pos.x, this.pos.y);
  }
});

exports = module.exports = Health;
