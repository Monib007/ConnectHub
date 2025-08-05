const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let mongoURI;
    
    if (process.env.NODE_ENV === 'production' && process.env.MONGO_URI) {
      // Use production MongoDB URI if provided
      mongoURI = process.env.MONGO_URI;
    } else {
      // Use MongoDB Memory Server for development
      if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
      }
      mongoURI = mongoServer.getUri();
    }
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error(`Error disconnecting: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
