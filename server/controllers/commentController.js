import { createError } from "../error.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const addComment = async (req, res, next) => {
  const newComment = new Comment({ ...req.body, userId: req.user.id });
  try {
    const savedComment = await newComment.save();
    res.status(200).send(savedComment);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    console.log("deleteing comment",req.params.id);
    
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("The comment has been deleted.");
    
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
    .populate('replies.userId',);
    console.log(comments,"commentssss");
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};



export const replyComment = async (req, res, next)=>{
  try {
    console.log(req.body,"body", req.user.id,"userrrrrrrrrr");

    const comment = await Comment.findById(req.body.commentId);
    if (!comment) {
      console.log("comment not found");
      return next(createError(404, 'Comment not found'));
    }

    const newNestedComment = {
      userId: req.user.id,
      text: req.body.replyText,
    };

    console.log("new comment reply", newNestedComment);
    comment.replies.push(newNestedComment);
    await comment.save();
    res.status(200).json(comment);

  } catch (err) {
    console.log(err.message);
    // next(err);
  }
}


export const deleteReply = async (req, res, next) => {
  const { commentId, replyId } = req.params;

  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId }, // Find the comment by its ID
      {
        $pull: {
          replies: { _id: replyId } // Remove the reply with the specified ID from the replies array
        }
      },
      { new: true } // Return the updated comment
    );

    if (!updatedComment) {
      // If the comment with the given ID is not found
      return res.status(404).json({ message: "Comment not found" });
    }

    // Reply successfully deleted
    res.status(200).json(updatedComment);
  } catch (error) {
    // Handle any errors
    next(error);
  }
};
