import express from "express";
import { addComment, deleteComment, getComments, replyComment, deleteReply} from "../controllers/commentController.js";
import {verifyToken} from "../middlewares/verifyToken.js"
const router = express.Router();

router.post("/", verifyToken, addComment)
router.post("/reply", verifyToken, replyComment)
router.delete("/:commentId/reply/:replyId", verifyToken, deleteReply)
router.delete("/:id", verifyToken, deleteComment)
router.get("/:videoId", getComments)

export default router;