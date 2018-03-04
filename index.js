const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send({ status: 'ok' });
});

app.post('/notify', function(req, res) {
    let title = req.body.title;
    let message = req.body.message;
    io.emit('notification', { title: title, message: message });
    res.send({ status: 'ok' });
});

server.listen(80, function() {
    console.log('App listening on port 80!');
});