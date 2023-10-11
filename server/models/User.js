import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        // required: true,
    },
    image: {
        type: String,
        default: "default-user-image.jpg"
    },
    coverImage:{
        type: String,
        default:"default-cover-image.png"
    },
    subscribers:{
         type:Number,
         default:0
    },
    subscribedUser:{
        type: [String],
    },
    isAdmin:{
        type: Boolean,
        default:true,
    },
    fromGoogle:{
        type:Boolean,
        default:false,
    },
    isBlocked:{
        type:Boolean,
        default:false,
    }
},
{ timestamps: true}
);
export default mongoose.model("User" , UserSchema);
