import React , {useState} from 'react';
import { Box } from '@chakra-ui/react';
import { ChatState } from '../Components/Context_API/ChatProvider';
import SideDrawer from '../Components/OtherMiscellaneous/SideDrawer';
import Chats from '../Components/OtherMiscellaneous/Chats';
import ChatBox from '../Components/OtherMiscellaneous/ChatBox';

function ChatPage() {
  const user = ChatState();
  const [fetchAgain,setFetchAgain ]= useState(false)

  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}

      <Box
        display="flex"
        width="100%"
        height="92.5vh"
        padding="10px"
        justifyContent="space-between"
      >
        {user && <Chats fetchAgain = {fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
}

export default ChatPage;
