var me = require('melonjs');

var musicVolume = exports.musicVolume = 0.5;
var sfxVolume = exports.sfxVolume = 1.0;

exports.toggleMusic = function() {
  this.playMusic(me.audio.getCurrentTrack() === null);
};

exports.toggleMute = function() {
  if (me.audio.getVolume() > 0) {
    me.audio.disable();
  } else {
    me.audio.enable();
  }
};

exports.playMusic = function(enabled) {
  if (enabled === false) {
    me.audio.stopTrack();
  } else {
    me.audio.playTrack('backgroundmusic1', musicVolume);
  }
};

exports.playSound = function(sound) {
  me.audio.play(sound, false, null, sfxVolume);
};
