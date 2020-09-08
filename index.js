var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));

var server = app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

var io = require('socket.io')(server);

app.use(express.static("./views"));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

io.on('connection', function(socket) {
    socket.once('disconnect', function() {
        console.log(`A user disconnected with socket id ${socket.id}`)
    });
    socket.on('join', function(data) {
        socket.join(data.email); // We are using room of socket io
    });
    socket.broadcast.emit('userconnected', socket.id);
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', socket.id)
    })
    socket.on('nudge-client', data => {
        socket.broadcast.to(data.to).emit('client-nudged', data)
    })
    socket.on('login', data => {
        socket.broadcast.emit('logins', data)
    })
    socket.on('on_ApprovedRR', data => {
        socket.broadcast.emit('approvedRR', data)
    })
    socket.on('approvedTR', data => {
        socket.broadcast.emit('approvedTR', data)
    })
    socket.on('sendMessage', data => {
        io.to(data.email).emit('receivedMessage', data);
    })
});