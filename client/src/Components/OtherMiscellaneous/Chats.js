import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from '../OtherMiscellaneous/ChatLoading';
import GroupChatModal from '../OtherMiscellaneous/GroupChatModal';
import { ChatState } from '../Context_API/ChatProvider';
import { getSender } from '../../config/ChatLogic'; // Assuming this import is correct

const Chats = () => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState(null);
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('/api/chat', config);
      setChats(data);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: 'Failed to Load Chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setLoggedUser(userInfo);
    }

    fetchChats();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Box
        d={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
        flexDir="column"
        alignItems="center"
        p="3"
        bg="white"
        w={{ base: '100%', md: '31%' }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <GroupChatModal>
          <Box
            pb={4}
            px={4}
            fontSize={{ base: '28px', md: '30px' }}
            fontFamily="Work sans"
            d="flex"
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            fontWeight="bolder"
          >
            My Chats
            <Button
              className="btns"
              d="flex"
              marginLeft={'20px'}
              fontSize={{ base: '17px', md: '17px', lg: '17px' }}
              rightIcon={<AddIcon />}
              justifyContent="flex-end"
            >
              New Group Chat
            </Button>
          </Box>
        </GroupChatModal>

        <Box
          d="flex"
          flexDir="column"
          p={3}
          bg="#f8f8f8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? '#3882AC' : 'yellow'}
                  color={selectedChat === chat ? 'white' : 'black'}
                  px={3}
                  py={2}
                  borderRadius="lg"
                >
                  <Text>
                    {!chat.isGroupChat ? (
                      getSender(loggedUser, chat.users)
                    ) : (
                      chat.chatName
                    )}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Chats;
