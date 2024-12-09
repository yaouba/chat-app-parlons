import jwt from "jsonwebtoken"

export const generateToken = async (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'developement',
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })

    return token;
};