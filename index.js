var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));

var server = app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

var io = require('socket.io')(server);

app.use(express.static("./views"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function (req, res) {
  var path = __dirname + '/views/index.html';
  console.log(path);
  res.sendFile(path);
});

io.on('connection', function (socket) {
  socket.on('beep', function () {
    socket.emit("beep", { data: 5 });
    console.log('beep recieved');
  });

  socket.on('change-speed', function (data) {
    console.log('change speed recieved: ' + data);
    socket.emit("speed", { newSpeed: data });
  });

  socket.on('ios-connection', function (data) {
    console.log('ios connection with message: ' + data);
  });
});