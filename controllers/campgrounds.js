const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary/index");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds, title: "All Campgrounds" });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new", { title: "New Campground" });
};

module.exports.createCampground = async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map((ele) => ({ url: ele.path, filename: ele.filename }));
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Campground not found :(");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground, title: "Campground Info" });
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Campground not found :(");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground, title: "Edit Campground" });
};

module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const { deleteImages } = req.body;
  const campground = await Campground.findById(id);
  const addImages = req.files.map((ele) => ({ url: ele.path, filename: ele.filename }));
  Object.assign(campground, req.body.campground);
  campground.images.push(...addImages);
  if (deleteImages) {
    const foundImage = campground.images.filter((img) => {
      return deleteImages.includes(img._id.toString()) && img.url.includes("cloudinary");
    });
    foundImage.forEach(async (img) => await cloudinary.uploader.destroy(img.filename));
  }

  await campground.updateOne({ $pull: { images: { _id: { $in: deleteImages } } } });

  await campground.save();
  req.flash("success", "Successfully updated!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
