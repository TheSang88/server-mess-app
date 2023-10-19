import Conversation from "../models/Conversation.js";
import { getServerSocketInstance } from "../socket/connectedUsers.js";
import { updateChatHistory } from "./notifyConnectedSockets.js";


const directChatHistoryHandler = async (socket, receiverUserId) => {

    try {
        const senderUserId = socket.user.userId;
        console.log("chat 1 " + senderUserId)
        // get the conversation between the sender(logged in user) and receiver
        const conversation = await Conversation.findOne({
            participants: { $all: [receiverUserId, senderUserId] },
            //type: "DIRECT",
        });
        console.log("chat 2 " + conversation)
        if (!conversation) {
            console.log("chat 3")
            return;
        }

        // update the chat history of the connecting user
        updateChatHistory(conversation._id.toString(), socket.id);
        console.log("chat 4 " + socket.id + conversation._id.toString())
        console.log("chat 4 " + conversation._id.toString())
    } catch (err) {
        console.log(err);
    }

}


export default directChatHistoryHandler;