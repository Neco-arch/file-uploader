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
                url : req.cloudinaryurl.public_id ,
                path: new URL(referer).pathname,
                time : new Date().toLocaleString(),
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
                filename : filename,
            }
        })
    }

    async FindOwner(Data) {
        return await prismaController.userdata.findUnique({
            where : {
                id : Data,
            }
        })
    }

    async Deletefile(filename ,fileid) {
        await prismaController.filedata.delete({
            where : {
                fileid : parseInt(fileid),
                filename : filename
            }
        })
    }

    async Editfile(oldname,newname , fileid) {
         const result = await prismaController.filedata.update(
            {where : {
                filename : oldname,
                fileid : parseInt(fileid)
            } ,
            data : {
                filename : newname,
            }
            }
        )

        console.log(result)
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
        const pathdrive = '/drive' + '/' + req.body.foldername
        await prismaController.folder.delete({
            where: {
                foldername: req.body.foldername,
                id : parseInt(req.body.folderid)
            }
        })
        const result = await prismaController.filedata.deleteMany({
            where : {
                path : pathdrive
            }
        })
        console.log(result)
    }

    async EditFoldername(oldfoldername,newfoldername , folderid) {
        await prismaController.folder.update({
            where : {
                foldername : oldfoldername,
            id : parseInt(folderid)            },

            data  : {
                foldername : newfoldername
            }
        })
    }




}

module.exports = { DbPart };