/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

// const { deleteFolder } = require("../api/controllers/FileController");

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
  "GET /pptDetail/:foldername": { controller: "FileController", action: "viewPPTdetail",},
  //redirect to custom setting page
  "GET /:foldername/setting": { controller: "FileController", action: "Setting",},
  //redirect to custom setting page
  "POST /:foldername/setting/update": { controller: "FileController", action: "updateSetting",},

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
  //MC voting
  "POST /:foldername/MCvoting/:qid" : {controller: "MCController",action: "MCvoting",},
  // get mc voting result
  "GET /MC/:id/getvotingresult": {controller: "MCController",action: "getvotingresult",},

  //redirect to True/False update form interface
  "GET /:foldername/getTFform/:insertBefore": {controller: "TFController",action: "getTFform",},
  //Update True/False form data
  "POST /:foldername/updateTFform/:insertBefore": {controller: "TFController",action: "updateTFform",},
  //TF voting
  "POST /:foldername/TFvoting/:qid" : {controller: "TFController",action: "TFvoting",},
  // get TF voting result
  "GET /TF/:id/getvotingresult": {controller: "TFController",action: "getvotingresult",},

  // Remove event in panel
  "POST /:foldername/removeEvent": {controller: "EventController",action: "deleteEvent",},

  //start ppt presentation (host's view)
  "GET /:foldername/presenting": {
    controller: "PresentController",
    action: "startpresent",
    locals: {
      layout: 'layouts/pptLayout'
    }
  },

  //get room setting info
  'GET /roomsetting/:room': {controller: 'RoomController',action: 'getRoomSetting',},
  //create viewer session
  'POST /createsession/:viewer': {controller: 'RoomController',action: 'addViewerSession',},
  //discard viewer session
  'POST /discardsession/:viewer': {controller: 'RoomController',action: 'delViewerSession',},

  //audience to join a presentation (audience's view)
  'GET /room/:roomId': {
    controller: 'RoomController',
    action: 'enterRoom',
    locals: {
      layout: 'layouts/pptLayout'
    }
  },
  

  //switch host's and audiences' slide to previous page
  'POST /present/previous': {controller: 'PresentController',action: 'previous',},
  //switch host and audiences slide to next page
  'POST /present/next': {controller: 'PresentController',action: 'next',},
  //switch host's slide to previous page
  'POST /present/hostforward': {controller: 'PresentController',action: 'hostforward',},

  //lock audience's screen
  'POST /present/lock': {controller: 'PresentController',action: 'lock',},
  //unlock audience's screen
  'POST /present/unlock': {controller: 'PresentController',action: 'unlock',},

  //end the presentation
  'POST /:folder/present/leave': {controller: 'PresentController',action: 'leave',},

  //get True/False log info
  'GET /:folder/getlog/TF/page:pagenum': {controller: 'TFController',action: 'getLogInfo',},
  //get Multiple choice log info
  'GET /:folder/getlog/MC/page:pagenum': {controller: 'MCController',action: 'getLogInfo',},





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
