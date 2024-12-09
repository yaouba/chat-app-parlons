import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorize'})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({
                success: false, message: 'Unauthorize: invalid token'
            })
        }

        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            return res.status(401).json({
                success: false, message: 'Unauthorize: invalid token'
            })
        }

        req.user = user;

        next();
    } catch (err) {
        console.log('An error occur in protectRoute middleware: ', err.message);
        return res.status(500).json({ success: false, message: 'Internal Error' })
    }
}