import mongoose from 'mongoose'

const friendInvitationSchema = new mongoose.Schema(
    {
        // User sending the invitation
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // User who is being invited
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("FriendInvitation", friendInvitationSchema);
