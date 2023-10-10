import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted.");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};


export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: id },
      $pull: { dislikes: id }
    })
    res.status(200).json("The video has been liked.")
  } catch (err) {
    next(err);
  }
};

export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id }
    })
    res.status(200).json("The video has been disliked.")
  } catch (err) {
    next(err);
  }
};


export const subscribe = async (req, res, next) => {
  try {
    console.log(req.params, req.user);
    const updateUser = await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { subscribedUser: req.params.id },
    },
      { new: true }
    )

    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });

    console.log(updateUser,"after subscribe");
    res.status(200).json(updateUser)
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    try {
      const user =  await User.findByIdAndUpdate(req.user.id, {
        $pull: { subscribedUser: req.params.id },
      }, {new: true}
      );
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: -1 },
      });
      console.log(user,"after unsubscribe");
      res.status(200).json("Unsubscription successfull.")
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // The uploaded file can be accessed as req.file
    const uploadedImagePath = req.file.path;
    console.log(uploadedImagePath, "😊😊😊😊");
    // Handle the uploaded image as needed, e.g., save the image path to a database
    // You can also resize or process the image here

    return res.status(201).json({ message: 'Image uploaded successfully', imagePath: uploadedImagePath });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
}


export const allUsers = async (req, res) => {
  try {
    const keyword = req.query.search ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ]
    } : {}
    // const users = await User.find(keyword).find({_id: {$ne: req.user._id}});
    const users = await User.find(keyword)

    res.status(200).json(users)

  } catch (error) {
    console.log(error.message);
  }
}