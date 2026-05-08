const cloudinary = require('cloudinary').v2
const express = require('express')
const multer  = require('multer')
const path = require('path');
const { DbPart } = require('../models/quries');
const { error } = require('console');
const fs = require('node:fs')

const connectdb = new DbPart

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        cb(null, path.join(__dirname , '../public/data'))
    }
  },
  filename: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/data')
    const filePath = path.join(uploadPath, file.originalname)

    let counter = 1

    if (fs.existsSync(filePath)) {
        const newfilename = file.originalname + `(${counter})`
        counter ++ 
        cb(null , newfilename)
    }
    cb(null, file.originalname)
  }
})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECERT,
})


const upload = multer({limits : {
    fileSize : 50 * 1024 * 1024 ,
    files : 2
} , storage : storage})


const Router = express()


Router.get('/' , async (req,res) => {
    const folder = await connectdb.ViewFolder(req,res)
    const files = await connectdb.ShowFile('/drive' , req)
    if (req.user) {
        res.render('drive/drivepage' , {user : req.user , items : folder , files : files })
    } else {
        res.redirect('/')
    }
})

// CRUD Folder

Router.get('/:foldername' , async (req,res) => {
    const realurl = '/drive' + req.url
    const files = await connectdb.ShowFile(realurl , req)
    console.log(files)
    res.render('drive/drivefolder', {foldername : req.url , Files : files} )
})

Router.post('/viewfolder' , async (req,res) => {
    const path = '/drive' + '/' + req.body.foldername
    res.redirect(path)
})

Router.post('/createfolder' , async (req,res) => {
    await connectdb.InsertFolderDetail(req,res)  
    res.redirect("/drive")
})

Router.post('/deletefolder' , async (req,res) => { 
    await connectdb.DeleteFolder(req,res)
    res.redirect('/drive')
})

Router.post('/editfolder' , async (req,res) => {
    const foldername = req.body.foldername
    const folderid = req.body.folderid
    const newfoldername = req.body.newfoldername
    await connectdb.EditFoldername(foldername,newfoldername,folderid)
    res.redirect("/drive")
}) 

// CRUD File

Router.post('/upload' , upload.single('fileupload') , async (req,res) => {
    try {
        const result = await cloudinary.uploader.upload(
            req.file.path , {
            fetch_format: 'auto',
            quality: 'auto',
            }
        )
        req.cloudinaryurl = result
        const result2 = await connectdb.InsertFileDetail(req,res)
        await fs.unlinkSync(req.file.path)
        res.redirect("/drive")
    } catch(erro) {
        console.log(erro)
    }
})

Router.post('/deletefile' , async (req,res) => {
    const filename = req.body.filename
    const fileid = req.body.fileid
    const result = await connectdb.ShowFileDeatil(req)
    cloudinary.uploader.destroy(result.url , {invalidate : true} )
    await connectdb.Deletefile(filename,fileid)
    res.redirect('/drive')
})

Router.post('/editfile' , async (req,res) => {
    const newfilename = req.body.newfilename
    const oldfilename = req.body.filename
    const fileid = req.body.fileid
    const filedetail = await connectdb.ShowFileDeatil(req)
    await connectdb.Editfile(oldfilename,newfilename,fileid)
    cloudinary.uploader.rename(filedetail[0].fileid)
    res.redirect('/drive')
})

// File Detail

Router.post('/viewfile' , async (req,res) => {
    const fileDetail = await connectdb.ShowFileDeatil(req);
    req.session.filedeatil = fileDetail
    res.redirect('/drive/file/filedetail')
})

Router.get('/file/filedetail' , async (req,res) => {
    const ownername = await connectdb.FindOwner(req.session.filedeatil[0].ownerId)
    const downloadurl = cloudinary.url(req.session.filedeatil[0].url , {
        flags : 'attachment'
    })
    const image = cloudinary.url(req.session.filedeatil[0].url)
    res.render('file/filedetail' , {filedetail : req.session.filedeatil , Owner : ownername.username , url : downloadurl , image : image })
})



module.exports = Router

