const { prismaController } = require("../lib/prisma")

function serializeUser(user,done) {
    done(null , user.id)
}

async function deserializeUser(id , done) {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = prismaController.userdata.findUnique({
            where : {
                id : id,
            }
        })

        done(null , user)
    } catch(err) {
        done(err);
    }
}

module.exports = {
    serializeUser,
    deserializeUser
}

