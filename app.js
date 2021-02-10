var path = require('path');
require('dotenv').config({ path: path.join(__dirname, './property.env') });


//process.env.NODE_ENV = 'production';
var express=require("express");
var session=require("express-session")
var app=express();
var server=require('http').createServer(app);
var cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser');

var compression = require('compression');
var cors=require("cors");

global._rootPath = path.resolve(__dirname);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var routes = require('./routes/index');
var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

server.listen(port);
console.log('Server running on port ....',port);
app.use(cors())

//-----------------------
//app.use(timeout('600s'));
//Gzip compression middleware
app.use(compression());

app.use(session({ secret: 'user session', cookie: { maxAge: 60000 }}))

function normalizePort(val) {
	var port = parseInt(val, 10);
  
	if (isNaN(port)) {
	  // named pipe
	  return val;
	}
  
	if (port >= 0) {
	  // port number
	  return port;
	}
  
	return false;
  }

	

//app.use(flash());
app.locals.pretty=true;
//	Set JWT Authentication

//------------------------
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static('public'));

//app.use(express.static(path.join(_dirname, 'public')));
app.use('/', routes);


	
