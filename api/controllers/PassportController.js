/**
 * PassportController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var passport = require ('passport');

//google login and logout
module.exports = {
  googleAuth: function (req, res) {
    passport.authenticate ('google', {scope: ['email', 'profile']}) (req, res);
  },

  googleCallback: function (req, res, next) {
    passport.authenticate ('google', function (err, user) {
      if (err) {
        console.log ('google callback error: ' + err);
      }
      console.log ('user:'+ JSON.stringify(user));
      console.log(user.name);
      req.session.name = user.name;
      req.session.email = user.email;
      res.redirect ('/myfiles');
    }) (req, res, next);
  },
  
  logout: async function(req, res) {
    console.log("logout");
    req.session.name = "";
    req.session.email = "";
    req.logout();
    res.redirect('/');
  }
};
