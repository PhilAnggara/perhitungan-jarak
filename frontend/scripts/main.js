AOS.init({
  once: true,
  delay: 50,
  duration: 600
});

const mapboxAccessToken = 'pk.eyJ1IjoiamVuaWZlcmRhbWFyIiwiYSI6ImNrcTZrYXY2cDFzeXIyb280eTBndTAwMHMifQ.AAdI5SToEU4ITSvEqPcGIA';
const inputA = document.getElementById("inputA");
const inputB = document.getElementById("inputB");
const radius = 10;

let lokasiA = {
  lat: 1.5049181818799706,
  lng: 124.87268109746775
};
let lokasiB = {
  lat: 1.4907184564345943,
  lng: 124.83914510504695
};

var aIcon = L.icon({
  iconUrl: 'frontend/images/marker-icon-a.png',
  shadowUrl: 'frontend/images/marker-shadow-2x.png',
  iconSize:     [33, 42],
  shadowSize:   [50, 64],
  iconAnchor:   [16, 42],
  shadowAnchor: [16, 63],
  popupAnchor:  [-3, -76]
});
var bIcon = L.icon({
  iconUrl: 'frontend/images/marker-icon-b.png',
  shadowUrl: 'frontend/images/marker-shadow-2x.png',
  iconSize:     [33, 42],
  shadowSize:   [50, 64],
  iconAnchor:   [16, 42],
  shadowAnchor: [16, 63],
  popupAnchor:  [-3, -76]
});
var ambulanceIcon = L.icon({
  iconUrl: 'frontend/images/marker-icon-ambulance.png',
  shadowUrl: 'frontend/images/marker-shadow-2x.png',
  iconSize:     [33, 42],
  shadowSize:   [50, 64],
  iconAnchor:   [16, 42],
  shadowAnchor: [16, 63],
  popupAnchor:  [0, -40]
});

var map = L.map('map').setView([1.4822795012983179, 124.86507303747182], 13);
L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: '© PhilAnggara',
  subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

var markerA = L.marker(lokasiA, {
  icon: aIcon,
  draggable: true,
}).addTo(map);
var markerB = L.marker(lokasiB, {
  icon: bIcon,
  draggable: true,
}).addTo(map);
var ambulancesMarkers = L.layerGroup().addTo(map);
var polygon = L.polygon([lokasiA, lokasiB]).addTo(map);
var circle = L.circle([lokasiA.lat, lokasiA.lng], {
  radius: radius * 1000,
  weight: 0.5,
}).addTo(map);

getUserLocation();
setLocationName(lokasiA.lat, lokasiA.lng, inputA);
setLocationName(lokasiB.lat, lokasiB.lng, inputB);
refreshMap()

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError, {
      enableHighAccuracy: true,
    });
  } else {
    console.log("Geolokasi tidak didukung oleh browser ini.");
  }
}
function showPosition(position) {
  setLocationName(position.coords.latitude, position.coords.longitude, inputA);
  markerA.setLatLng([position.coords.latitude, position.coords.longitude]);
  map.flyToBounds([markerA.getLatLng(), markerB.getLatLng()]);
  polygon.setLatLngs([markerA.getLatLng(), markerB.getLatLng()]);
  circle.setLatLng([position.coords.latitude, position.coords.longitude]);
  refreshMap()
}
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      console.log("Pengguna menolak permintaan Geolokasi.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Informasi lokasi tidak tersedia.");
      break;
    case error.TIMEOUT:
      console.log("Permintaan untuk mendapatkan lokasi pengguna kedaluwarsa.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("Terjadi kesalahan yang tidak diketahui.");
      break;
  }
}

markerA.on('drag', function(e) {
  findingLocationName(inputA);
  polygon.setLatLngs([markerA.getLatLng(), markerB.getLatLng()]);
  circle.setLatLng([markerA.getLatLng().lat, markerA.getLatLng().lng]);
});
markerB.on('drag', function(e) {
  findingLocationName(inputB);
  polygon.setLatLngs([markerA.getLatLng(), markerB.getLatLng()]);
});

function findingLocationName(input) {
  input.value = 'Mendapatkan nama lokasi...';
  input.classList.add('text-muted');
  input.setAttribute('readonly', 'readonly');
}

