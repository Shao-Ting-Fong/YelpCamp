const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const axios = require("axios");

const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

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

async function seedImg() {
  try {
    const res = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "VYbuIk2HJcXNCAwnzfX9lJ7e_ypvWWsMRAuDZ-tC_R0",
        collections: 483251,
      },
    });

    return res.data.urls.small;
  } catch (err) {
    console.error(err);
  }
}

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 2; i++) {
    let random = Math.floor(Math.random() * 1000);
    let price = Math.floor(Math.random() * 20) + 10;
    let camp = new Campground({
      author: "64392786765f2b21c6fb1850",
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: await seedImg(),
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam reprehenderit tempora quae. Aperiam, hic fugit molestiae, illum delectus, aut aspernatur omnis quis vitae mollitia saepe similique enim dolorem quia repellendus?",
      price: price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
