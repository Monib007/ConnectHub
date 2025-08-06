const Post = require("../models/Post")
const User = require("../models/User")

const createPost = async (req, res) => {
    try {
        const {text} = req.body;
        const userId = req.user._id;

        if(!text) return res.status(400).json({message: 'text is required'});
        
        const post = new Post({text, userId});
        await post.save();

        res.status(201).json({message: 'Post created successfully', post})
    } catch(err) {
        return res.status(500).json({message: 'Server error', error: err.message})
    }
}

const getAllPosts = async (req, res) => {
   try {
    const posts = await Post.find().sort({createdAt: -1}).populate('userId', 'name')
    res.json(posts)
   } catch(err) {
    res.status(500).json({message: 'Server error', error: err.message})
   } 
}

const getPostsByUser = async (req, res) => {
    try {
        const {userId} = req.params;
        const posts = await Post.find({userId}).sort({createdAt: -1});
        req.json(posts)
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message})
    }
}

module.exports = {createPost, getAllPosts, getPostsByUser}