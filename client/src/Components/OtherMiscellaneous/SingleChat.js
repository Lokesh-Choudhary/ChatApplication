import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Center,
  Flex,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../Context_API/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/ChatLogic";
import ProfileModal from "../OtherMiscellaneous/ProfileModal";
import UpdateGroupModal from "../OtherMiscellaneous/UpdateGroupModal";
import axios from "axios";
import ScrollableChat from "../OtherMiscellaneous/ScrollableChat";
import "../../App.css";
import io from "socket.io-client";
import Lottie from "react-lottie";
import TypingAnimation from "../Animations/Typing.json";

const ENDPOINT = "http://localhost:4000";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat , notification,setNotification } = ChatState();

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false); 
  const toast = useToast();
  const socketRef = useRef();
  const selectedChatCompareRef = useRef();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: TypingAnimation,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: `Error: ${error.message}`,
        description: `${error.message}`,
        status: error.status,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socketRef.current.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socketRef.current.emit("newMessage", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error: " + error.message,
          description: "Failed To send the Message",
          status: error.status,
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) {
      return;
    }

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(function () {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && isTyping) {
        socketRef.current.emit("stop typing", selectedChat._id);
      }
    });
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socketRef.current = io(ENDPOINT);

    socketRef.current.emit("setup", user);

    socketRef.current.on("connection", () => {
      setSocketConnected(true);
      console.log("Socket connected successfully!");
    });
    socketRef.current.on("typing", () => setIsTyping(true));
    socketRef.current.on("stop typing", () => setIsTyping(false));

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompareRef.current ||
        selectedChatCompareRef.current._id !== newMessageReceived.chat._id
      )
        if(!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived,...notification]);
          setFetchAgain(!fetchAgain)
        }
      else {
        setMessages([...messages, newMessageReceived]);
      }
    });
    // eslint-disable-next-line
  }, [selectedChat, messages]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            d={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.user)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          <Box
            d={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={"3"}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"92%"}
            borderRadius={"lg"}
            overflow={"hidden"}
          >
            <Center height="70vh">
              {loading ? (
                <Spinner size="xl" w="10" h="50" />
              ) : (
                <Flex flexDirection="column" alignItems="center">
                  <div className="messages">
                    <ScrollableChat messages={messages} />
                  </div>
                </Flex>
              )}
            </Center>
            <FormControl onKeyDown={sendMessage} isRequired mt={"3"}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={"70"}
                    style={{ marginBottom: "17", marginLeft: "0" }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Enter a Message ..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          textAlign="center"
        >
          <Center height="90vh">
            <Text fontSize="3xl" pb={3} fontFamily="Work Sans">
              <b>Click On A User To Start Chatting....</b>
            </Text>
          </Center>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
