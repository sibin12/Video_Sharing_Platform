import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRouter from './routes/authRoutes.js' 
import videoRouter from './routes/videoRoutes.js'
import userRouter from './routes/userRoutes.js'
import commentRouter from './routes/commentRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'

import {connect} from './config/db.js'
import cookieParser from 'cookie-parser'
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Server as SocketServer } from 'socket.io';



const app = express();
dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//

//connect our db
connect();


app.use(express.static(path.join(__dirname, 'public')));


app.use(cors({origin: "http://localhost:3000", methods: "GET,POST,PUT,DELETE", credentials: true}))
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))

app.use('/images',express.static('/public/images/profile'))

app.use('/api/auth' , authRouter)
app.use('/api/video',videoRouter)
app.use('/api/users',userRouter)
app.use("/api/comments", commentRouter);
app.use('/api/admin',adminRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)






app.use((err, req,res, next)=>{
    const status = err.status || 500;
    const message = err.message || "Something went wrong!"
    return res.status(status).json({
        success:false,
        status,
        message
    })
})



const server = app.listen(process.env.PORT, ()=> console.log("server started"))


const io = new SocketServer(server, {
    pingTimeout:60000,
    cors: {
      origin: "http://localhost:3000"
    },
  });
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
    
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });
})