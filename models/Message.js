import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        // sender of the message
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        content: {
            type: String,
            required: [true, "can't be blank"],
        },

        type: {
            type: String,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
