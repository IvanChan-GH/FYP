/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  //list uploaded ppt files
  listfiles: async function (req, res) {
    // req.session.email = "kamong1996@gmail.com";
    // req.session.name = "Ivan Chan";

    var model = await User.find({ email: req.session.email });

    return res.view("pages/myFiles", {
      users: model,
    });
  },

  // upload ppt file
  upload: function (req, res) {
    const email = req.session.email;

    const folder = new Date().getTime();
    const options = {
      maxBytes: 50000000,
      dirname:
        sails.config.appPath +
        "/assets/files/" +
        req.session.email +
        "/" +
        folder,
    };

    var Converter = require("ppt-png");
    var glob = require("glob");

    req.file("ppt").upload(options, async function (err, uploadedFiles) {
      if (err) {
        console.log("err", err);
        return res.json({ message: err });
      }

      // console.log(uploadedFiles);
      var word = uploadedFiles[0].filename.split(".");
      var filename = word[0];
      // console.log("file name:" + filename);
      // console.log(uploadedFiles);

      var samecode = [1];
      while (samecode.length != 0) {
        var result = "";
        var characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < 8; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
        console.log("code: " + result);
        samecode = await User.find({
          accesscode: result,
        });
        // console.log("leng:"+sameroomid.length);
        if (samecode.length > 0) {
          console.log("code exist.");
          console.log("code" + samecode);
        }
      }

      const user = await User.create({
        name: req.session.name,
        email: req.session.email,
        fileName: uploadedFiles[0].filename,
        fileNameWithoutFormat: filename,
        folder: folder,
        folderPath: "/files/" + req.session.email + "/" + folder,
        accesscode: result,
      });

      console.log(uploadedFiles[0].fd);

      glob(uploadedFiles[0].fd, {}, function (error, files) {
        console.log("files: ", files);
        if (files) {
          const fs = require("fs");

          new Converter({
            files: files,
            output: options.dirname + "/",
            invert: false,
            deletePdfFile: true,
            outputType: "png",
            logLevel: 2,
          })
            .wait()
            .then(async function (data) {
              console.log(data.failed, data.success, data.files, data.time);

              const ppt = data.success[0]; // refer to one ppt

              const element = data.success[0][0]; //refer to one png
              var words = element.name.split(".");
              var path = words[0];

              path = path.substring(0, path.length - 1);

              await User.updateOne({ folder: folder }).set({
                slideNum: ppt.length,
                pngNameNoNum: path,
              });

              return res.json({
                message:
                  "File " + uploadedFiles[0].filename + " upload successfully",
              });
            });
        } else {
          return res.json({
            message:
              "File " +
              uploadedFiles[0].filename +
              " upload failed, try to upload again.",
          });
        }
      });
    });
  },

  // delete uploaded ppt and folder
  deleteFolder: async function (req, res) {
    console.log(req.params.foldername);
    const fs = require("fs");

    // path of your file
    let path =
      sails.config.appPath +
      "/assets/files/kamong@gmail.com/" +
      req.params.foldername;
    // fs.access will check if file is available or not
    fs.access(path, fs.F_OK, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      //file exists, Go for delete operation
      var options = { recursive: true };
      fs.rmdir(path, options, function (err) {
        if (err) {
          console.error(err);
          return;
        }
        console.log(" File has been Deleted");
      });
    });

    await User.destroy({
      email: req.session.email,
      folder: req.params.foldername,
    });
    return res.json({
      message: "File deleted!",
    });
  },

  viewPPTdetail: async function (req, res) {
    var user = await User.findOne({ folder: req.params.foldername });
    // console.log(model);
    var event = await Event.find({
      folder: req.params.foldername,
    }).sort("insertBefore ASC");
    return res.view("pages/pptDetail", {
      user: user,
      event: event,
    });
  },

  // ppt setting page
  Setting: async function (req, res) {
    var user = await User.findOne({
      folder: req.params.foldername,
    });
    return res.view("pages/setting", {
      user: user,
    });
  },
  // update ppt setting
  updateSetting: async function (req, res) {
    console.log(req.body);
    var model = await User.findOne({
      folder: req.params.foldername,
    });
    console.log("scroll:" + model.allowScroll);
    console.log("record :" + model.makerecords);

    if (req.body.allowScroll) {
      if (model.allowScroll == false) {
        await User.updateOne({ folder: req.params.foldername }).set({
          allowScroll: req.body.allowScroll,
        });
      }
    } else {
      if (model.allowScroll == true) {
        await User.updateOne({ folder: req.params.foldername }).set({
          allowScroll: false,
        });
      }
    }
    if (req.body.makerecord) {
      if (model.makerecords == false) {
        await User.updateOne({ folder: req.params.foldername }).set({
          makerecords: req.body.makerecord,
        });
      }
    } else {
      if (model.makerecords == true) {
        await User.updateOne({ folder: req.params.foldername }).set({
          makerecords: false,
        });
      }
    }

    console.log(req.body.allowAccess);
    if (req.body.allowAccess) {
      if (model.allowAccess == false) {
        await User.updateOne({ folder: req.params.foldername }).set({
          allowAccess: req.body.allowAccess,
        });
      }
    } else {
      if (model.allowAccess == true) {
        await User.updateOne({ folder: req.params.foldername }).set({
          allowAccess: false,
        });
      }
    }

    res.json({ message: "Saved" });
  },

  //import entire ppt folder
  importFolder: async function (req, res) {
    console.log(req.params.accesscode);
    console.log(req.session);
    var file = await User.findOne({
      accesscode: req.params.accesscode,
    });

    if (file) {
      const folder = new Date().getTime();
      var destination =
        sails.config.appPath +
        "/assets/files/" +
        req.session.email +
        "/" +
        folder;
      console.log("des:" + destination);
      var source = sails.config.appPath + "/assets" + file.folderPath;
      console.log("source: " + source);

      // copy ppt folder
      const fs = require("fs-extra");
      fs.copy(source, destination)
        .then(() => console.log("success!"))
        .catch((err) => console.error(err));
    
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < 8; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      await User.create({
        name: req.session.name,
        email: req.session.email,
        folder: folder,
        fileName: file.fileName,
        fileNameWithoutFormat: file.fileNameWithoutFormat,
        folderPath: "/files/" + req.session.email + "/" + folder,
        slideNum: file.slideNum,
        pngNameNoNum: file.pngNameNoNum,
        allowScroll: file.allowScroll,
        makerecords: file.makerecords,
        allowAccess: file.allowAccess,
        accesscode: result,
      });


      var mc=await MC.find({folder: file.folder});
      var tf=await TF.find({folder: file.folder});
      var voting= await Voting.find({folder: file.folder});
      var tc= await Tagcloud.find({folder: file.folder});
      var event= await Event.find({folder: file.folder});
      
      for(var j=0;j<mc.length;j++){
        await MC.create({
          question: mc[j].question,
          folder: folder,
          answerA: mc[j].answerA,
          answerB: mc[j].answerB,
          answerC: mc[j].answerC,
          answerD: mc[j].answerD,
          trueAnswer: mc[j].trueAnswer,
          voteA: 0,
          voteB: 0,
          voteC: 0,
          voteD: 0,
          audience: 0,
          insertBefore: mc[j].insertBefore
        })
      }

      for(var k=0;k<tf.length;k++){
        await TF.create({
          question: tf[k].question,
          folder: folder,
          trueAnswer: tf[k].trueAnswer,
          voteTrue: 0,
          voteFalse: 0,
          audience:0,
          insertBefore: tf[k].insertBefore,
        })
      }

      for(var p=0;p<voting.length;p++){
        await Voting.create({
          title: voting[p].title,
          options:voting[p].options,
          votes: voting[p].votes,
          folder: folder,
          insertBefore: voting[p].insertBefore
        })
      }

      for(var l=0;l<tc.length;l++){
        await Tagcloud.create({
          insertBefore: tc[l].insertBefore,
          folder: folder,
          title: tc[l].title,
          words:""
        })
      }

      for(var r=0;r<event.length;r++){
        await Event.create({
          folder:folder,
          type: event[r].type,
          insertBefore: event[r].insertBefore,
          slideNum: event[r].slideNum,
        })
      }

      return res.json({
        message: "File  imported！",
      });
    } else {
      return res.json({
        message: "File not found",
      });
    }
  },
};
