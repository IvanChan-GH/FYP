/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  //list uploaded ppt files
  listfiles: async function (req, res) {
    req.session.email = "kamong@gmail.com";
    req.session.name = "Ivan Chan";

    var model = await User.find({ email: req.session.email });

    return res.view("pages/myFiles", {
      users: model,
    });
  },

  // upload ppt file
  upload: function (req, res) {
    const email = req.session.email;
    
    console.log('body:'+req.body);

    const options = {
      dirname: "../../assets/files/" + req.session.email + "/tmp",
    };

    req.file("ppt").upload(options, async function (err, uploadedFiles) {
      if (err) {
        console.log("err", err);
        return res.json({ message: err });
      }

      // console.log(uploadedFiles);
      var word = uploadedFiles[0].filename.split(".");
      var filename = word[0];
      console.log("file name:" + filename);
      console.log(uploadedFiles);

      await User.create({
        name: req.session.name,
        email: req.session.email,
        fd: uploadedFiles[0].fd,
        fileName: filename,
      });

      // const fs = require("fs");
      // // directory paths
      // const oldDirName = "../../assets/files/" + req.session.email + "/tmp";
      // const newDirName = "../../assets/files/" + req.session.email + "/"+ filename;

      // // rename the directory
      // try {
      //   fs.renameSync(oldDirName, newDirName);
      //   console.log("Directory renamed successfully.");
      // } catch (err) {
      //   console.log(err);
      // }

      return res.json({
        message: "File " + uploadedFiles[0].filename + " load successfully",
      });

    });
  },
};
