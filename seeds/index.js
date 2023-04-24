const path = require("path");
const mongoose = require("mongoose");
const Campground = require("../models/campground");

const cities = require("./cities");
const { places, descriptors, randomImages } = require("./seedHelpers");

require("dotenv").config({ path: path.join(__dirname, "/../.env") });

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("CONNECTION OPEN!!!");
  } catch (error) {
    console.log("OH NO ERROR!!!!");
    console.log(err);
  }
}

main();

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  const campgroundImages = await randomImages(35);
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    let random = Math.floor(Math.random() * 1000);
    let price = Math.floor(Math.random() * 20) + 10;
    let camp = new Campground({
      author: "64392786765f2b21c6fb1850",
      location: `${cities[random].city}, ${cities[random].state}`,
      geometry: { type: "Point", coordinates: [cities[random].longitude, cities[random].latitude] },
      title: `${sample(descriptors)} ${sample(places)}`,
      images: Array.from({ length: 2 }, () => sample(campgroundImages)),
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam reprehenderit tempora quae. Aperiam, hic fugit molestiae, illum delectus, aut aspernatur omnis quis vitae mollitia saepe similique enim dolorem quia repellendus?",
      price: price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
