import 'dotenv/config'
import express from 'express'

import cors from 'cors'
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js'
import friendInvitationRoutes from './routes/friendInvitationRoutes.js'
import groupChatRoutes from './routes/groupChatRoutes.js'

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

// register the routes
app.use("/api/auth", authRoutes);
app.use("/api/invite-friend", friendInvitationRoutes);
app.use("/api/group-chat", groupChatRoutes);

//const server = http.createServer(app);



// Socket funcion
import requireSocketAuth from "./middlewares/requireSocketAuth.js";
import callRequestHandler from "./socketControllers/callRequestHandler.js";
import callResponseHandler from "./socketControllers/callResponseHandler.js";
import directChatHistoryHandler from "./socketControllers/directChatHistoryHandler.js";
import directMessageHandler from "./socketControllers/directMessageHandler.js";
import disconnectHandler from "./socketControllers/disconnectHandler.js";
import groupMessageHandler from "./socketControllers/groupMessageHandler.js";
import newConnectionHandler from "./socketControllers/newConnectionHandler.js";
import notifyChatLeft from "./socketControllers/notifyChatLeft.js";
import notifyTypingHandler from "./socketControllers/notifyTypingHandler.js";
import { setServerSocketInstance, getOnlineUsers } from "./socket/connectedUsers.js";
import groupChatHistoryHandler from "./socketControllers/groupChatHistoryHandler.js"
import roomJoinHandler from "./socketControllers/room/roomJoinHandler.js";
import roomCreateHandler from "./socketControllers/room/roomCreateHandler.js";
import roomLeaveHandler from "./socketControllers/room/roomLeaveHandler.js";
import roomSignalingDataHandler from "./socketControllers/room/roomSignalingDataHandler.js";
import roomInitializeConnectionHandler from "./socketControllers/room/roomInitializeConnectionHandler.js";

import { createServer } from "http";
import { Server } from "socket.io";
const socketServer = createServer(app);

const io = new Server(socketServer, {
    cors: {
        origin: ["http://localhost:3000", "client-mess-app.vercel.app"],
        methods: ["GET", "POST"],
    },
});

setServerSocketInstance(io);

// check authentication of user
io.use((socket, next) => {
    requireSocketAuth(socket, next);
});

io.on("connection", (socket) => {
    // console.log(socket.user)
    console.log(`New socket connection connected: ${socket.id}`);
    newConnectionHandler(socket, io);


    socket.on("direct-message", (data) => {
        directMessageHandler(socket, data);
    })

    socket.on("group-message", (data) => {
        groupMessageHandler(socket, data);
    });

    socket.on("direct-chat-history", (data) => {
        console.log("ok chat")
        directChatHistoryHandler(socket, data.receiverUserId);
    });

    socket.on("group-chat-history", (data) => {
        console.log("ok grup")
        groupChatHistoryHandler(socket, data.groupChatId);
    });


    socket.on("notify-typing", (data) => {
        notifyTypingHandler(socket, io, data);
    });

    socket.on("call-request", (data) => {
        callRequestHandler(socket, data);
    })

    socket.on("call-response", (data) => {
        callResponseHandler(socket, data);
    })

    socket.on("notify-chat-left", (data) => {
        notifyChatLeft(socket, data);
    });
    // rooms 
    socket.on("room-create", () => {
        roomCreateHandler(socket);
    });

    socket.on("room-join", (data) => {
        roomJoinHandler(socket, data);
    });

    socket.on("room-leave", (data) => {
        roomLeaveHandler(socket, data);
    });

    socket.on("conn-init", (data) => {
        roomInitializeConnectionHandler(socket, data);
    });

    socket.on("conn-signal", (data) => {
        roomSignalingDataHandler(socket, data);
    });

    socket.on("disconnect", () => {
        console.log(`Connected socket disconnected: ${socket.id}`);
        disconnectHandler(socket, io);
    });
});
// socket end

const MONGO_URI =
    process.env.NODE_ENV === "production"
        ? process.env.MONGO_URI
        : process.env.MONGO_URI_DEV;


mongoose
    .connect(MONGO_URI)
    .then(() => {

        socketServer.listen(PORT, () => {
            console.log(`SERVER STARTED ON ${PORT}.....!`);
        });
    })
    .catch((err) => {
        console.log("database connection failed. Server not started");
        console.error(err);
    });
