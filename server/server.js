const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Socket.IO middleware for authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id;
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.name}`);

  // Update user online status
  User.findByIdAndUpdate(socket.userId, {
    isOnline: true,
    lastSeen: new Date()
  }).exec();

  // Join user's personal room
  socket.join(socket.userId.toString());

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log(`User disconnected: ${socket.user.name}`);
    
    // Update user offline status
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: false,
      lastSeen: new Date()
    }).exec();
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(data.recipientId).emit('userTyping', {
      userId: socket.userId,
      userName: socket.user.name
    });
  });

  // Handle stop typing
  socket.on('stopTyping', (data) => {
    socket.to(data.recipientId).emit('userStopTyping', {
      userId: socket.userId
    });
  });

  // Handle new message
  socket.on('newMessage', (data) => {
    socket.to(data.recipientId).emit('messageReceived', {
      message: data.message,
      sender: socket.user
    });
  });

  // Handle new notification
  socket.on('newNotification', (data) => {
    socket.to(data.recipientId).emit('notificationReceived', {
      notification: data.notification
    });
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
