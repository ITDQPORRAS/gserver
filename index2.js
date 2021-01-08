var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));

var server = app.listen(app.get('port'), { secure: true }, function() {
    console.log('Node app is running on port', app.get('port'));
});

var io = require('socket.io')(server);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

io.on('connection', socket => {
    socket.on('message', function(msg) {
        io.to(`${socketId}`).emit('message', msg); //Message to specific user
    });
    console.log(`A user connected with socket id ${socket.id}`)
    socket.broadcast.emit('userconnected', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', socket.id)
    })
    socket.on('event_attend', (data) => {
        socket.broadcast.emit('event_attends', data)
    })

    socket.on('sendMessage', data => {
            console.log(`received ${data.socketId}`)
            socket.broadcast.to(data.socketId).emit('receivedMessage', data)
        })
        // socket.broadcast.emit('customEmit', socket.id);
    socket.on('login', data => {
        socket.broadcast.emit('logins', data)
    })
    socket.on('out', data => {
        socket.broadcast.emit('outs', data)
    })
    socket.on('encodeMembers', data => {
        socket.broadcast.emit('encodeMembers', data)
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