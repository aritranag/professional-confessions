var express = require('express'),
    https = require('https'),
    fs = require('fs'),
    cors = require('cors'),
    bodyParser = require('body-parser');

var app = express();
//var port = process.env.port || 8000;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/',function(req, res){
  res.sendFile(__dirname + '/index.html');
});


// getting the router
var DataRouter = require('./router/DataRouter.js')();
var AuthRouter = require('./router/AuthRouter.js')();

// the routes
app.use('/data',DataRouter);
app.use('/auth',AuthRouter);

/*
var https_options = {
    key : fs.readFileSync(__dirname + '/config/key.pem'),
    passphrase : '1234',
    cert : fs.readFileSync(__dirname + '/config/cert.pem')
};

var httpsServer = https.createServer(https_options,app);
/** */

app.listen((process.env.PORT || 8000),function(){
  console.log("Server started running");
});