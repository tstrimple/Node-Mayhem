var me = require('melonjs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Joystick(touchId) {
  this.id = touchId;

  var minDistance = 10;
  var maxDistance = 50;

  var zero = new me.Vector2d();
  var pos = new me.Vector2d();
  var val = new me.Vector2d();

  this.start = function(x, y, callback) {
    zero.x = pos.x = x;
    zero.y = pos.y = y;
    this.update();
    callback(this.id + '-start');
  };

  this.move = function(x, y, callback) {
    pos.x = x;
    pos.y = y;

    var magnitude = zero.distance(pos);
    if (magnitude > minDistance) {
      this.update(callback);
    }
  };

  this.end = function(callback) {
    zero.x = pos.x = 0;
    zero.y = pos.y = 0;
    this.update();
    callback(this.id + '-end');
  };

  this.update = function(callback) {
    var magnitude = zero.distance(pos);

    if (magnitude > maxDistance) {
      magnitude = maxDistance;
    }

    val.x = pos.x;
    val.y = pos.y;

    var power = (magnitude - minDistance) / (maxDistance - minDistance);
    val.sub(zero);
    val.normalize();
    val.scale(power);

    if(typeof callback === 'function') {
      callback(this.id, val.x, val.y);
    }
  };
}

function TouchInput() {
  var leftStick = new Joystick('move');
  var rightStick = new Joystick('shoot');
  var stickMap = {};
  var windowWidth = window.innerWidth;

  this.touchStart = function(e) {
    var left = e.gameX < (windowWidth / 2);
    stickMap[e.pointerId] = left ? leftStick : rightStick;
    stickMap[e.pointerId].start(e.gameX, e.gameY, function(id) {
      this.emit(id);
    }.bind(this));
  };

  this.touchEnd = function(e) {
    stickMap[e.pointerId].end(function(id) {
      this.emit(id);
    }.bind(this));
  };

  this.touchMove = function(e) {
    stickMap[e.pointerId].move(e.gameX, e.gameY, function(id, x, y) {
      this.emit(id, x, y);
    }.bind(this));
  };
}

util.inherits(TouchInput, EventEmitter);

exports = module.exports = new TouchInput();
