const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const userController=require("../controllers/user.js");
//SIGNUP USER
router.route("/signup")
.get(userController.renderSignUp)
.post(wrapAsync(userController.signUp));

//LOGIN USER
router.route("/login")
.get(userController.renderLogin)
.post(passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);




//LOGOUT USER
router.get("/logout", userController.logout);



module.exports=router;