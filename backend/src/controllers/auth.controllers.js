/** Auth Controllers */
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js';

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials'});
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials'});
        }

        await generateToken(user.id, res);
        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: { id: user._id, fullName: user.fullName, email: user.email, profilePic: user.profilePic}
        })
        
    } catch (err) {
        console.log('An error occur when long: ', err.message)
        return res.status(500).json({ success: false, message: 'Internal Error'})
    }
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
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        });
        res.status(200).json({ success: true, message: 'Logged out successfully' })
    } catch (err) {
        console.log('An error occur when logging out: ', err.message)
        return res.status(500).json({ success: false, message: 'Internal error'})
    }
}

export const updateProfile = async (req, res) => {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (! profilePic) {
        return res.status(400).json({
            success: false,
            message: 'Profile pic is required'
        })
    }

    try {
        const uploadRes = await cloudinary.uploader(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadRes.secure_url }, {new: true});
    
        return res.status(200).json({
            success: true,
            message: 'Profile pic updated successfully',
            data: {
                id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic
            }
        })
    } catch (err) {
        console.log('An error occur in updateProfile controller: ', err);
        return res.status(500).json({ success, message: 'Internal Error'})
    }

}
