const Listing = require("../models/listing");

// geocoding
// https://docs.maptiler.com/client-js/
//https://api.maptiler.com/geocoding/8.528509,47.3774434.json?key=YOUR_MAPTILER_API_KEY
// const mbxGeocoding = require("@mapbox/mabox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const maptilerClient = require("@maptiler/client");

// Or import only the bits you need
const {
  config,
  geocoding,
  geolocation,
  coordinates,
  data,
  staticMaps,
  elevation,
  math,
} = require("@maptiler/client");
maptilerClient.config.apiKey = mapToken;

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  // in an async function, or as a 'thenable':
  const result = await maptilerClient.geocoding.forward(
    req.body.listing.location,
    { limit: 1 }
  );

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = result.features[0].geometry;
  
  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // in an async function, or as a 'thenable':
  const result = await maptilerClient.geocoding.forward(
    req.body.listing.location,
    { limit: 1 }
  );
  listing.geometry = result.features[0].geometry;
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    let updatedListing=await listing.save();
    console.log(updatedListing);
  }else{
    let updatedListing2=await listing.save();
    console.log(updatedListing2);
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
