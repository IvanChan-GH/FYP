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
    console.log(model);
    return res.view("pages/addMCform", {
      user: model,
    });
  },
  //submit MC form and add mc data in db
  submitMCform: async function(req, res){
    console.log(req.body);
    console.log(req.body.question);
 
    // return res.json({
    //     message:"Form submitted!"
    // })
  }
};
