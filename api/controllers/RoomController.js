/**
 * RoomController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    //use roomID to join the presentation
    enterRoom: async function(req, res) {
        const roomId = req.param('roomId');
        const room = await Room.findOne({ roomId: roomId });
        var name;
        if (room) {
            var u = await User.find({
                id: room.userId,
            });
            name = u[0].folder;

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
            var slides = [];
            for (let i = 0; i < user.slideNum; i++) {
                slides.push(user.folderPath + '/' + user.pngNameNoNum + (i + 1) + '.png');
            }
            req.session.roomId = roomId;
        
            return res.view('pages/room', {
                MCs: MCs,
                TFs: TFs,
                Events: Events,
                user: user,
                slides: slides,
                room:room
            });
        } else {
            return res.notFound();
        }
    },
   
    getRoomSetting: async function(req, res){
        var model= await Room.findOne({
            roomId:req.params.room
        })
        var user= await User.findOne({
            id: model.userId
        })
        // console.log(model);
        // console.log(user);

        return res.json({
            room:model,
            user:user
        })
    },

    addViewerSession: function(req, res){
       
        req.session.viewer= req.params.viewer;
        console.log("viewer session:"+req.session.viewer)
        return res.json({
            message: "viewer session created"
        })
    },


    delViewerSession: function(req, res){
        req.session.viewer=''

        console.log("viewer session:"+req.session.viewer)
        return res.json({
            message: "viewer session discard"
        })
    }
};

