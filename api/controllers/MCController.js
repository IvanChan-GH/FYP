/**
 * MCController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // go to add mc form
  addMCform: async function (req, res) {
    var model = await User.findOne({ folder: req.params.foldername });
    var folder = req.params.foldername;
    // console.log(model);
    return res.view("pages/event/addMCform", {
      user: model,
    });
  },
  //submit MC form and add mc data in db
  submitMCform: async function (req, res) {
    console.log(req.body);
    var user = JSON.stringify(req.body.user)
    console.log(req.body.slideNum);

    var m= await Event.findOne({
      type:"Multiple Choice",
      insertBefore: req.body.insertBefore,
      folder: req.body.folder
    })
    console.log(m);
    if(m!=null){
      console.log("MC exist at that page")
      return res.json({
        message:"MC already exist at that page. You should update or delete existing one."
      })
    }else{
      console.log("can insert")
    }

    if(req.body.numOfque<=0){
      return res.json({
        message:"No question in the form!!"
      })
    }
    // await MC.destroy({
    //   id: { '>': 0 }
    // });
    // await Event.destroy({
    //   id: { '>': 0 }
    // });
    if (req.body.numOfque == 1) {
      var trueAns;
      if (req.body.trueAnswer=="A"){
        trueAns=req.body.answerA
      }else if(req.body.trueAnswer=="B"){
        trueAns=req.body.answerB
      }else if(req.body.trueAnswer=="C"){
        trueAns=req.body.answerC
      }else if(req.body.trueAnswer=="D"){
        trueAns=req.body.answerD
      }
      await MC.create({
        question: req.body.question,
        trueAnswer: trueAns,
        insertBefore: req.body.insertBefore,
        folder: req.body.folder,
        answerA: req.body.answerA,
        answerB: req.body.answerB,
        answerC: req.body.answerC,
        answerD: req.body.answerD,
      });
    }else {
      for(var i=0;i<req.body.numOfque;i++){
        var trueAns;
        if (req.body.trueAnswer[i]=="A"){
          trueAns=req.body.answerA[i]
        }else if(req.body.trueAnswer[i]=="B"){
          trueAns=req.body.answerB[i]
        }else if(req.body.trueAnswer[i]=="C"){
          trueAns=req.body.answerC[i]
        }else if(req.body.trueAnswer[i]=="D"){
          trueAns=req.body.answerD[i]
        }
        await MC.create({
          question: req.body.question[i],
          trueAnswer: trueAns,
          insertBefore: req.body.insertBefore,
          folder: req.body.folder,
          answerA: req.body.answerA[i],
          answerB: req.body.answerB[i],
          answerC: req.body.answerC[i],
          answerD: req.body.answerD[i],
        });
      }
    }
    await Event.create({
      folder: req.body.folder,
      insertBefore: req.body.insertBefore,
      type:'Multiple Choice',
      slideNum:req.body.slideNum,
    });

    return res.json({
        message:"Submit successfully!"
    })
  },

  // get MC form
  getMCform: async function (req, res) {
    var model = await MC.find({ 
      folder: req.params.foldername,
      insertBefore: req.params.insertBefore
    });
    var model2 = await User.find({
      folder: req.params.foldername,
    })
    console.log(model2);

    return res.view("pages/event/updateMCform", {
      MC: model,
      user: model2
    });
  },

  // update MC form
  updateMCform: async function (req, res) {
    // console.log("123")
    var body=req.body;
    console.log(body);
    if(req.body.numOfque<=0){
      return res.json({
        message:'invalid update!!'
      })
    }
    await MC.destroy({
      folder: body.folder,
      insertBefore: body.insertBefore
    });
    if (req.body.numOfque == 1) {
      var trueAns;
      if (req.body.trueAnswer=="A"){
        trueAns=req.body.answerA
      }else if(req.body.trueAnswer=="B"){
        trueAns=req.body.answerB
      }else if(req.body.trueAnswer=="C"){
        trueAns=req.body.answerC
      }else if(req.body.trueAnswer=="D"){
        trueAns=req.body.answerD
      }
      await MC.create({
        question: body.question,
        trueAnswer: trueAns,
        insertBefore: body.insertBefore,
        folder: body.folder,
        answerA: body.answerA,
        answerB: body.answerB,
        answerC: body.answerC,
        answerD: body.answerD,
      });
    }else {
      for(var i=0;i<req.body.numOfque;i++){
        var trueAns;
        if (req.body.trueAnswer[i]=="A"){
          trueAns=req.body.answerA[i]
        }else if(req.body.trueAnswer[i]=="B"){
          trueAns=req.body.answerB[i]
        }else if(req.body.trueAnswer[i]=="C"){
          trueAns=req.body.answerC[i]
        }else if(req.body.trueAnswer[i]=="D"){
          trueAns=req.body.answerD[i]
        }
        console.log("ans:"+trueAns);
        await MC.create({
          question: body.question[i],
          trueAnswer: trueAns,
          insertBefore: body.insertBefore,
          folder: body.folder,
          answerA: body.answerA[i],
          answerB: body.answerB[i],
          answerC: body.answerC[i],
          answerD: body.answerD[i],
        });
      }
    }

    return res.json({
      message:"Questions updated!"
    })
  },

 // audience vote a mc question
 MCvoting: async function (req, res) {
    console.log("req.body:"+JSON.stringify(req.body));
    const qid=req.params.qid;
    const folder=req.params.folder;
    var m = await MC.find({
      id:  qid, 
      folder: folder
    });
    console.log("btnradio:"+req.body.btnradio);
    var mc=m[0];

    if(req.body.btnradio){
      if(req.body.btnradio==mc.answerA){
        await MC.update({ 
          id: qid
        })
        .set({
          voteA: mc.voteA+1,
          audience: mc.audience+1
        });
      }else if(req.body.btnradio==mc.answerB){
        await MC.update({ 
          id: qid
        })
        .set({
          voteB: mc.voteB+1,
          audience: mc.audience+1
        });
      }else if(req.body.btnradio==mc.answerC){
        await MC.update({ 
          id: qid
        })
        .set({
          voteC: mc.voteC+1,
          audience: mc.audience+1
        });
      }else if(req.body.btnradio==mc.answerD){
        console.log("d");
        await MC.update({ 
          id: qid
        })
        .set({
          voteD: mc.voteD+1,
          audience: mc.audience+1
        });
      }

      if(req.body.viewer!=""){
        var min=new Date().getMinutes();
        var hour=new Date().getHours();
        var day=new Date().getDate();
        var month= new Date().getMonth()+1;
        var year= new Date().getFullYear();

        var time= day+"/"+month+"/"+year +"  "+hour+":"+min
        console.log("time:"+time);

        await MClog.create({
          question: mc.question,
          folder: mc.folder,
          viewerName: req.body.viewer,
          yourAnswer:  req.body.btnradio,
          trueAnswer: mc.trueAnswer,
          time: time,
        });
      }
    }

    return res.json({
      message:"vote successfully"
    })
  },
  // host click result button
 getvotingresult: async function (req, res) {
  
    var model = await MC.findOne({ 
      id: req.params.id
    });
    sails.sockets.broadcast(req.session.roomId, "MCvotingresult",{model:model} );

    return res.json({
      result:model
    })
 },

 getLogInfo: async function (req,res){
  var allmc= await MClog.find({
    folder:req.params.folder
  }).sort([
      {createdAt:'DESC'},
      {viewerName: 'ASC'},
  ])
  var totalpage= Math.ceil(allmc.length/10);
  var current= parseInt(req.params.pagenum);

  var start= parseInt(req.params.pagenum)-1+ (parseInt(req.params.pagenum)-1)*9;
  console.log('start:'+start);
  var mc=[];
  for(var i=start; i<start+10; i++){
    if(allmc[i]){
      mc[i]=allmc[i];
    }
  }

  return res.view("pages/event/MClog", {
    MC: mc,
    totalpage:totalpage,
    current:current,
    folder:req.params.folder
  });
}
};
