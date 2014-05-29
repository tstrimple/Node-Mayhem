var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sessionStore = session({
  secret: 'something clever',
  name: 'sid',
  cookie: {
    secure: true
  }});
var port = process.env.PORT || 8000;
var debug = require('debug')('server');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(sessionStore);

app.get('/', function(req, res) {
  res.redirect('/html/game.html?user=temp');
});

io.use(function(socket, next){
  debug(socket.request.headers);
  if (socket.request.headers.cookie) return next();
  next(new Error('Authentication error'));
});



io.on('connection', function(socket) {
  debug('new socket connection', socket.id);
});

app.listen(port, function() {
  debug('Server listening on port ' + port);
});
