const express = require('express')
const multer  = require('multer')
const passport = require('passport')
const path = require('path');
const { DbPart } = require('../models/quries')

const connectdb = new DbPart

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname , '../public/data'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }


})
const upload = multer({limits : {
    fileSize : 10 * 1024 * 1024 ,
    files : 4
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

Router.get('/:foldername' , async (req,res) => {
    const files = await connectdb.ShowFile(req.url , req)
    res.render('drive/drivefolder', {foldername : req.url.foldername , Files : files} )
})

Router.post('/viewfolder' , async (req,res) => {
    const path = '/drive' + '/' + req.body.foldername
    res.redirect(path)
})



Router.post('/createfolder' , async (req,res) => {
    await connectdb.InsertFolderDetail(req,res)  
    res.redirect("/drive")
})


Router.post('/upload' , upload.single('fileupload') , async (req,res) => {
    await connectdb.InsertFileDetail(req,res)
    res.redirect("/drive")
})


module.exports = Router

