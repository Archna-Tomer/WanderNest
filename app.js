require('dotenv').config();
console.log(process.env.KEY);

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const passportLocal=require("passport-local");   //LOCAL STRATEGY
const passportLocalMongoose=require("passport-local-mongoose");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");
const Listing = require('./models/listing.js');
const wrapAsync = require('./utils/wrapAsync.js');



main().then(() => {
    console.log('connected to database');

}).catch((err) => {
    console.log(err);

})
async function main() {
    await mongoose.connect(process.env.MONGO_ATLAS);
}


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store=MongoStore.create({
    mongoUrl:process.env.MONGO_ATLAS,
    crypto: {
        secret: process.env.SECRET,
      },
      touchAfter:24*3600,

})
store.on("error",()=>{
    console.log("Error in mongo store",err);
})

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000, //cookie expires in 7 days
        maxAge:7*24*60*60*1000,
        httpOnly:true

    }
}

app.use(session(sessionOptions));
app.use(flash());  //flash can be implement when session is implement only.
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
    console.log("User in session:", req.user);
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    

    next();
});

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//MIDDLEWARES FOR ROUTERS
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// console.log(process.env.MONGO_ATLAS);

app.get("/",wrapAsync(async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });

}))
//MIDDLEWARES FOR ERROR HANDLING
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.render("error.ejs", { message });
})


app.listen(3000, () => {
    console.log("app is listening on port 3000");

})