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
  
  export const isSameSender = (messages,m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };
  
  export const isLastMessage = (messages ,i,userId) => {
      return (
        i === messages.length - 1 && 
        messages[messages.length - 1].sender._id === userId && 
        messages[messages.length - 1].sender._id
      )
  }

  export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };

  export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };
  
