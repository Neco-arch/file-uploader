const { prismaController } = require('../lib/prisma')

async function Checkauthuser(req, res, next) {
    if (!req.user) {
        return res.redirect('/log-in')
    }

    const user = await prismaController.userdata.findUnique({
        where: {
            id: req.user.id
        }
    })

    if (!user) {
        return res.redirect('/log-in')
    }

    req.authUser = user

    next()
}

async function  Checkunauth(params) {
    
}

module.exports = { Checkauthuser }