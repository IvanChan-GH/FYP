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
        if (room) {
            const user = await User.findOne({ 
                id: room.userId
            });
            var TFs = await TF.find({ 
                folder: user.folder
            });
            var slides = [];
            for (let i = 0; i < user.slideNum; i++) {
                slides.push(user.folderPath + '/' + user.pngNameNoNum + (i + 1) + '.png');
            }
            req.session.roomId = roomId;
            return res.view('pages/room', { slides: slides, room: room, TFs: TFs });
        } else {
            return res.notFound();
        }
    }
};

