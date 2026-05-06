const { prismaController } = require("../lib/prisma.js")
const bcrypt = require("bcryptjs");
const path = require('path')

//Db part 

class DbPart {

    // User
    async InsertNewUser(username, password, email) {
        try {
            console.log(prismaController)
            const hashedPassword = await bcrypt.hash(password, 10);
            await prismaController.userdata.create({
                data: {
                    email: email,
                    username: username,
                    password: hashedPassword
                }
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    // File

    async InsertFileDetail(req, res) {
        const referer = req.headers.referer
        await prismaController.filedata.create({
            data: {
                filename: req.file.filename,
                Owner: {
                    connect: { id: parseInt(req.body.Uploader_id) }
                },
                path: new URL(referer).pathname,
                time : new Date(),
                size : Number(req.file.size)
            }
        })
    }

    async ShowFile(filepath,req) {
        return await prismaController.filedata.findMany({
            where : {
                path : filepath, 
                Owner : {
                    id : parseInt(req.user.id)
                }
            }
        })
    }


    async ShowFileDeatil(req) {
        const filename = req.body.filename;
        return await prismaController.filedata.findMany({
            where : {
                filename : filename
            }
        })
    }

    async FindOwner(Data) {
        return await prismaController.userdata.findUnique({
            where : {
                id : Data
            }
        })
    }
    
    //Folder 

    async InsertFolderDetail(req, res) {
        await prismaController.folder.create({
            data: {
                foldername: req.body.foldername,
                Owner: {
                    connect: { id: parseInt(req.body.Uploader_id) }
                },
            }
        })
    }

    async ViewFolder(req, res) {
        const result = await prismaController.folder.findMany({
            where: {
                ownerId: parseInt(req.user.id)
            }
        });
        return result;
    }

    async DeleteFolder(req, res) {
        await prismaController.folder.delete({
            where: {
                foldername: req.foldername
            }
        })
    }




}

module.exports = { DbPart };