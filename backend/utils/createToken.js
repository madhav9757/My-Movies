import jwt from "jsonwebtoken";

const generateToken = (res, userId, isAdmin = false) => { 
    console.log("DEBUG: JWT_SECRET from createToken.js:", process.env.JWT_SECRET); 
    const token = jwt.sign(
        { userId, isAdmin }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30d' }  
    );

    // Set the token as an HttpOnly cookie
    res.cookie('jwt', token, {
        httpOnly: true,              
        secure: process.env.NODE_ENV !== 'development', 
        sameSite: 'strict',     
        maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    return token ;
};

export default generateToken;