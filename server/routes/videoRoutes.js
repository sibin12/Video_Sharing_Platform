import express from "express";
import { addVideo, addView, getByTag, getVideo, random, search, reportVideo ,findVideos, sub, trend, editVideo, deleteVideo} from "../controllers/videoController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

//create a video
router.post("/", verifyToken, addVideo)

router.post('/report',verifyToken, reportVideo)

router.get("/find/:id", getVideo)

router.put('/:id',verifyToken ,editVideo)

router.delete('/:id',verifyToken, deleteVideo)

router.put("/view/:id", addView)

router.get("/random", random)

router.get("/tags", getByTag)

router.get("/trend", trend)

router.get("/sub",verifyToken, sub)

router.get("/search", search)

router.get('/find-videos/:id', verifyToken, findVideos)


export default router;