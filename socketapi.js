const io = require("socket.io")();
const userModel = require("./routes/users");
const chatModel = require("./routes/chat");

const socketapi = {
    io: io,
};

const usp = io.of("/user-namespace");

usp.on("connection", async function (socket) {
    console.log("A user connected");

    const userId = socket.handshake.auth.token;

    // Set user online status to "1" on connection
    await userModel.findByIdAndUpdate(userId, { $set: { is_online: "1" } });

    // Broadcast to all connected clients that a user is online
    socket.broadcast.emit("getOnlineUser", { user_id: userId });
    // Listen for user disconnect
    socket.on("disconnect", async function () {
        console.log("A user disconnected");

        // Set user online status to "0" on disconnection
        await userModel.findByIdAndUpdate(userId, { $set: { is_online: "0" } });

        // Broadcast to all connected clients that a user is offline
        socket.broadcast.emit("getOfflineUser", { user_id: userId });
    });
    //chatting implimentation
    socket.on('newChat',function(data){
        socket.broadcast.emit("load", data)
    })

    socket.on('existchat',async function(data){
  var chats = await chatModel.find({$or:[
            {
                sender_id:data.sender_id,
                receiver_id:data.receiver_id
            },
            {
                sender_id:data.receiver_id,
                receiver_id:data.sender_id
            },
        ]})
        socket.emit("chats",{chats:chats})
    })
});

module.exports = socketapi;
