# ConnectHub - Mini LinkedIn-like Community Platform

A modern, full-stack social networking platform built with React, Node.js, and MongoDB. ConnectHub allows users to create profiles, share posts, interact through likes and comments, and connect with other users.

## 🚀 Features

### Core Features
- **User Authentication**: Secure registration and login with JWT tokens
- **User Profiles**: Customizable profiles with name, email, and bio
- **Public Post Feed**: Create, read, and display text-only posts
- **Social Interactions**: Like and comment on posts
- **User Discovery**: View other users' profiles and their posts
- **Real-time Updates**: Dynamic post updates with likes and comments

### Technical Features
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Interactions**: Instant like/comment updates
- **Pagination**: Efficient post loading with "Load More" functionality
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: Password hashing, JWT authentication, and input sanitization

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database
- **MongoDB** - Document-based database
- **Mongoose ODM** - Object Document Mapper

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ConnectHub
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/connecthub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Frontend Setup
```bash
cd client
npm install
```

### 4. Start the Application

#### Development Mode
```bash
# Terminal 1 - Start Backend
cd server
npm run dev

# Terminal 2 - Start Frontend
cd client
npm run dev
```

#### Production Mode
```bash
# Build frontend
cd client
npm run build

# Start backend
cd server
npm start
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Posts
- `GET /api/posts` - Get all posts (paginated)
- `POST /api/posts` - Create a new post (protected)
- `GET /api/posts/:id` - Get a specific post
- `DELETE /api/posts/:id` - Delete a post (protected)
- `PUT /api/posts/:id/like` - Like/unlike a post (protected)
- `POST /api/posts/:id/comment` - Add comment to post (protected)
- `DELETE /api/posts/:id/comment/:commentId` - Delete comment (protected)
- `GET /api/posts/user/:userId` - Get posts by user

### Users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/profile` - Get user profile with posts
- `GET /api/users/search?q=query` - Search users

## 👤 Demo Accounts

You can create your own account or use these demo credentials:

**Demo User 1:**
- Email: demo1@connecthub.com
- Password: demo123

**Demo User 2:**
- Email: demo2@connecthub.com
- Password: demo123

## 🎨 Features in Detail

### User Authentication
- Secure password hashing with bcryptjs
- JWT token-based authentication
- Protected routes and middleware
- Form validation and error handling

### Post Management
- Create, read, update, and delete posts
- Real-time like and comment functionality
- Pagination for better performance
- Author-only post deletion

### User Profiles
- Public profile pages
- Editable personal information
- User post history
- Profile picture support (avatar initials)

### Social Features
- Like/unlike posts
- Add and delete comments
- View other users' profiles
- Interactive post feed

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/connecthub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### MongoDB Setup

1. **Local MongoDB:**
   - Install MongoDB locally
   - Start MongoDB service
   - Use connection string: `mongodb://localhost:27017/connecthub`

2. **MongoDB Atlas:**
   - Create a free MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Replace `MONGO_URI` in `.env`

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Push your code to GitHub
2. Connect your repository to Render/Heroku
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to Vercel/Netlify
3. Set environment variables for API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the console for error messages
2. Verify your MongoDB connection
3. Ensure all environment variables are set
4. Check that both frontend and backend are running

## 🔮 Future Enhancements

- [ ] Image upload support
- [ ] Real-time notifications
- [ ] User following/followers
- [ ] Direct messaging
- [ ] Post sharing
- [ ] Advanced search functionality
- [ ] Dark mode theme
- [ ] Mobile app (React Native)

---

**ConnectHub** - Building connections, one post at a time! 🚀 