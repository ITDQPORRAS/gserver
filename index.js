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

// app.get('/', function (req, res) {
//   var path = __dirname + '/views/index.html';
//   console.log(path);
//   res.sendFile(path);
// });

const connections = new Set();
io.on('connection', socket => {
  connections.add(s);
  socket.once('disconnect', function () {
    connections.delete(s);
    console.log(`A user disconnected with socket id ${socket.id}`)
  });
  console.log(`A user connected with socket id ${socket.id}`)
  socket.broadcast.emit('userconnected', socket.id);

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', socket.id)
  })
  socket.on('nudge-client', data => {
    socket.broadcast.to(data.to).emit('client-nudged', data)
  })
  // socket.broadcast.emit('customEmit', socket.id);
  socket.on('login', data => {
    socket.broadcast.emit('logins', data)
  })
})