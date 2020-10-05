module.exports = (req, res, next) => {
    const checkUsername = res.locals.username;
    const checkUserId = res.locals.userId;
    const admin = 1;
    if ( checkUserId === admin || checkUsername === req.params.username ) { 
        return next();
    }
    res.status(401).send({
        status: 401,
        message: 'Usuario no autorizado.'
    });
}