AOS.init({
  once: true,
  delay: 50,
  duration: 600
});


mapboxgl.accessToken = 'pk.eyJ1IjoiamVuaWZlcmRhbWFyIiwiYSI6ImNrcTZrYXY2cDFzeXIyb280eTBndTAwMHMifQ.AAdI5SToEU4ITSvEqPcGIA';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: [-74.5, 40], // starting position [lng, lat]
zoom: 9, // starting zoom
projection: 'globe' // display the map as a 3D globe
});
map.on('style.load', () => {
map.setFog({}); // Set the default atmosphere style
});