markerA.on('dragend', function(e) {
  setLocationName(markerA.getLatLng().lat, markerA.getLatLng().lng, inputA);
  refreshMap()
});
markerB.on('dragend', function(e) {
  setLocationName(markerB.getLatLng().lat, markerB.getLatLng().lng, inputB);
  refreshMap()
});

function setLocationName(lat, lng, input) {
  const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+lng+','+lat+'.json?reverseMode=distance&language=id&access_token='+mapboxAccessToken;
  input.removeAttribute('readonly');
  fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  })
  .then(data => {
    input.value = data.features[0].text;
    input.classList.remove('text-muted');
  })
  .catch(error => {
    console.log(error);
  });
}

function searchLocation(inputId, suggestionId) {
  const input = document.getElementById(inputId);
  const suggestion = document.getElementById(suggestionId);
  const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+input.value+'.json?country=id&limit=10&language=id&access_token='+mapboxAccessToken;
  suggestion.classList.remove('d-none');
  fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  })
  .then(data => {
    showSuggestion(data, input, suggestion);
    console.log(keyword);
  })
  .catch(error => {
    console.log(error);
  });
}

const showSuggestion = (data, input, suggestion) => {
  console.clear();
  if (input.value !== '') {
    if (data.features.length > 0) {
      console.log(data.features);
      data.features.forEach((element, index) => {
        console.log(index);
        console.log(element.relevance);
        console.log(element.place_name);
        console.log(element.center[1]+', '+element.center[0]);
      });
      const html = data.features.map(element => `
        <button
          type="button"
          class="list-group-item list-group-item-action"
          onclick="selectLocation(${element.center[1]}, ${element.center[0]}, '${element.text}', '${input.id}')"
        >
          ${element.place_name}
        </button>
      `).join('');
      suggestion.innerHTML = html;
    } else {
      console.log('Lokasi tidak ditemukan.');
      suggestion.innerHTML ='<button type="button" class="list-group-item list-group-item-action text-center" disabled>Lokasi tidak ditemukan.</button>';
    }
  } else {
    suggestion.innerHTML = '';
  }
}

function selectLocation(lat, lng, text, inputId) {
  const input = document.getElementById(inputId);
  input.value = text;
  if (inputId === 'inputA') {
    markerA.setLatLng([lat, lng]);
  } else {
    markerB.setLatLng([lat, lng]);
  }
  map.flyToBounds([markerA.getLatLng(), markerB.getLatLng()]);
  polygon.setLatLngs([markerA.getLatLng(), markerB.getLatLng()]);
  circle.setLatLng([markerA.getLatLng().lat, markerA.getLatLng().lng]);
  refreshMap()
}

document.addEventListener('click', function handleClickOutsideBox(event) {
  document.getElementById('suggestionA').classList.add('d-none');
  document.getElementById('suggestionB').classList.add('d-none');
});

function showAmbulancesInRadius() {
  fetch('storage/data.json')
  .then(response =>  response.json())
  .then(data => {
    ambulancesMarkers.clearLayers();
    data.forEach(e => {
      const distance = (map.distance(markerA.getLatLng(), [e.geopoint._latitude, e.geopoint._longitude])/1000).toFixed(2);
      if (distance <= radius) {
        const popUp = '<p class="mb-1 fw-bold fs-6 text-center">'+e.namaInstansi+'</p><p class="mb-0 fw-bold"><i class="fa-regular fa-truck-medical text-primary"></i> '+e.namaDriver+' <span class="badge text-bg-secondary">'+e.platNomor+'</span></p><p class="mb-1 text-muted"><i class="fa-regular fa-square-phone text-success"></i> '+e.kontakPicAmbulance+'</p><p class="mb-0 text-center"><small>'+distance+' km</small></p>';
        
        L.marker([e.geopoint._latitude, e.geopoint._longitude], {
          icon: ambulanceIcon,
        }).bindPopup(popUp).addTo(ambulancesMarkers);
      }
    });
  });
}

function refreshMap() {
  calculateDistance(markerA.getLatLng().lat, markerA.getLatLng().lng, markerB.getLatLng().lat, markerB.getLatLng().lng)
  showAmbulancesInRadius();
}