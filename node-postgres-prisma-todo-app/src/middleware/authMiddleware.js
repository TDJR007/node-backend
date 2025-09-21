//File: src/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
    const rawToken = req.headers["authorization"];
    const token = rawToken?.split(" ")[1]; // safely grab token after "Bearer"


    if (!token) { return res.status(401).json({ message: "No token provided." }); }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { return res.status(401).json({ message: "Invalid token." }); }
        req.userId = decoded.id;
        next();
    })
}

export default authMiddleware;