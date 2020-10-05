const jwt = require('jsonwebtoken');
const signature = require('./../config');

const sendError = (res) => {
    res.status(401).send({
        status: 401,
        message: 'Usuario no autorizado. Necesitas estar logueado para realizar esta acción.'
    });
}


module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        sendError(res);
    }

    const token = authHeader && authHeader.split(' ')[1]; //if authHeader is true, do split

    const tokenData = jwt.verify(token, signature);
    res.locals.isAdmin = tokenData.role;
    res.locals.username = tokenData.username;
    res.locals.userId = tokenData.userId;

    if (tokenData) {
        return next();
    }
    sendError(res);
}

