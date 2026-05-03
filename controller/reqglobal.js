function globalreq_user(req,res,next) {
    res.locals.user = req.user || null;
    next();
}

module.exports = {
    globalreq_user
}

