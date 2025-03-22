const express = require("express");
const router = express.Router();

const multer  = require('multer');
const{storage}=require("../cloudConfig.js");
const upload = multer({ storage })

const { listingSchema } = require("../schemaValidate.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

//VALIDATE LISTINGS THROUGH JOI
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }


}
//INDEX ROUTE AND CREATE NEW LISTING ROUTE
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));


//CREATE NEW ROUTE
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewListing));


//SHOW ROUTE AND UPDATE ROUTE
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing));



//DELETE ROUTE
router.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));



//EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

//SHOW LISTING BY CATEGORY FILTER
router.get("/category/:category", wrapAsync(listingController.categoryFilter));

module.exports = router;