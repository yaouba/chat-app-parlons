/** Auth Controllers */
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { generateToken } from '../lib/utils.js';

// Login
export const login = (req, res) => {

}

// Register
export const register = async(req, res) => {
    const { email, fullName, password } = req.body;
    
    try {
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists',
            });
        }


        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        });

        if (!newUser) {
            return res.status(400).json({ 
                success: false,
                message: 'An error occur when registering user',
            });
        }

        generateToken(newUser._id, res);
        await newUser.save();
        
        return res.status(201).json({
            success: true,
            message: 'User registred successfully',
            data: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            }
        })
    } catch (err) {
        console.log('Error in signup controller', err.message)
        res.status(500).json({success: false, message: 'Internal error'})
    }
}

// Logout
export const logout = (req, res) => {

}

