const chats = [
  {
    isGroupChat: true,
    users: [
      {
        name: "Alice Smith",
        email: "alice.smith@example.com",
      },
      {
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
      },
    ],
    _id: "617a123e18c25468bc7c4de1",
    chatName: "Alice and Bob",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Eve Walker",
        email: "eve.walker@example.com",
      },
      {
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
      },
    ],
    _id: "617a123e18c25468bc7c4de2",
    chatName: "Eve and Bob",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Alice Smith",
        email: "alice.smith@example.com",
      },
      {
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
      },
      {
        name: "Eve Walker",
        email: "eve.walker@example.com",
      },
    ],
    _id: "617a523c4081150716472c79",
    chatName: "Team Chat",
    groupAdmin: {
      name: "Alice Smith",
      email: "alice.smith@example.com",
    },
  },
];

module.exports = { chats };
