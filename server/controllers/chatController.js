const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const handleChatError = (res, message, status = 400) => {
  res.status(status).json({ message });
};

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return handleChatError(res, "UserId param not sent with the request");
  }

  try {
    const isChat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (isChat) {
      const populatedChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      return res.status(200).json(populatedChat);
    }

    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findById(createdChat._id).populate("users", "-password");
    res.status(200).json(fullChat);
  } catch (error) {
    handleChatError(res, error.message);
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    const results = await Chat.find({ users: req.user._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const populatedResults = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json(populatedResults);
  } catch (error) {
    handleChatError(res, error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res.status(400).json({ message: "Please Fill All The Fields." });
  }

  const parsedUsers = JSON.parse(users);

  if (parsedUsers.length < 2) {
    return res.status(400).json({ message: "More than 2 users required to make a group." });
  }

  parsedUsers.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    handleChatError(res, error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatName, chatId } = req.body;
  
  try {
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    res.json(updatedChat);
  } catch (error) {
    handleChatError(res, error.message);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    res.json(updatedChat);
  } catch (error) {
    handleChatError(res, error.message);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    res.json(updatedChat);
  } catch (error) {
    handleChatError(res, error.message);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup
};
