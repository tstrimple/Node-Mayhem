var debug = require('debug')('8bit-mayhem:player');

function Player(clientId, name) {
  this.clientId = clientId;
  this.name = name;
  this.position = { x: 0, y: 0 };
  this.velocity = { x: 0, y: 0 };
  this.moveRate = 4.5;
  this.animation = 'run-left';
  this.dirty = false;
  this.moving = false;
}

Player.prototype.update = function() {
  this.dirty = false;

  if(this.velocity.x || this.velocity.y) {
    this.dirty = true;
    this.position.x += this.velocity.x * this.moveRate;
    this.position.y += this.velocity.y * this.moveRate;
    debug('moved', this.position);
  }
};

Player.prototype.moveStart = function() {
  this.moving = true;
  this.velocity.x = 0;
  this.velocity.y = 0;
};

Player.prototype.move = function(x, y) {
  this.velocity.x = x;
  this.velocity.y = y;
};

Player.prototype.moveEnd = function() {
  this.moving = false;
  this.velocity.x = 0;
  this.velocity.y = 0;
};

Player.prototype.shootStart = function() {
  debug('shootStart', arguments);
};

Player.prototype.shoot = function() {
  debug('shoot', arguments);
};

Player.prototype.shootEnd = function() {
  debug('shootEnd', arguments);
};

module.exports = Player;
