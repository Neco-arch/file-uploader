const cloudinary = require('cloudinary').v2
const express = require('express')
const multer  = require('multer')
const path = require('path');
const { DbPart } = require('../models/quries');
const fs = require('node:fs');
const { Crud } = require('../models/crud');


// Load models
const connectdb = new DbPart
const crud = new Crud

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

const upload = multer({limits : {
    fileSize : 50 * 1024 * 1024 ,
    files : 1
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
    await crud.UploadFile(req,res)
    res.redirect("/drive")
})

Router.post('/deletefile' , async (req,res) => {
    await crud.deletefile(req,res)
    res.redirect('/drive')
})

Router.post('/editfile' , async (req,res) => {
    await crud.Editfile(req,res)
    res.redirect('/drive')
})

// File Detail

Router.post('/viewfile' , async (req,res) => {
    const fileDetail = await connectdb.ShowFileDeatil(req);
    req.session.filedeatil = fileDetail
    res.redirect('/drive/file/filedetail')
})

Router.get('/file/filedetail' , async (req,res) => {
    await crud.Showfiledetail(req,res)
})



module.exports = Router

