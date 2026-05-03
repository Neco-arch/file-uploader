const LocalStrategy = require('passport-local').Strategy;
const { prismaController } = require('../lib/prisma.js')
const bcrypt = require('bcryptjs')


const Strategy = new LocalStrategy(async (username, password, done) => {
    try {
        const user = await prismaController.userdata.findUnique({
            where : {
                username : username,
            }
        })

        if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

        const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })

module.exports = {
    Strategy
}