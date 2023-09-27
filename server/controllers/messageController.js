import Message from "../models/Message.js"
import Chat from '../models/Chat.js'
import User from "../models/User.js";


export  const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username image email")
      .populate("chat");

      // console.log(messages,"messages");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}


export const sendMessage = async (req, res) => {
    console.log("sending messsages");
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  //  console.log(req.user,"😄😄");
  var newMessage = {
    sender: req.user.id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "username image")
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: "chat.users",
      select: "username image email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}

