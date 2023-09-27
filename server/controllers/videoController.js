import User from "../models/User.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";

export const addVideo = async (req, res, next) => {
  
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err)
  }

};


export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id).populate("userId", 'username image email subscribers')
    if (video.isBlocked) {
      return res.status(403).json({ message: "Video is blocked by admin" });
    }
    res.status(200).json(video);
    
  } catch (err) {
    next(err);
  }
};

export const addView = async (req, res, next) => {
  console.log(req.body, req.params,"body");

  let id = req.body.userId;
  let videoId = req.params.id;

  try {
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json("Video not found.");
    }

    if (video.views.includes(id)) {
      return res.status(400).json("User has already viewed this video.");
    }

    // Add userId to the views array
    video.views.push(id);
    await video.save();
      return  res.status(200).json("The view has been increased.");
   
  } catch (err) {
    next(err);
  }
};

export const random = async (req, res, next) => {
  try {
   const query = Video.aggregate([
    { $match: { isBlocked: false } }, 
    { $sample: { size: 40 } } 
  ]);
  
  // Use Mongoose's .exec() to execute the query and apply population
  const videos = await query
    .exec()
    .then((result) => {
      return Video.populate(result, {
        path: "userId",
        select: "username image email subscribers",
      });
    });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};



export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(10)
    .populate("userId", "username image email subscribers")

    res.status(200).json(videos);
  } catch (err) {
    next(err)
  }
};

export const search = async (req, res, next) => {
  const query = req.query.q;
  console.log(query,"query");
  try {
    const videos = await Video.find({
      $or: [
        {
          title: { $regex: `.*${query}.*`, $options: "i" },
        },
        {
          tags: { $in: [new RegExp(`.*${query}.*`, "i")] },
        },
      ],
    }).limit(40)
    .populate("userId", "username image email subscribers")
    
    console.log(videos,"search results");
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};


export const reportVideo = async (req,res,next)=>{
  try {
    const currentVideo = await Video.findOneAndUpdate(
      { _id: req.body.videoId },
      {
        $push: {
          reports: {
            userId: req.body.user._id,
            userName:req.body.user.username,
            text: req.body.reportReason
          }
        }
      },
      { new: true } // This option returns the updated document
    );

    if(!currentVideo){
      return
    }
    res.status(200).json("Reported successfully.")

  } catch (err) {
    return err.message;
  }
}


export const findVideos = async (req,res,next)=>{
  try {
    const userId = req.params.id;
   const videos = await Video.find({userId : userId})
    res.status(200).json(videos)
  } catch (error) {
    console.log(error.message);
  }
}

export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 })
    .populate("userId", "username image email subscribers")
     console.log(videos,"💕💕💕💕 trendss");
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

 
export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    // console.log(user, "🤖🤖🤖🤖");
    const subscribedUserList = user.subscribedUser;

    if (!subscribedUserList.length < 1) {
     console.log("Please subscribe to any user")
    }

    const subscribedVideos = await Promise.all(
      subscribedUserList.map(async (userID) => {
        return await Video.find({ userId: userID }).populate("userId", "username image email subscribers");
      })
    );

    const allVideosExceptSubscribed = await Video.find({
      userId: { $nin: subscribedUserList },
    }).populate("userId", "username image email subscribers");

    const combinedVideos = [...subscribedVideos, allVideosExceptSubscribed];

    const sortedVideos = combinedVideos
      .flat()

  
    res.status(200).json(sortedVideos);
  } catch (err) {
    next(err);
  }
};
