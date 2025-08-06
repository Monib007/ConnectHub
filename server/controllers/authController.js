const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        console.log('📥 Register Request Body:', req.body);
        const {name, email, password, bio} = req.body;
        
        const existingUser = await User.findOne({email})
        if(existingUser) return res.status(400).json({message: 'User already exists'});

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            bio,
        });

        await user.save();
        res.status(201).json({message: 'User registered successfully'})
    }
     catch (err) {
        res.status(500).json({message: 'Server error', error: err.message})
     }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message: 'Invalid credentials'});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: 'Invalid credentials'});

        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'},
        );

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
            }
        });
    }
    catch(err){
        res.status(500).json({message: 'Server error', error: err.message})
    }
}

module.exports = {register, login};