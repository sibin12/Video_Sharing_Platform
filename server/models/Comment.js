import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    userId:{
        type:String,
        required: true,
    },
    videoId:{
        type:String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    replies: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId, 
                required: true,
                ref: 'User', 
            },
          text: {
            type: String,
            required: true,
          },
        },
      ],
    
},
{ timestamps: true}
);

export default mongoose.model("Comment", CommentSchema);