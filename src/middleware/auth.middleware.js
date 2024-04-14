const jwt = require('jsonwebtoken');
const { Response } = require('../utilities/responseHandler');
const secretKey = "secret";

function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Invalid token' });
    try {
        const payload = jwt.verify(token, secretKey);
        req.auth_role_id = payload.role_id;
        req.auth_user_id = payload.user_id;
        next();
    } catch (error) {
        Response.errorResponse(res, 500, false, "Invalid token", error.message)
    }
};

module.exports = verifyToken;