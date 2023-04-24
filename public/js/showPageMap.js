mapboxgl.accessToken = mapToken;
const coordinates = campground.geometry.coordinates;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/outdoors-v12", // style URL
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker()
  .setLngLat(coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h5>${campground.title}</h5><p>${campground.location}</p>`))
  .addTo(map);

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, "top-right");
