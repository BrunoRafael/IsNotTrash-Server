var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var cloudinary = require('cloudinary');

var app = module.exports = express();

var server = require('http').createServer(app);
var io = require('../api/resources/web_socket/WebSocket.js');

/*Serviço rodando na porta 1337*/
var ip = process.env.IP || 'localhost';
var port = process.env.PORT || 3080;

server.listen(port, () => {
	console.log('App is running on http://' + ip + ':' + port);
});

io.attach(server);

app.use(cors());

if (process.env.NODE_ENV === 'dev') {
	app.use(logger('dev'));
}

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({
	extended: true
}));

cloudinary.config({
	cloud_name: 'dzoh8hohb',
	api_key: '829153973922911',
	api_secret: 'qB0FeKdsbGhwXh87BOo44_fjyPM'
});