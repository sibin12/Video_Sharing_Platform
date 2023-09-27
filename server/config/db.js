import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

//connect our db
export const connect = ()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=> console.log('database connected'))
    .catch((err)=>console.log("db not connected",err))
    
}

