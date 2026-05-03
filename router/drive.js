const express = require('express')
const multer  = require('multer')
const passport = require('passport')
const path = require('path');


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
    fileSize : 5 * 1024 * 1024 ,
    files : 4
} , storage : storage})


const Router = express()


Router.get('/' , (req,res) => {
    if (req.user) {
        res.render('drive/drivepage' , {user : req.user })
    } else {
        res.redirect('/')
    }
})


Router.post('/upload' , upload.single('fileupload') , (req,res , next) => {
    console.log(req.file)
    res.redirect("/")
})


module.exports = Router

