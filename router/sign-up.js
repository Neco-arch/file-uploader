const bcrypt = require("bcryptjs");
const express = require("express")
const { DbPart } = require("../models/quries.js")
const { Checkauthuser } = require('../controller/auth.js')

const DbQuery = new DbPart

const router = express()

router.get("/" , Checkauthuser ,  (req,res , next) => {
    if (!req.authUser) {
        return res.render("sign-up/sign-up")
    } else {
        return res.redirect("/")
    }
})

router.post("/register" , async (req,res) => {
    const result = await DbQuery.InsertNewUser(req.body.username , req.body.password , req.body.email );
    res.redirect("/")
})


module.exports = router