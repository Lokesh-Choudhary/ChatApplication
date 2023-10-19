const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const handleChatError = (res, message, status = 400) => {
  res.status(status).json({ message });
};

const jsonResponse = (res, data) => {
  res.status(200).json(data);
};

const errorResponse = (res, message, status = 400) => {
  res.status(status).json({ error: message });
};

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return handleChatError(res, "UserId param not sent with the request");
  }

  try {
    const isChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .lean();

    if (isChat) {
      const populatedChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      return jsonResponse(res, populatedChat);
    }

    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findById(createdChat._id)
      .populate("users", "-password")
      .lean();
    jsonResponse(res, fullChat);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    const results = await Chat.find({ users: req.user._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .lean();

    const populatedResults = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    jsonResponse(res, populatedResults);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return errorResponse(res, "Please Fill All The Fields.", 400);
  }

  const parsedUsers = JSON.parse(users);

  if (parsedUsers.length < 2) {
    return errorResponse(res, "More than 2 users required to make a group.", 400);
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
      .populate("groupAdmin", "-password")
      .lean();

    jsonResponse(res, fullGroupChat);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatName, chatId } = req.body;
  
  try {
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .lean();

    if (!updatedChat) {
      return errorResponse(res, "Chat Not Found", 404);
    }

    jsonResponse(res, updatedChat);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .lean();

    if (!updatedChat) {
      return errorResponse(res, "Chat Not Found", 404);
    }

    jsonResponse(res, updatedChat);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .lean();

    if (!updatedChat) {
      return errorResponse(res, "Chat Not Found", 404);
    }

    jsonResponse(res, updatedChat);
  } catch (error) {
    errorResponse(res, error.message);
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
