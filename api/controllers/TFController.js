/**
 * TrueFalseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const TrueFalse = require("../models/TF");

module.exports = {
  // go to add True false question form
  addTF: async function (req, res) {
    var model = await User.findOne({ folder: req.params.foldername });
    var folder = req.params.foldername;
    // console.log(model);
    return res.view("pages/event/addTFform", {
      user: model,
    });
  },

  //submit True/False form and add form data in db
  submitTFform: async function (req, res) {
    console.log(req.body);
    console.log("slide num:" + req.body.slideNum);

    var m= await Event.findOne({
      type:"True or False",
      insertBefore: req.body.insertBefore,
      folder: req.body.folder
    })
    console.log(m);
    if(m!=null){
      console.log("TF exist at that page")
      return res.json({
        message:"True/False already exist at that page. You should update or delete existing one."
      })
    }else{
      console.log("can insert")
    }

    if(req.body.numOfque<=0){
      return res.json({
        message:"No question in the form!!"
      })
    }

    for (var j = 0; j < req.body.aryQueID.length; j++) {
      console.log(req.body.aryQueID[j]);
    }
  
    console.log("selection:" + req.body.aryQueID);
    var selection = "";
    var ans = "";
    if (req.body.numOfque == 1) {
      selection += req.body.aryQueID;
      ans = req.body["selection" + selection];
      console.log(ans);
      await TF.create({
        question: req.body.question,
        trueAnswer: ans,
        insertBefore: req.body.insertBefore,
        folder: req.body.folder,
      });
    } else {
      for (var i = 0; i < req.body.aryQueID.length; i++) {
        selection = req.body.aryQueID[i];
        ans = req.body["selection" + selection];
        console.log(ans);
        await TF.create({
          question: req.body.question[i],
          trueAnswer: ans,
          insertBefore: req.body.insertBefore,
          folder: req.body.folder,
        });
      }
    }
    await Event.create({
      folder: req.body.folder,
      insertBefore: req.body.insertBefore,
      type: "True or False",
      slideNum: req.body.slideNum,
    });

    return res.json({
      message: "Submit successfully!",
    });
  },

  //get True/False form
  getTFform: async function (req, res) {
    // await TF.destroy({
    //     id: { '>': 0 }
    // });
    // await Event.destroy({
    //     id: { '>': 0 }
    // });
    // await MC.destroy({
    //     id: { '>': 0 }
    // });

    var model = await TF.find({
      folder: req.params.foldername,
      insertBefore: req.params.insertBefore,
    });
    var model2 = await User.find({
      folder: req.params.foldername,
    });
    console.log("model");
    console.log(model);
    return res.view("pages/event/updateTFform", {
      TF: model,
      user: model2,
    });
  },

  // update MC form
  updateTFform: async function (req, res) {
    // console.log("123")
    var body = req.body;
    console.log(body);
    if(req.body.numOfque<=0){
      return res.json({
        message:"invalid updated!!"
      })
    }
    await TF.destroy({
      folder: body.folder,
      insertBefore: body.insertBefore,
    });
    var selection = "";
    var ans = "";
    if (body.numOfque == 1) {
      selection += body.aryQueID;
      ans = body["selection" + selection];
      console.log(ans);
      await TF.create({
        question: body.question,
        trueAnswer: ans,
        insertBefore: body.insertBefore,
        folder: body.folder,
      });
    } else {
      for (var i = 0; i < body.aryQueID.length; i++) {
        selection = body.aryQueID[i];
        ans = body["selection" + selection];
        console.log(ans);
        await TF.create({
          question: body.question[i],
          trueAnswer: ans,
          insertBefore: body.insertBefore,
          folder: body.folder,
        });
      }
    }

    return res.json({
      message: "Questions updated!",
    });
  },

  // audience vote a mc question
  TFvoting: async function (req, res) {
    console.log("req.body:" + JSON.stringify(req.body));
    const qid = req.params.qid;
    const folder = req.params.folder;
    var t = await TF.find({
        id: qid,
        folder: folder,
    });
    console.log("radio:" + req.body.radio);
    var tf = t[0];

    if (req.body.radio) {
      if (req.body.radio == "True") {
        await TF.update({
          id: qid,
        }).set({
          voteTrue: tf.voteTrue + 1,
          audience: tf.audience + 1,
        });
      } else if (req.body.radio == "False") {
        await TF.update({
          id: qid,
        }).set({
            voteFalse: tf.voteFalse + 1,
            audience: tf.audience + 1,
        });
      } 
    }

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

      await TFlog.create({
        question: tf.question,
        folder: tf.folder,
        viewerName: req.body.viewer,
        yourAnswer:  req.body.radio,
        trueAnswer: tf.trueAnswer,
        time: time,
      });
    }

    return res.json({
      message: "vote successfully",
    });
  },
  // host click result button
  getvotingresult: async function (req, res) {
    var model = await TF.findOne({
      id: req.params.id,
    });
    sails.sockets.broadcast(req.session.roomId, "TFvotingresult", {
      model: model,
    });

    return res.json({
      result: model,
    });
  },

  getLogInfo: async function (req,res){
    var alltf= await TFlog.find({
      folder:req.params.folder
    }).sort([
        {createdAt:'DESC'},
        {viewerName: 'ASC'},
    ])
    var totalpage= Math.ceil(alltf.length/10);
    var current= parseInt(req.params.pagenum);

    var start= parseInt(req.params.pagenum)-1+ (parseInt(req.params.pagenum)-1)*9;
    console.log('start:'+start);
    var tf=[];
    for(var i=start; i<start+10; i++){
      if(alltf[i]){
        tf[i]=alltf[i];
      }
    }

    return res.view("pages/event/TFlog", {
      TF: tf,
      totalpage:totalpage,
      current:current,
      folder:req.params.folder
    });
  }
};
