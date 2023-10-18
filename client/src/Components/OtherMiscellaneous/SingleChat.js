import React, { useEffect, useState } from "react";
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

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const toast = useToast();

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
      console.log(messages);
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

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [selectedChat]);
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage)
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);

        setMessages([...setMessages, data]);
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
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

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
          <Center  height="90vh">
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
