export const getSender = (loggedUser, users) =>
  users[0]._id === loggedUser._id ? users[1].name : users[0].name;

  
  export const getSenderFull = (loggedUser, users) => {
    if (!Array.isArray(users) || users.length === 0) {
      return null; // or some default value, depending on your use case
    }
  
    const senderIndex = users.findIndex(user => user._id === loggedUser._id);
  
    if (senderIndex === -1) {
      // The logged user is not found in the users array
      return null; // or some default value, depending on your use case
    }
  
    const receiverIndex = senderIndex === 0 ? 1 : 0;
  
    return users[receiverIndex];
  };
  