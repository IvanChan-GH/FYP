/**
 * TagcloudController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // go to add Tag cloud  form
  addTagcloud: async function (req, res) {
    var model = await User.findOne({ folder: req.params.foldername });
    var folder = req.params.foldername;
    // console.log(model);
    return res.view("pages/event/addTagCloudform", {
      user: model,
    });
  },

  //submit TC form and add form data in db
  submitTagcloudform: async function (req, res) {
    console.log(req.body);
    console.log("slide num:" + req.body.slideNum);

    var m = await Event.findOne({
      type: "Tag Cloud",
      insertBefore: req.body.insertBefore,
      folder: req.body.folder,
    });
    console.log(m);
    if (m != null) {
      console.log("TC exist at that page");
      return res.json({
        message:
          "Tag Cloud already exist at that page. You should update or delete existing one.",
      });
    } else {
      console.log("can insert");
    }

    if (req.body.numOfque <= 0) {
      return res.json({
        message: "No question in the form!!",
      });
    }

    if (req.body.numOfque == 1) {
      await Tagcloud.create({
        title: req.body.title,
        insertBefore: req.body.insertBefore,
        folder: req.body.folder,
      });
    } else {
      for (var i = 0; i < req.body.title.length; i++) {
        await Tagcloud.create({
          title: req.body.title[i],
          insertBefore: req.body.insertBefore,
          folder: req.body.folder,
        });
      }
    }
    await Event.create({
      folder: req.body.folder,
      insertBefore: req.body.insertBefore,
      type: "Tag Cloud",
      slideNum: req.body.slideNum,
    });

    return res.json({
      message: "Submit successfully!",
    });
  },

  //get Tagcloud form
  getTagcloudform: async function (req, res) {
    var model = await Tagcloud.find({
      folder: req.params.foldername,
      insertBefore: req.params.insertBefore,
    });
    var model2 = await User.find({
      folder: req.params.foldername,
    });
    console.log("model");
    console.log(model);
    return res.view("pages/event/updateTagcloudform", {
      TC: model,
      user: model2,
    });
  },

  // update TC form
  updateTagcloudform: async function (req, res) {
    var body = req.body;
    console.log(body);
    if (req.body.numOfque <= 0) {
      return res.json({
        message: "invalid updated!!",
      });
    }
    await Tagcloud.destroy({
      folder: body.folder,
      insertBefore: body.insertBefore,
    });

    if (body.numOfque == 1) {
      await Tagcloud.create({
        title: body.title,
        insertBefore: body.insertBefore,
        folder: body.folder,
      });
    } else {
      for (var i = 0; i < body.title.length; i++) {
        await Tagcloud.create({
          title: body.title[i],
          insertBefore: body.insertBefore,
          folder: body.folder,
        });
      }
    }

    return res.json({
      message: "update successfully!",
    });
  },

  // TC submit words
  submitwords: async function (req, res) {
    console.log(req.body.words);
    var tc= await Tagcloud.findOne({
      id: req.body.qid,
      folder: req.body.folder,
    });

    console.log("tc:"+JSON.stringify(tc));

    // console.log("tc:"+tc.words);
    var min = new Date().getMinutes();
    if (min < 10) {
      min = "0" + min;
    }
    var hour = new Date().getHours();
    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    var time = day + "/" + month + "/" + year + "  " + hour + ":" + min;
    // console.log("time:" + time);

    if (req.body.viewer != "") {
      await Tagcloudlog.create({
        title: tc.title,
        words: req.body.words,
        folder: tc.folder,
        viewerName: req.body.viewer,
        time: time,
      });
    }

      var str = tc.words;
      if (str != "") {
        str += "," + req.body.words;
      } else {
        str = req.body.words;
      }
      await Tagcloud.update({
        id: req.body.qid,
      }).set({
        words: str,
      });
      console.log("str:" + str);

    return res.json({
      message: "vote successfully",
    });
  },

  getTagcloudresult: async function (req, res) {
    var model = await Tagcloud.findOne({
      id: req.params.id,
    });
    model.ary = model.words.split(",");
    console.log("str ary:" + model.ary);

    sails.sockets.broadcast(req.session.roomId, "Tagcloudresult",{model:model} );

    return res.json({
      result: model,
    });
  },

  getLogInfo: async function (req,res){
    var alltagcloud= await Tagcloudlog.find({
      folder:req.params.folder
    }).sort([
        {createdAt:'DESC'},
        {viewerName: 'ASC'},
    ])
    var totalpage= Math.ceil(alltagcloud.length/10);
    var current= parseInt(req.params.pagenum);
  
    var start= parseInt(req.params.pagenum)-1+ (parseInt(req.params.pagenum)-1)*9;
    console.log('start:'+start);
    var tagcloud=[];
    for(var i=start; i<start+10; i++){
      if(alltagcloud[i]){
        tagcloud[i]=alltagcloud[i];
      }
    }
  
    return res.view("pages/event/Tagcloudlog", {
      tagcloud: tagcloud,
      totalpage:totalpage,
      current:current,
      folder:req.params.folder
    });
  }
};
