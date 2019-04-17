const express = require('express');
const session = require('express-session');
// const auth = require('@ull-esit-pl/auth');
const path = require('path');

const ip = require("ip");

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//...

const app = express();
const auth = require('./auth.js');

//...
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));


app.use(session({
  secret: 'verySecureSecret',
  resave: true,
  saveUninitialized: true,
}));

app.use('/', auth({
  passwordFile: path.join(__dirname, 'users.json'),
  pathToProtect: path.join(__dirname, '../../', 'dist'),
  registerView: 'register',
  successRegisterView: 'registerSuccess',
  errorRegisterView: 'registerError',
  loginView: 'login',
  successLoginView: 'loginSuccess',
  errorLoginView: 'loginError',
  logoutView: 'logout',
  unauthorizedView: 'unauthorizedView',
}));


app.get('/', function(req, res){
  res.render('index');
});

const server = app.listen(8080, 'localhost', function(){
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Server with sessions and auth listening at http://${host}:${port} my ip = ${ip.address()}`);
});