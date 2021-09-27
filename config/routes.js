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
  //import entired ppt folder and events from other user
  "POST /importfolder/:accesscode": {controller: "FileController",action: "importFolder",},

  // redirect to multiple choice set up form 
  "GET /:foldername/MCform": {controller: "MCController",action: "addMCform",},
  // Submit Multiple choice form
  "POST /:foldername/submitMCform": {controller: "MCController",action: "submitMCform",},

  // True/False set up form 
  "GET /:foldername/TFform": {controller: "TFController",action: "addTF",},
  // Submit  True/False  form
  "POST /:foldername/submitTFform": {controller: "TFController",action: "submitTFform",},

  // voting set up form 
  "GET /:foldername/Votingform": {controller: "VotingController",action: "addvoting",},
  // Submit  voting set up form
  "POST /:foldername/submitVotingform": {controller: "VotingController",action: "submitvotingform",},

  // voting set up tag cloud 
  "GET /:foldername/Tagcloudform": {controller: "TagcloudController",action: "addTagcloud",},
  // Submit  tag cloud set up form
  "POST /:foldername/submitTagcloudform": {controller: "TagcloudController",action: "submitTagcloudform",},

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

  //redirect to voting update form interface
  "GET /:foldername/getVotingform/:insertBefore": {controller: "VotingController",action: "getVotingform",},
  //Update voting form data
  "POST /:foldername/updateVotingform/:insertBefore": {controller: "VotingController",action: "updateVotingform",}, 
  // voting
  "POST /:foldername/Voting/:qid" : {controller: "VotingController",action: "voting",},
  // get voting result
  "GET /Voting/:id/getvotingresult": {controller: "VotingController",action: "getvotingresult",},

  //redirect to Tag Cloud update form interface
  "GET /:foldername/getTagcloudform/:insertBefore": {controller: "TagcloudController",action: "getTagcloudform",},
  //Update Tagcloud form data
  "POST /:foldername/updateTagcloudform/:insertBefore": {controller: "TagcloudController",action: "updateTagcloudform",}, 
  // submit words Tagcloud
  "POST /:foldername/Tagcloud/:qid" : {controller: "TagcloudController",action: "submitwords",},
  // get Tagcloud result
  "GET /Tagcloud/:id/getTagcloudresult": {controller: "TagcloudController",action: "getTagcloudresult",},


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
  
  // socket connect
  "POST /present/connect": {controller: "PresentController",action: "connect",},

  //switch host's and audiences' slide to previous page
  'POST /present/previous': {controller: 'PresentController',action: 'previous',},
  //switch host and audiences slide to next page
  'POST /present/next': {controller: 'PresentController',action: 'next',},
  //switch host's slide to previous page
  'POST /present/hostbackward': {controller: 'PresentController',action: 'hostbackward',},
  //switch host's slide to next page
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
  //get Voting log info
  'GET /:folder/getlog/Voting/page:pagenum': {controller: 'VotingController',action: 'getLogInfo',},
  //get Tagcloud log info
  'GET /:folder/getlog/Tagcloud/page:pagenum': {controller: 'TagcloudController',action: 'getLogInfo',},



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
