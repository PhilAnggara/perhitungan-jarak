AOS.init({
  once: true,
  delay: 50,
  duration: 600
});

const toastTriggerA = document.getElementById('copyA')
const toastLiveExampleA = document.getElementById('liveToastA')
if (toastTriggerA) {
  toastTriggerA.addEventListener('click', () => {
    const toast = new bootstrap.Toast(toastLiveExampleA)

    toast.show()
  })
}
const toastTriggerB = document.getElementById('copyB')
const toastLiveExampleB = document.getElementById('liveToastB')
if (toastTriggerB) {
  toastTriggerB.addEventListener('click', () => {
    const toast = new bootstrap.Toast(toastLiveExampleB)

    toast.show()
  })
}


// Hybrid: s,h;
// Satellite: s;
// Streets: m;
// Terrain: p;
var map = L.map('map').setView([1.4822795012983179, 124.86507303747182], 13);
L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 19,
  attribution: '© PhilAnggara',
  subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

var aIcon = L.icon({
  iconUrl: 'frontend/images/marker-icon-a.png',
  shadowUrl: 'frontend/images/marker-shadow.png',

  iconSize:     [33, 42],
  shadowSize:   [50, 64],
  iconAnchor:   [16, 42],
  shadowAnchor: [16, 63],
  popupAnchor:  [-3, -76]
});
var bIcon = L.icon({
  iconUrl: 'frontend/images/marker-icon-b.png',
  shadowUrl: 'frontend/images/marker-shadow.png',

  iconSize:     [33, 42],
  shadowSize:   [50, 64],
  iconAnchor:   [16, 42],
  shadowAnchor: [16, 63],
  popupAnchor:  [-3, -76]
});

var markerA = L.marker([1.5049181818799706, 124.87268109746775], {
  icon: aIcon,
  draggable: true,
}).addTo(map);
var markerB = L.marker([1.4907184564345943, 124.83914510504695], {
  icon: bIcon,
  draggable: true,
}).addTo(map);
var polygon = L.polygon([
  [markerA.getLatLng().lat, markerA.getLatLng().lng],
  [markerB.getLatLng().lat, markerB.getLatLng().lng]
]).addTo(map);

var euclideanResult = euclidean(markerA.getLatLng().lat, markerA.getLatLng().lng, markerB.getLatLng().lat, markerB.getLatLng().lng);
var sphericalResult = spherical(markerA.getLatLng().lat, markerA.getLatLng().lng, markerB.getLatLng().lat, markerB.getLatLng().lng);
var haversineResult = haversine(markerA.getLatLng().lat, markerA.getLatLng().lng, markerB.getLatLng().lat, markerB.getLatLng().lng);

showResult(euclideanResult, sphericalResult, haversineResult);

document.getElementById('latA').value = markerA.getLatLng().lat;
document.getElementById('lngA').value = markerA.getLatLng().lng;
document.getElementById('latB').value = markerB.getLatLng().lat;
document.getElementById('lngB').value = markerB.getLatLng().lng;

markerA.on('move', function(e) {
  // console.log('Marker A : ',markerA.getLatLng().lat, markerA.getLatLng().lng);
  document.getElementById('latA').value = markerA.getLatLng().lat;
  document.getElementById('lngA').value = markerA.getLatLng().lng;
  polygon.setLatLngs([
    [markerA.getLatLng().lat, markerA.getLatLng().lng],
    [markerB.getLatLng().lat, markerB.getLatLng().lng]
  ]);
  showResult(
    euclidean(markerA.getLatLng().lat, markerA.getLatLng().lng, markerB.getLatLng().lat, markerB.getLatLng().lng),
    spherical(markerA.getLatLng().lat, markerA.getLatLng().lng, markerB.getLatLng().lat, markerB.getLatLng().lng),
    haversine(markerA.getLatLng().lat, markerA.getLatLng().lng, markerB.getLatLng().lat, markerB.getLatLng().lng)
  );
});

markerB.on('move', function(e) {
  // console.log('Marker B : ',markerB.getLatLng().lat, markerB.getLatLng().lng);
  document.getElementById('latB').value = markerB.getLatLng().lat;
  document.getElementById('lngB').value = markerB.getLatLng().lng;
  polygon.setLatLngs([
    [markerA.getLatLng().lat, markerA.getLatLng().lng],
    [markerB.getLatLng().lat, markerB.getLatLng().lng]
  ]);
  showResult(
    euclidean(markerA.getLatLng().lat, markerA.getLatLng().lng, markerB.getLatLng().lat, markerB.getLatLng().lng),
    spherical(markerA.getLatLng().lat, markerA.getLatLng().lng, markerB.getLatLng().lat, markerB.getLatLng().lng),
    haversine(markerA.getLatLng().lat, markerA.getLatLng().lng, markerB.getLatLng().lat, markerB.getLatLng().lng)
  );
});

console.log(euclidean(markerA.getLatLng().lat, markerA.getLatLng().lng, markerB.getLatLng().lat, markerB.getLatLng().lng));
console.log(spherical(markerA.getLatLng().lat, markerA.getLatLng().lng, markerB.getLatLng().lat, markerB.getLatLng().lng));
console.log(haversine(markerA.getLatLng().lat, markerA.getLatLng().lng, markerB.getLatLng().lat, markerB.getLatLng().lng));

function euclidean(lat1, lon1, lat2, lon2) {
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)) * 100000;
}

function spherical(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180
  const d = Math.acos(Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)) * R;

  return d;
}

// calculate distance between two points in latitude and longitude using haversine formula
function haversine(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of earth in KM
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}

function showResult(euclideanResult, sphericalResult, haversineResult) {
  document.getElementById('euclidean').value = normalize(euclideanResult);
  document.getElementById('spherical').value = normalize(sphericalResult);
  document.getElementById('haversine').value = normalize(haversineResult);
}

function normalize(x) {
  if (x >= 1000) {
    return (x / 1000).toFixed(3) + ' km';
  } else {
    return x.toFixed(1) + ' m';
  }
}

function copyToClipboard(latId, lngId) {
  var lat = document.getElementById(latId);
  var lng = document.getElementById(lngId);
  navigator.clipboard.writeText(lat.value + ',' + lng.value);
}