const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');

    if (!token) {
        return res.status(400).send({
            message: 'Access denied'
        });
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(400).send({
            message: 'Invalid token'
        });
    }
}

module.exports = verifyToken;