import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const getUserForSlider = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUser);
  } catch (error) {
    console.log("error in message controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId },
      ],
    });

    res.status(200).json(message);
  } catch (error) {
    console.log("error in get message controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { image, text } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;


    let imageUrl;

    if (image) {
      console.log("uploading image to cloudinary...")
      const uploadResponse = await cloudinary.uploader.upload(image,{
        folder:"chat_app_image"
      });
      imageUrl = uploadResponse.secure_url;

      console.log('cloudinary upload response', uploadResponse)
    }
    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      image: imageUrl
    });
    await newMessage.save();


    // ==>todo: realtime  functionlaity goes here=> socket.io
    
    const recieverSocketId = getRecieverSocketId(recieverId)
    if(recieverSocketId){
      io.to(recieverSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage)

  } catch (error) {
    console.log("error in send message controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
