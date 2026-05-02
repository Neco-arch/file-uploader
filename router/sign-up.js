const bcrypt = require("bcryptjs");
const express = require("express")
const { DbPart } = require("../models/quries")

const DbQuery = new DbPart

const router = express()

router.get("/" , (req,res) => {
    res.render("sign-up/sign-up")
})

router.post("/register" , async (req,res) => {
    const result = await DbQuery.InsertNewUser(req.body.username , req.body.password , req.body.email );
    res.redirect("/")
})


module.exports = router