const { prismaController } = require("../lib/prisma.js")
const bcrypt = require("bcryptjs");
const path = require('path')

//Db part 

class DbPart {

    // User
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

    // File

    async InsertFileDetail(req,res) {
            await prismaController.filedata.create({
            data : {
                filename : req.file.filename,
                Owner : {
                    connect : { id : parseInt(req.body.Uploader_id) }
                },
                path : req.url
            }
        })
    }

    //Folder 

    async InsertFolderDetail(req,res) {
        await prismaController.folder.create({
            data : {
                foldername : req.body.foldername,
                Owner : {
                    connect : {id :  parseInt(req.body.Uploader_id) }
                }
            }                 
        })
    }

    async ViewFolder(req,res,start) {
        return await prismaController.filedata.findMany({
            where : {
                path : req.url,
                ownerId : req.user.id
            }
        })
    }

    async DeleteFolder(req,res) {
        await prismaController.folder.delete({
            where : {
                foldername : req.foldername
            }
        })
    }


}

module.exports = { DbPart };