require('dotenv/config')
const cloudinary = require('cloudinary').v2
const { prismaController } = require('../lib/prisma')
const fs = require('node:fs')
const path = require('path');
const { DbPart } = require('./quries')

class Crud {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECERT,
        })
        
        this.connectdb = new DbPart
    }



    async UploadFile(req, res) {
        try {
            const result = await cloudinary.uploader.upload(
                req.file.path, {
                fetch_format: 'auto',
                quality: 'auto',
            }
            )
            req.cloudinaryurl = result
            const result2 = await this.connectdb.InsertFileDetail(req, res)
            await fs.unlinkSync(req.file.path)
        } catch (erro) {
            console.log(erro)
        }
    }

    async deletefile(req, res) {
        try {
            const filename = req.body.filename
            const fileid = req.body.fileid
            const result = await this.connectdb.ShowFileDeatil(req)
            cloudinary.uploader.destroy(result.url, { invalidate: true })
            await this.connectdb.Deletefile(filename, fileid)
        } catch (error) {
            console.log(error)
        }
    }

    async Editfile(req, res) {
        try {
            const newfilename = req.body.newfilename
            const oldfilename = req.body.filename
            const fileid = req.body.fileid
            const filedetail = await this.connectdb.ShowFileDeatil(req)
            await this.connectdb.Editfile(oldfilename, newfilename, fileid)
            cloudinary.uploader.rename(filedetail[0].fileid)
        }
        catch (error) {
            console.log(error)
        }
    }

    async Showfiledetail(req, res) {
        try {
            const ownername = await this.connectdb.FindOwner(req.session.filedeatil[0].ownerId)
            const downloadurl = cloudinary.url(req.session.filedeatil[0].url, {
                flags: 'attachment'
            })
            const image = cloudinary.url(req.session.filedeatil[0].url)
            res.render('file/filedetail', { filedetail: req.session.filedeatil, Owner: ownername.username, url: downloadurl, image: image })
        } 
        catch(error) {
            console.log(error)
        }
    }
}


module.exports = {
    Crud
}