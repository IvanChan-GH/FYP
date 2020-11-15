/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const { deleteFolder } = require("../api/controllers/FileController");

module.exports.routes = {
  'GET /auth/google': {controller: 'PassportController', action: 'googleAuth'},
  'GET /logout': {controller: 'PassportController', action: 'logout'},
  'GET /auth/google/callback': {
    controller: 'PassportController',
    action: 'googleCallback',
  },


  '/': {view: 'pages/home'},
  // 'GET /myfiles': {view: 'pages/myFiles'},
  'GET /myfiles': {controller: 'FileController', action: 'listfiles'},
  //go to ppt detail page
  'GET /pptDetail/:foldername': {controller: 'FileController', action: 'viewPPTdetail'},
  //upload and delete ppt files
  'POST /upload': {controller: 'FileController', action: 'upload'},
  'POST /deletefolder/:foldername':{controller: 'FileController', action:'deleteFolder'},

  // Multiple choice form interface
  'GET /:foldername/MCform': {controller: 'MCController', action: 'addMCform'},
  // submit mc form
  'POST /:foldername/submitMCform': {controller: 'MCController', action: 'submitMCform'},

  

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/
};
