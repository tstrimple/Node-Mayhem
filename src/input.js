var me = require('melonjs');

function Joystick(touchId) {
  var id = touchId;

  var minDistance = 10;
  var maxDistance = 50;

  var zero = new me.Vector2d();
  var pos = new me.Vector2d();
  var val = new me.Vector2d();

  this.start = function(x, y) {
    zero.x = pos.x = x;
    zero.y = pos.y = y;
    this.update();
    me.event.publish(id + '-pushed', [val]);
  };

  this.move = function(x, y) {
    pos.x = x;
    pos.y = y;

    var magnitude = zero.distance(pos);
    if (magnitude > minDistance) {
      this.update();
    }
  };

  this.end = function() {
    zero.x = pos.x = 0;
    zero.y = pos.y = 0;
    this.update();
    me.event.publish(id + '-released', [val]);
  };

  this.update = function() {
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

    me.event.publish(id, [val]);
  };
}

function TouchInput() {
  var leftStick = new Joystick('left-stick');
  var rightStick = new Joystick('right-stick');
  var stickMap = {};
  var windowWidth = window.innerWidth;

  this.touchStart = function(e) {
    var left = e.x < (windowWidth / 2);
    stickMap[e.pointerId] = left ? leftStick : rightStick;
    stickMap[e.pointerId].start(e.x, e.y);
  };

  this.touchEnd = function(e) {
    stickMap[e.pointerId].end();
  };

  this.touchMove = function(e) {
    stickMap[e.pointerId].move(e.x, e.y);
  };
}

exports = module.exports = new TouchInput();
