import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../Context_API/ChatProvider";

const UserListItem = ({ handleFunction }) => {
  const { user } = ChatState();

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
     <Avatar size="sm" cursor="pointer" name={user?.name || 'User'} src={user?.pic} />

      <Box>
        <Text fontWeight="bold" fontSize="md">
          {user.name}
        </Text>
        <Text fontSize="xs">
          <b>Email:</b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
