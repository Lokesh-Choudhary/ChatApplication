const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { chats } = require('./Data/data');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();
const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/chat', (req, res) => {
  res.send(chats);
});

app.get('/api/chat/:id', (req, res) => {
  const singleChat = chats.find(c => c._id === req.params.id);
  if (singleChat) {
    res.send(singleChat);
  } else {
    res.status(404).send('Chat not found');
  }
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT 

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
