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
    return res.view("pages/addMCform", {
      user: model,
    });
  },
  //submit MC form and add mc data in db
  submitMCform: async function (req, res) {
    console.log(req.body);
    var user = JSON.stringify(req.body.user)
    console.log(req.body.slideNum);

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
        voteA:0,
        voteB:0,
        voteC:0,
        voteD:0,
        audience:0,
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
          voteA:0,
          voteB:0,
          voteC:0,
          voteD:0,
          audience:0,
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
        message:"Form submitted!"
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
    return res.view("pages/updateMCform", {
      MC: model,
      user: model2
    });
  },

  // update MC form
  updateMCform: async function (req, res) {
    // console.log("123")
    var body=req.body;
    console.log(body);
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
        trueAnswer: body.trueAnswer,
        insertBefore: body.insertBefore,
        folder: body.folder,
        answerA: body.answerA,
        answerB: body.answerB,
        answerC: body.answerC,
        answerD: body.answerD,
        voteA:0,
        voteB:0,
        voteC:0,
        voteD:0,
        audience:0,
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
          question: body.question[i],
          trueAnswer: body.trueAnswer[i],
          insertBefore: body.insertBefore,
          folder: body.folder,
          answerA: body.answerA[i],
          answerB: body.answerB[i],
          answerC: body.answerC[i],
          answerD: body.answerD[i],
          voteA:0,
          voteB:0,
          voteC:0,
          voteD:0,
          audience:0,
        });
      }
    }

    return res.json({
      message:"Questions updated!"
    })
  }
};
