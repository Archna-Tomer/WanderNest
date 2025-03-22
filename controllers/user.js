const User=require("../models/user.js");



module.exports.renderSignUp=(req,res)=>{
    res.render("./listings/signup.ejs");
}
module.exports.signUp=async(req,res)=>{
   try{
    let{username,email,password}=req.body;
    let newUser=new User({username,email});
   const detailUser= await User.register(newUser,password);
   req.flash("success","Registered Successfully!");
   res.redirect("/listings");
   }catch(e){
    req.flash("error",e.message);
    res.redirect("/signup")
   }
   
}
module.exports.renderLogin=(req,res)=>{
    res.render("listings/login.ejs");
}
module.exports.login=async(req,res)=>{
    // console.log(req.user);
    req.flash("success","Welcome to WanderNest!");
    res.redirect("/listings");

}
module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error("Error during logout:", err);
            return next(err);
        }
        // console.log("User logged out successfully:", req.user); 
        req.flash("success", "Successfully logged out!");
        res.redirect("/listings");
    });
}