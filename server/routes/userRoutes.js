import express from "express";
import {
  update,
  getUser,
  like,
  dislike,
  subscribe,
  unsubscribe,
  allUsers
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { uploadProfileImage } from "../controllers/uploadController.js";


const router = express.Router();

//upload profile image
router.post('/upload',verifyToken, uploadProfileImage)

//getting all users
router.get('/chat', verifyToken, allUsers)

//update user
router.put("/:id", verifyToken, update);
 
//get a user
router.get("/find/:id", getUser);

//like a video
router.put("/like/:videoId", verifyToken, like);

//dislike a video
router.put("/dislike/:videoId", verifyToken, dislike);

//subscribe a user
router.put("/sub/:id", verifyToken, subscribe);

//unsubscribe a user 
router.put("/unsub/:id", verifyToken, unsubscribe);

export default router;