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
  iconUrl: 'frontend/images/marker-a.png',
  iconSize:     [37, 47],
  iconAnchor:   [18, 45],
  popupAnchor:  [-3, -76]
});
var bIcon = L.icon({
  iconUrl: 'frontend/images/marker-b.png',
  iconSize:     [37, 47],
  iconAnchor:   [18, 45],
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

function euclidean (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
function spherical (x1, y1, x2, y2) {
  return Math.acos(Math.sin(x1) * Math.sin(x2) + Math.cos(x1) * Math.cos(x2) * Math.cos(y2 - y1));
}
function haversine (x1, y1, x2, y2) {
  return 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((x1 - x2) / 2), 2) + Math.cos(x1) * Math.cos(x2) * Math.pow(Math.sin((y1 - y2) / 2), 2)));
}

function showResult(euclideanResult, sphericalResult, haversineResult) {
  document.getElementById('euclidean').value = normalize(euclideanResult);
  document.getElementById('spherical').value = normalize(sphericalResult);
  document.getElementById('haversine').value = normalize(haversineResult);
}

function normalize(x) {
  result = x * 100;
  if (result < 1) {
    result *= 1000;
    return result.toFixed() + ' m';
  } else {
    return result.toFixed(3) + ' km'; 
  }
}

function copyToClipboard(latId, lngId) {
  var lat = document.getElementById(latId);
  var lng = document.getElementById(lngId);
  navigator.clipboard.writeText(lat.value + ',' + lng.value);
}