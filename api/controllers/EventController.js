/**
 * EventController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  deleteEvent: async function (req, res) {
    console.log("delete");
    console.log(req.body.folder);
    console.log(req.body.type);
    console.log(req.body.insertBefore);
    if (req.body.type == "Multiple Choice") {
      await MC.destroy({
        folder: req.body.folder,
        insertBefore: req.body.insertBefore,
      });
    } else if (req.body.type == "True or False") {
      await TF.destroy({
        folder: req.body.folder,
        insertBefore: req.body.insertBefore,
      });
    }else if (req.body.type == "Voting") {
      await Voting.destroy({
        folder: req.body.folder,
        insertBefore: req.body.insertBefore,
      });
    }

    // await Voting.destroy({
    //     id: { '>': 0 }
    // });
    
    await Event.destroy({
      type: req.body.type,
      folder: req.body.folder,
      insertBefore: req.body.insertBefore,
    });
    return res.json({
      message: "Event removed!",
    });
  },
};
