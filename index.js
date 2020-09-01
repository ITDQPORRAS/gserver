var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
})

app.get('/clients', (req, res) => {
  res.send(Object.keys(io.sockets.clients().connected))
})
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

http.listen(3000, () => {
  console.log('Listening on *:3000')
})
