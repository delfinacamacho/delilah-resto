module.exports = (req, res, next) => {
    const isAdmin = res.locals.isAdmin;

    if (isAdmin === 'Admin') { 
        return next();
    }
    res.status(401).send({
        status: 401,
        message: 'Usuario no autorizado. Se necesitan permisos de administrador para realizar esta acción.'
    });
}