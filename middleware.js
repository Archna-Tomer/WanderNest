const Listing = require("./models/listing");
const Review = require("./models/review");
module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You have to logged in to make changes in listing");
        return res.redirect(`/login`);
    }
    next();
}
//ONLU AUTHORISED PERSON CAN MAKE CHANGES IN LISTING (LIKE EDIT OR DELETE)
module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
     const listing=await Listing.findById(id);
     if( !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You do not have access");
        return res.redirect(`/listings/${id}`);

     }
     next();
}
//ONLY AUTHORISED PERSON CAN DELETE THE REVIEW
module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewId}=req.params;
     const review=await Review.findById(reviewId);
     if( !review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this review");
        return res.redirect(`/listings/${id}`);

     }
     next();
}