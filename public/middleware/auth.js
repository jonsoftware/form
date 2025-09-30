function requireAuth(req, res, next) {
    if (req.session.user) {
        next(); // Usuário logado, pode continuar
    } else {
        res.redirect('/login'); // Não logado, vai para login
    }
}

module.exports = { requireAuth };