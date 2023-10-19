import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import UserListItem from '../UserAvators/UserListItem';
import UserBadgeItem from '../UserAvators/UserBadgeItem';
import { ChatState } from '../Context_API/ChatProvider';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { user } = ChatState();

  useEffect(() => {
    if (!isOpen) {
      resetModalState();
    }
  }, [isOpen]);

  const resetModalState = () => {
    setGroupChatName('');
    setSelectedUsers([]);
    setSearch('');
    setSearchResult([]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
    } catch (error) {
      handleAxiosError(error, 'Failed to Load the Search Results');
    } finally {
      setLoading(false);
    }
  };

  const handleAxiosError = (error, description) => {
    console.error(error);
    toast({
      title: 'Error Occurred',
      description,
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'bottom-left',
    });
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length < 2) {
      toastValidationError('Please Fill All The Details');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const usersIds = selectedUsers.map((u) => u._id);
      const requestData = {
        name: groupChatName,
        users: JSON.stringify(usersIds),
      };

      const { data } = await axios.post('/api/chat/group', requestData, config);
      handleChatCreationResponse(data);
    } catch (error) {
      handleAxiosError(error, 'Failed to Create Group Chat');
    }
  };

  const toastValidationError = (message) => {
    toast({
      title: message,
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  const handleChatCreationResponse = (data) => {
    resetModalState();
    onClose();
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((user) => user._id === userToAdd._id)) {
      toastUserAlreadyAdded();
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToRemove) => {
    const updatedUsers = selectedUsers.filter((user) => user._id !== userToRemove._id);
    setSelectedUsers(updatedUsers);
  };

  const toastUserAlreadyAdded = () => {
    toast({
      title: 'User already added',
      status: 'warning',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'35px'} fontFamily={'Work sans'} display={'flex'} justifyContent={'center'}>
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>
            <FormControl>
              <Input
                placeholder='Chat Name'
                mb={'3'}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Input
                placeholder='Add Users e.g. John'
                mb={'1'}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {selectedUsers.map((user) => (
              <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
            ))}
            {loading ? (
              <div key="loading" style={{ fontFamily: 'Work sans', color: 'blue' }}>
                Loading
              </div>
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
            <Button variant='ghost' onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
