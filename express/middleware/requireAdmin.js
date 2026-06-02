// middleware/requireAdmin.js
const requireAdmin = (req, res, next) => {
    // req.user was attached by the verifyToken middleware!
    if (req.user && req.user.role === 'admin') {
        next(); // They are an admin, let them pass!
    } else {
        res.status(403).json({ success: false, message: "Access Denied: Admin privileges required." });
    }
};

module.exports = requireAdmin;