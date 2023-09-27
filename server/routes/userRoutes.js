import express from "express";
import {
  update,
  deleteUser,
  getUser,
  like,
  dislike,
  subscribe,
  unsubscribe,
  uploadImage,
  allUsers
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
// import { upload } from "../middlewares/uploadImage.js";


import { uploadProfileImage } from "../controllers/uploadController.js";




const router = express.Router();

// router.post('/upload-image',verifyToken, upload.single('images'), uploadImage)

router.post('/upload',verifyToken, uploadProfileImage)


router.get('/chat', verifyToken, allUsers)

//update user
router.put("/:id", verifyToken, update);
 
//delete user
router.delete("/:id", verifyToken, deleteUser);

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