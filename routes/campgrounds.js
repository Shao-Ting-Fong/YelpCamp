const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../validateSchemas");

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((ele) => ele.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get(
    "/",
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);

router.get("/new", (req, res) => {
    res.render("campgrounds/new");
});

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id).populate("reviews");
        if (!campground) {
            req.flash("error", "Campground not found :(");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { campground });
    })
);

router.get(
    "/:id/edit",
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            req.flash("error", "Campground not found :(");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", { campground });
    })
);

router.post(
    "/",
    validateCampground,
    catchAsync(async (req, res) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash("success", "Successfully made a new campground!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.put(
    "/:id",
    validateCampground,
    catchAsync(async (req, res) => {
        const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground }, { new: true, runValidators: true });
        req.flash("success", "Successfully updated!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    "/:id",
    catchAsync(async (req, res) => {
        await Campground.findByIdAndDelete(req.params.id);
        req.flash("success", "Successfully deleted campground!");
        res.redirect("/campgrounds");
    })
);

module.exports = router;
