const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    // 1. Look for the token in the Headers
    const authHeader = req.headers['authorization'];
    
    // 2. If there is no header, or it doesn't start with "Bearer ", kick them out!
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ success: false, message: "A token is required for authentication." });
    }

    // 3. Extract just the token string (remove the word "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 4. Verify the math! (This throws an error if the token is fake or expired)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 5. Attach the decoded user data to the request object so the next route can use it!
        req.user = decoded; 
        
        // 6. Let them pass to the actual route!
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

module.exports = verifyToken;