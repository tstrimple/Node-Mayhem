var me = require('melonjs');
var ScoreItem = require('./score');
var HealthItem = require('./health');

var Hud = me.ObjectContainer.extend({
  init: function() {
    this._super(me.ObjectContainer, 'init', []);
    this.isPersistent = true;
    this.collidable = false;
    this.z = Infinity;
    this.name = 'hud';
    this.addChild(new ScoreItem(1180, 20));
    this.addChild(new HealthItem(20, 20));
  }
});

exports = module.exports = Hud;
