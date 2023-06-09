const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { cloudinary } = require("../cloudinary/index");

const ImageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
});

ImageSchema.virtual("thumbnail").get(function () {
  if (this.url.includes("cloudinary")) {
    return this.url.replace("/upload", "/upload/w_200");
  } else {
    return this.url.replace("&w=400", "&w=200");
  }
});

const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    images: [ImageSchema],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    location: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

CampgroundSchema.post("findOneAndDelete", async function (campground) {
  if (campground.reviews) {
    await Review.deleteMany({ _id: { $in: campground.reviews } });
  }
  if (campground.images) {
    for (let img of campground.images) {
      if (img.url.includes("cloudinary")) await cloudinary.uploader.destroy(img.filename);
    }
  }
});

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.location}</p>`;
});

module.exports = mongoose.model("Campground", CampgroundSchema);
