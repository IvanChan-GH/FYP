/**
 * PresentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // host start presentation and create a room
  startpresent: async function (req, res) {
    var name = req.params.foldername;
    var u = await User.find({
      folder: name,
    });
    var user = u[0];
    var MCs = await MC.find({
      folder: name,
    });
    var TFs = await TF.find({
      folder: name,
    });
    var Events = await Event.find({
      folder: name,
    }).sort([
      { insertBefore: 'ASC'},
      { createdAt: 'ASC' },
    ]);
    // slide path
    var slides = [];
    for (let i = 0; i < user.slideNum; i++) {
      slides.push(user.folderPath + "/" + user.pngNameNoNum + (i + 1) + ".png");
    }

    // await Room.destroy({
    //     id: { '>': 0 }
    // });
    
    
    var sameroomid=[1];
    while(sameroomid.length!=0){
      var roomid = Math.floor(1000 + Math.random() * 9000);
      console.log(roomid);
      sameroomid= await Room.find({
        roomId: roomid
      });
      // console.log("leng:"+sameroomid.length);
      if(sameroomid.length>0){
        console.log('Room exist.');
        console.log(sameroomid);
      }
    }
    
    const room = await Room.create({
      roomId: roomid,
      userId: user.id,
    }).fetch();
    req.session.roomId = room.roomId;
    return res.view("pages/presentation", {
      MCs: MCs,
      TFs: TFs,
      Events: Events,
      user: user,
      slides: slides,
    });
  },

  connect: function (req, res) {
    sails.sockets.join(req, req.session.roomId);
    return res.ok();
  },

  previous: async function (req, res) {
    sails.sockets.broadcast(req.session.roomId, "previous");
    var room = await Room.findOne({ roomId: req.session.roomId });
    if (room) {
      await Room.update({ roomId: req.session.roomId }).set({
        currentPage: room.currentPage - 1,
      });
    }
    return res.ok();
  },

  next: async function (req, res) {
    sails.sockets.broadcast(req.session.roomId, "next");
    var room = await Room.findOne({ roomId: req.session.roomId });
    if (room) {
      await Room.update({ roomId: req.session.roomId }).set({
        currentPage: room.currentPage + 1,
      });
    }
    return res.ok();
  },
  leave: async function (req, res) {

    sails.sockets.broadcast(req.session.roomId, "leave");

    return res.ok();
  },
};