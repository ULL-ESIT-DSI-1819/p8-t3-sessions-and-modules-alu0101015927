const fs = require('fs');
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);
const express = require('express');
const router = express.Router();


function authentication(options) {
    const {
      passwordFile,
      pathToProtect,
      registerView,
      successRegisterView,
      errorRegisterView,
      loginView,
      successLoginView,
      errorLoginView,
      logoutView,
      unauthorizedView,
    } = options;
    
    //...
    if(!fs.existsSync(passwordFile))
      fs.writeFileSync(passwordFile, '{}');

    const auth = function(req, res, next){
      if(req.session && req.session.username && req.session.password){
        return next();
      } else {
        return res.status(401).render(unauthorizedView);
      }
    };



    router.use('/content', auth, express.static(pathToProtect));

    router.get('/content', (req, res) => {
      if( (!req.session.username)){
        res.status(401).render(unauthorizedView);
      }
    });

    router.get('/login', (req, res) => {
      //...
      if( (!req.session.username)){
        res.render(loginView);
      }else if ((req.session.username)){
        res.render(successLoginView, {username:req.session.username});
      }

    });
  
    router.post('/login', (req, res) => {
      //...
      let configFile = fs.readFileSync(passwordFile);
      let config = JSON.parse(configFile);

      let p = config[req.body.username];

      if(p){
        if((req.session) && req.body && req.body.password && (bcrypt.compareSync(req.body.password, p))){
          req.session.username = req.body.username;
          req.session.password = req.body.password;
          req.session.admin = true;
          return res.render(successLoginView, {username:req.session.username});  
        } else 
            return res.render(errorLoginView);
      } else 
          return res.render(errorLoginView);

    });
  
    router.get('/register', (req, res) => {
      //...
      if((!req.session.username)){
        res.render(registerView);
      } else {
        res.render(sucessLoginView, {username:req.session.username});
      }

    });
  
    router.post('/register', (req, res) => {
      //...
      let configFile = fs.readFileSync(passwordFile);
      let config = JSON.parse(configFile);
      let p = config[req.body.username];

      if(!p)
        config[req.body.username] = bcrypt.hashSync(req.body.password, salt);
      else
        return res.render(errorRegisterView, req.body.username);
      
        let configJSON = JSON.stringify(config);
        fs.writeFileSync(passwordFile, configJSON);
        res.render(successRegisterView, {username:req.body.username});

    });
  
    // Route to logout
    router.get('/logout', (req, res) => {
      //...
      let user = req.session.username;
      req.session.destroy();
      res.render(logoutView, {user});

    });
  
    return router;

}
  
module.exports = authentication;