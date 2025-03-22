
const Listing = require("../models/listing.js");

module.exports.index=async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });

}
module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
   
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
}
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const detail = await Listing.findById(id).populate({path:"reviews",populate:{ path:"author"}}).populate("owner");
    if(!detail){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
//    console.log("owned by"+ detail.owner);
    res.render("listings/show.ejs", { detail });

}
module.exports.renderNewListing= (req, res) => {
    //ONLY CREATE LISTING IF USER IS LOGGED IN
   
    res.render("listings/new.ejs");

}
module.exports.createListing=async (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send Valid Data");
    }
    let url=req.file.path;
    let filename=req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    // console.log(newListing);
    res.redirect("/listings");
}

module.exports.editListing=async (req, res) => {
    
    let { id } = req.params;
   
    const detail = await Listing.findById(id);
    if(!detail){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl=detail.image.url;
    originalImageUrl= originalImageUrl.replace("/upload","/upload/h_50,w_250");
    res.render("listings/edit.ejs", { detail,originalImageUrl });

}
module.exports.updateListing=async (req, res) => {

    let { id } = req.params;
  

    const listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect("/listings");
}
module.exports.categoryFilter=async(req,res)=>{
    let{category}=req.params;
   const filteredListings= await Listing.find({category});
    res.render("listings/index.ejs", { allListing: filteredListings});
}

