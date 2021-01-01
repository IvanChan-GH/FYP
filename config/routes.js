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
  "GET /auth/google": {controller: "PassportController",action: "googleAuth",},
  "GET /logout": { controller: "PassportController", action: "logout" },
  "GET /auth/google/callback": {controller: "PassportController",action: "googleCallback",
  },

  // home page
  "/": { 
    view: "pages/home" ,
    locals: {
      layout: 'layouts/home'
    }
  },
  // 'GET /myfiles': {view: 'pages/myFiles'},
  "GET /myfiles": { controller: "FileController", action: "listfiles" },
  //redirect to ppt detail page
  "GET /pptDetail/:foldername": {
    controller: "FileController",
    action: "viewPPTdetail",
    // locals: {
    //   layout: false
    // }
  },
  //upload and delete ppt files
  "POST /upload": { controller: "FileController", action: "upload" },
  "POST /deletefolder/:foldername": {controller: "FileController",action: "deleteFolder",},

  // redirect to multiple choice form interface
  "GET /:foldername/MCform": {controller: "MCController",action: "addMCform",},
  // Submit Multiple choice form
  "POST /:foldername/submitMCform": {controller: "MCController",action: "submitMCform",},

  // True/False form interface
  "GET /:foldername/TFform": {controller: "TFController",action: "addTF",},
  // Submit  True/False  form
  "POST /:foldername/submitTFform": {controller: "TFController",action: "submitTFform",},

  //redirect to multiple choice update form interface
  "GET /:foldername/getMCform/:insertBefore": {controller: "MCController",action: "getMCform",},
  //Update Mutiple Choice form data
  "POST /:foldername/updateMCform/:insertBefore": {controller: "MCController",action: "updateMCform",},

  //redirect to True/False update form interface
  "GET /:foldername/getTFform/:insertBefore": {controller: "TFController",action: "getTFform",},
  //Update True/False form data
  "POST /:foldername/updateTFform/:insertBefore": {controller: "TFController",action: "updateTFform",},

  // Remove event in panel
  "POST /:foldername/removeEvent": {controller: "EventController",action: "deleteEvent",},

  //start ppt presentation
  "GET /:foldername/presenting": {
    controller: "PresentController",
    action: "startpresent",
    locals: {
      layout: 'layouts/pptLayout'
    }
  },

  //audience to join a presentation
  'GET /room/:roomId': {
    controller: 'RoomController',
    action: 'enterRoom',
    locals: {
      layout: 'layouts/pptLayout'
    }
  },

  //switch slide to previous page
  'POST /present/previous': {
    controller: 'PresentController',
    action: 'previous',
  },

  //switch slide to next page
  'POST /present/next': {
    controller: 'PresentController',
    action: 'next',
  },

  //end the presentation
  'POST /present/leave': {
    controller: 'PresentController',
    action: 'leave',
  }
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
