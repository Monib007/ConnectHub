const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')

dotenv.config()
const app = express()

const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/post')

// middleware
app.use(cors())
app.use(express.json())

// routes
app.get('/', (req, res) => {
    res.send(`API is running...`)
})


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes)

// mongodb connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection failed', err))

//start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))