const path = require("path");
const axios = require("axios");

require("dotenv").config({ path: path.join(__dirname, "/../.env") });

async function seedImg() {
  try {
    const res = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: process.env.UNSPLASH_CLIENT_ID,
        collections: 483251,
        orientation: "landscape",
      },
    });

    return { url: res.data.urls.small, filename: res.data.id };
  } catch (err) {
    console.error(err);
  }
}

module.exports.descriptors = ["Forest", "Ancient", "Petrified", "Roaring", "Cascade", "Tumbling", "Silent", "Redwood", "Bullfrog", "Maple", "Misty", "Elk", "Grizzly", "Ocean", "Sea", "Sky", "Dusty", "Diamond"];

module.exports.places = [
  "Flats",
  "Village",
  "Canyon",
  "Pond",
  "Group Camp",
  "Horse Camp",
  "Ghost Town",
  "Camp",
  "Dispersed Camp",
  "Backcountry",
  "River",
  "Creek",
  "Creekside",
  "Bay",
  "Spring",
  "Bayshore",
  "Sands",
  "Mule Camp",
  "Hunting Camp",
  "Cliffs",
  "Hollow",
];

module.exports.randomImages = async (num) => {
  const imgPromises = Array.from({ length: num }, async (ele) => {
    return await seedImg();
  });
  const images = await Promise.all(imgPromises);
  return images;
};

// async function main() {
//   const result = await randomImages(2);
//   console.log(result);
// }

// main();
