const { prismaController } = require("../lib/prisma.js")
const bcrypt = require("bcryptjs");

//Db part 

class DbPart {
     async InsertNewUser(username , password ,email) {
        try {
            console.log(prismaController)
            const hashedPassword = await bcrypt.hash(password, 10);
            await prismaController.userdata.create({
                data : {
                    email : email,
                    username : username,
                    password : hashedPassword
                }
            })
        } 
        catch(error) {
            console.log(error)
        }
    }
}

module.exports = { DbPart };