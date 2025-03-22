const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
// const Listing = require("../models/listing.js");
const {reviewSchema}=require("../schemaValidate.js");
const ExpressError=require("../utils/ExpressError.js");
// const Review=require("../models/review.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controllers/review.js");

//VALIDATE REVIEW THROUGH JOI
const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}



//POST REVIEW ROUTE
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));
//delete review

router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewController.deleteReview));
module.exports=router;