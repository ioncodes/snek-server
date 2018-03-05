const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const TOKEN = process.env.TOKEN;
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function encrypt(text) {
    let cipher = crypto.createCipher(algorithm, TOKEN);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

app.get('/', function(req, res) {
    res.send({ status: 'ok' });
});

app.post('/notify', function(req, res) {
    let title = req.body.title;
    let message = req.body.message;
    let sectionID = req.body.sectionID;
    let token = req.body.token;
    if(token === TOKEN) {
        io.emit('notification', encrypt(JSON.stringify({ title: title, message: message, sectionID: sectionID })));
        res.send({ status: 'ok' });
    } else {
        res.send({ status: 'error' });
    }
});

server.listen(80, function() {
    console.log('App listening on port 80!');
});