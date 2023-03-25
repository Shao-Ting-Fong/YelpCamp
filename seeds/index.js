const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground');

const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("CONNECTION OPEN!!!")
  } catch (error) {
    console.log("OH NO ERROR!!!!")
    console.log(err)
  }
}

main();

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    let random = Math.floor(Math.random() * 1000);
    let camp = new Campground({
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    })
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
})