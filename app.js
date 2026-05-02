require('dotenv/config');

const path = require("node:path");
const { Pool } = require("pg");
const express = require("express");
const expressSession = require('express-session');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const { prismaController } = require("./lib/prisma.js")
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')


const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))

// Router 
const sign_up = require('./router/sign-up.js')

app.use('/sign-up' , sign_up )


// Passport 

const { serializeUser , deserializeUser} = require("./passport/serialize_deserial.js")
const { Strategy } = require("./passport/verify.js")
app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: process.env.SECERT,
    resave: true,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prismaController ,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(passport.session());
passport.use(Strategy)
passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)


//Router in main

app.get("/", (req, res) => res.render("main" , {user : req.user}));

app.get("/log-in" , (req,res) => {
  res.render("log-in/log-in")
})

app.post("/log-in" , (req,res) => {
  passport.authenticate("local" , {
    successRedirect : "/",
    failureRedirect : "/log-in"
  })
})

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});
