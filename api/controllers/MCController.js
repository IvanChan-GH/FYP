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
      await MC.create({
        question: req.body.question,
        trueAnswer: req.body.trueAnswer,
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
        await MC.create({
          question: req.body.question[i],
          trueAnswer: req.body.trueAnswer[i],
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


};
