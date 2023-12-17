const jwt = require('jsonwebtoken');
const Roles = require('../common/enums/Roles');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.headers.authorization;
        if (!token)
            return res.status(401).json({ message: "No token provided" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({ message: "Unauthorized" });
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Something went wrong",
            error,
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.headers.authorization;
        if (!token)
            return res.status(401).json({ message: "No token provided" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({ message: "Unauthorized" });
        if(decoded.role !== Roles.ADMIN) return res.status(401).json({message: 'Unauthorized'})
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Something went wrong",
            error,
        });
    }
};

const isArtist = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.headers.authorization;
        if (!token)
            return res.status(401).json({ message: "No token provided" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({ message: "Unauthorized" });
        if(!(decoded.role === Roles.ARTIST || decoded.role === Roles.ADMIN)) return res.status(401).json({message: 'Unauthorized'})
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Something went wrong",
            error,
        });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    isArtist
};