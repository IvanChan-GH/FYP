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
        return res.view("pages/addTFform", {
            user: model,
        });
    },

    //submit True/False form and add form data in db
    submitTFform: async function (req, res) {
        console.log(req.body);
        console.log("slide num:"+req.body.slideNum);

        for (var j = 0; j < req.body.aryQueID.length; j++) {
            console.log(req.body.aryQueID[j]);
        }
        // await MC.destroy({
        //   id: { '>': 0 }
        // });
        // await Event.destroy({
        //   id: { '>': 0 }
        // });
        console.log("selection:" + req.body.aryQueID);
        var selection = '';
        var ans = ''
        if (req.body.numOfque == 1) {
            selection += req.body.aryQueID;
            ans = req.body['selection' + selection];
            console.log(ans)
            await TF.create({
                question: req.body.question,
                trueAnswer: ans,
                insertBefore: req.body.insertBefore,
                folder: req.body.folder,
                voteA: 0,
                voteB: 0,
                voteTrue: 0,
                voteFalse: 0,
                audience: 0,
            });
        } else {
            for (var i = 0; i < req.body.aryQueID.length; i++) {
                selection = req.body.aryQueID[i];
                ans = req.body['selection' + selection];
                console.log(ans);
                await TF.create({
                    question: req.body.question[i],
                    trueAnswer: ans,
                    insertBefore: req.body.insertBefore,
                    folder: req.body.folder,
                    voteTrue: 0,
                    voteFalse: 0,
                    audience: 0,
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
            message: "Form submitted!",
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
            insertBefore: req.params.insertBefore
          });
          var model2 = await User.find({
            folder: req.params.foldername,
          })
          console.log("model");
          console.log(model);
          return res.view("pages/updateTFform", {
            TF: model,
            user: model2
          });
    },

    // update MC form
    updateTFform: async function (req, res) {
        // console.log("123")
        var body=req.body;
        console.log(body);
        await TF.destroy({
         folder: body.folder,
         insertBefore: body.insertBefore
        });
        var selection = '';
        var ans = ''
        if (body.numOfque == 1) {
            selection += body.aryQueID;
            ans = body['selection' + selection];
            console.log(ans)
            await TF.create({
                question: body.question,
                trueAnswer: ans,
                insertBefore: body.insertBefore,
                folder: body.folder,
                voteA: 0,
                voteB: 0,
                voteTrue: 0,
                voteFalse: 0,
                audience: 0,
            });
        } else {
            for (var i = 0; i < body.aryQueID.length; i++) {
                selection = body.aryQueID[i];
                ans = body['selection' + selection];
                console.log(ans);
                await TF.create({
                    question: body.question[i],
                    trueAnswer: ans,
                    insertBefore: body.insertBefore,
                    folder: body.folder,
                    voteTrue: 0,
                    voteFalse: 0,
                    audience: 0,
                });
            }
        }
    
        return res.json({
        message:"Questions updated!"
        })
    }
};
