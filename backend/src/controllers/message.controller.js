import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSideBar = async (req, res) => {
    try {
        const userId = req.user;
        const users = await User.find({ _id: { $ne: userId } }).select("-password");
        return res.status(200).json({ success: true, message: 'Users fetched successfully', data: users })
    } catch (err) {
        console.log('An error occur in getUsersForSideBar controller: ', err.message)
        return res.status(500).json({ success: false, message: 'Internal Error'})
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userTochatId } = req.params;
        const userId = req.user._id;

        const messages = Message.find({ $or: [
            { senderId: userId }, 
            { receiverId: userId }
        ] }).sort({ createdAt: -1 });
        
        return res.status(200).json({ success: true, message: 'Messages fetched successfully', data: messages })
    } catch (err) {
        console.log('An error occur in getMessages controller: ', err.message)
        return res.status(500).json({ success: false, message: 'Internal Error'})
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadRes = await cloudinary.uploader(image);
            imageUrl = uploadRes.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        // TODO: Implement realtime messaging

        return res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage })
        
    } catch (err) {
        console.log('An error occur in sendMessage controller: ', err.message)
        return res.status(500).json({ success: false, message: 'Internal Error'})
    }
}