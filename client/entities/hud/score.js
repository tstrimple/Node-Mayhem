var me = require('melonjs');

var Score = me.Renderable.extend({
  init: function(x, y) {
    this._super(me.Renderable, 'init', [new me.Vector2d(x, y), 10, 10]);
    this.font = new me.BitmapFont('32x32_font', 32);
    this.font.set('right');
    this.score = 0;
    this.floating = true;
  },

  update: function() {
    return true;
  },

  draw: function(context) {
    this.font.draw(context, this.score, this.pos.x, this.pos.y);
  }
});

exports = module.exports = Score;
