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
        console.log(req.body.slideNum);

        for (var j = 0; j < req.body.aryQueID.length; j++) {
            console.log(req.body.aryQueID[j]);
        }
        // await MC.destroy({
        //   id: { '>': 0 }
        // });
        // await Event.destroy({
        //   id: { '>': 0 }
        // });
        console.log("selection" + req.body.aryQueID);
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
};
