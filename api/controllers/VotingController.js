/**
 * VotingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */



module.exports = {
  // set up voting form
  addvoting: async function (req, res) {
    var model = await User.findOne({ folder: req.params.foldername });
    var folder = req.params.foldername;
    // console.log(model);
    return res.view("pages/event/addvotingform", {
      user: model,
    });
  },

  //submit voting form and add  data in db
  submitVotingform: async function (req, res) {
    console.log(req.body);
    var body = req.body;

    var m = await Event.findOne({
      type: "Voting",
      insertBefore: req.body.insertBefore,
      folder: req.body.folder,
    });
    console.log(m);
    if (m != null) {
      console.log("voting exist at that page");
      return res.json({
        message:
          "Voting already exist at that page. You should update or delete existing one.",
      });
    } else {
      console.log("can insert");
    }

    if (req.body.numOfque <= 0) {
      return res.json({
        message: "No question in the form!!",
      });
    }

    for (var i = 1; i <= body.curindex; i++) {
      if (body["title" + i]) {
        console.log(body["title" + i]);
        // console.log("type:"+ typeof body["options" + i]);
        if (typeof body["options" + i] == "string") {
          console.log("it is a string");
          return res.json({
            message: "You should provide more than one option for each title",
          });
        } else {
          var option = body["options" + i][0];
          var vote = "0";
          for (var j = 1; j < body["options" + i].length; j++) {
            option += "," + body["options" + i][j];
            vote += ",0";
          }
          await Voting.create({
            title: body["title" + i],
            insertBefore: body.insertBefore,
            folder: body.folder,
            options: option,
            votes: vote,
          });
        }
      }
    }

    await Event.create({
      folder: req.body.folder,
      insertBefore: req.body.insertBefore,
      type: "Voting",
      slideNum: req.body.slideNum,
    });

    return res.json({
      message: "Submit successfully!",
    });
  },

  // get voting form
  getVotingform: async function (req, res) {
    var model = await Voting.find({ 
      folder: req.params.foldername,
      insertBefore: req.params.insertBefore
    });
    var model2 = await User.find({
      folder: req.params.foldername,
    })
    var arrayoption
    var totalopt=0

    for(var i=0;i<model.length; i++){
        arrayoption=model[i].options.split(',');
        model[i].arrayopt=arrayoption;
        totalopt+=arrayoption.length;
        // console.log(model[i].arrayopt);
    }

    console.log(model)
    return res.view("pages/event/updateVotingform", {
      vote: model,
      user: model2,
      totalopt: totalopt,
    });
  },

   //update voting form in db
   updateVotingform: async function (req, res) {
    console.log(req.body);
    var body = req.body;

    if (req.body.numOfque <= 0) {
      return res.json({
        message: "No question in the form!!",
      });
    }
    await Voting.destroy({
        folder: body.folder,
        insertBefore: body.insertBefore
    });

    for (var i = 1; i <= body.curindex; i++) {
      if (body["title" + i]) {
        console.log(body["title" + i]);
        if (typeof body["options" + i] == "string") {
          console.log("it is a string");
          return res.json({
            message: "You should provide more than one option for each title",
          });
        } else {
          var option = body["options" + i][0];
          var vote = "0";
          for (var j = 1; j < body["options" + i].length; j++) {
            option += "," + body["options" + i][j];
            vote += ",0";
          }
          await Voting.create({
            title: body["title" + i],
            insertBefore: body.insertBefore,
            folder: body.folder,
            options: option,
            votes: vote,
          });
        }
      }
    }

    return res.json({
      message: "Update successfully!",
    });
  },

  // audience vote
  voting: async function (req, res) {
    console.log("req.body:" + JSON.stringify(req.body));
    const qid = req.params.qid;
    const folder = req.params.folder;
    var v = await Voting.findOne({
        id: qid,
        folder: folder,
    });

    var opts=v.options.split(',');
    console.log('options:'+opts);

    var votes=v.votes.split(',');
    console.log('votes:'+votes)
    for(var j=0;j<opts.length;j++){
        if(opts[j]==req.body.btnradio){
            votes[j]=(parseInt(votes[j])+1).toString();
            break;
        }
    }
    var newrecord=votes[0];
    for(var p=1;p<votes.length;p++){
        newrecord+=","+votes[p];
    }
    console.log(v.id)
    await Voting.updateOne({ id: v.id })
    .set({
        votes: newrecord
    });

    console.log('new votes:'+votes)


    if(req.body.viewer!=""){
      var min=new Date().getMinutes();
      if(min<10){
        min= "0"+min
      }
      var hour=new Date().getHours();
      var day=new Date().getDate();
      var month= new Date().getMonth()+1;
      var year= new Date().getFullYear();

      var time= day+"/"+month+"/"+year +"  "+hour+":"+min
      console.log("time:"+time);

      await Votinglog.create({
          time: time,
          title: v.title,
          folder: v.folder,
          viewerName: req.body.viewer,
          yourAnswer: req.body.btnradio
      })
    }

    return res.json({
      message: "vote successfully",
    });
  },

  // host click result button
  getvotingresult: async function (req, res) {
    var model = await Voting.findOne({
      id: req.params.id,
    });

    var arrayoption
    var votes


    arrayoption=model.options.split(',');
    votes=model.votes.split(',');
    model.arrayopt=arrayoption;
    model.arrayvotes=votes;
   

    sails.sockets.broadcast(req.session.roomId, "votingresult", {
      model: model,
    });

    return res.json({
      result: model,
    });
  },

  getLogInfo: async function (req,res){
    var allvotes= await Votinglog.find({
      folder:req.params.folder
    }).sort([
        {createdAt:'DESC'},
        {viewerName: 'ASC'},
    ])
    var totalpage= Math.ceil(allvotes.length/10);
    var current= parseInt(req.params.pagenum);

    var start= parseInt(req.params.pagenum)-1+ (parseInt(req.params.pagenum)-1)*9;
    // console.log('start:'+start);
    var v=[];
    for(var i=start; i<start+10; i++){
      if(allvotes[i]){
        v[i]=allvotes[i];
      }
    }

    return res.view("pages/event/Votinglog", {
      Voting: v,
      totalpage:totalpage,
      current:current,
      folder:req.params.folder
    });
  }
};
