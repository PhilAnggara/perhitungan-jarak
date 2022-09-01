AOS.init({
  once: true,
  delay: 50,
  duration: 600
});

const mapboxAccessToken = 'pk.eyJ1IjoiamVuaWZlcmRhbWFyIiwiYSI6ImNrcTZrYXY2cDFzeXIyb280eTBndTAwMHMifQ.AAdI5SToEU4ITSvEqPcGIA';
const input = document.getElementById("locationInput");
const suggestion = document.getElementById("suggestion");
const searchRadius = 10; // km
let defaultLocation = {
  lat: 1.5044916272099944,
  lng: 124.87264035846945
};

var userIcon = L.icon({
  iconUrl: 'frontend/images/marker-icon-a.png',
  shadowUrl: 'frontend/images/marker-shadow-2x.png',
  iconSize:     [33, 42],
  shadowSize:   [50, 64],
  iconAnchor:   [17, 42],
  shadowAnchor: [16, 63],
  popupAnchor:  [-3, -76]
});
var ambulanceIcon = L.icon({
  iconUrl: 'frontend/images/marker-icon-ambulance.png',
  shadowUrl: 'frontend/images/marker-shadow-2x.png',
  iconSize:     [33, 42],
  shadowSize:   [50, 64],
  iconAnchor:   [17, 42],
  shadowAnchor: [16, 63],
  popupAnchor:  [0, -40]
});

var map = L.map('map').setView([1.4822795012983179, 124.86507303747182], 13);
L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: '© PhilAnggara',
  subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

var userMarker = L.marker(defaultLocation, {
  icon: userIcon,
  draggable: true,
}).addTo(map);
var circle = L.circle(defaultLocation, {
  radius: searchRadius * 1000,
  weight: 0.5,
}).addTo(map);
var ambulancesMarkers = L.layerGroup().addTo(map);
var polygon;

showAmbulancesInRadius();
setLocationName();
getUserLocation();

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
  userMarker.setLatLng([position.coords.latitude, position.coords.longitude]);
  circle.setLatLng([position.coords.latitude, position.coords.longitude]);
  map.flyTo([position.coords.latitude, position.coords.longitude]);
  setLocationName();
  showAmbulancesInRadius()
  clearCalculate();
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

function setLocationName() {
  const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+userMarker.getLatLng().lng+','+userMarker.getLatLng().lat+'.json?reverseMode=distance&language=id&access_token='+mapboxAccessToken;
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
  .catch(err => {
    console.log(err);
  });
}

userMarker.on('drag', function(e) {
  circle.setLatLng(e.target.getLatLng());
  input.value = 'Mendapatkan nama lokasi...';
  input.classList.add('text-muted');
  input.setAttribute('readonly', 'readonly');
  if (polygon) {
    map.removeLayer(polygon);
  }
});
userMarker.on('dragend', function(e) {
  map.panTo(e.target.getLatLng());
  setLocationName();
  showAmbulancesInRadius();
  clearCalculate();
});

function searchLocation() {
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
    console.clear();
    if (input.value !== '') {
      if (data.features.length > 0) {
        console.log(data.features);
        data.features.forEach((e, i) => {
          console.log(i+1);
          console.log(e.text);
          console.log(e.center[1]+', '+e.center[0]);
          console.log(e);
        });
        const html = data.features.map(e => `
          <button
            type="button"
            class="list-group-item list-group-item-action"
            onclick="selectLocation(${e.center[1]}, ${e.center[0]}, '${e.text}')"
          >
            ${e.place_name}
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
  })
  .catch(err => {
    console.log(err);
  });
}

function selectLocation(lat, lng, text) {
  input.value = text;
  userMarker.setLatLng([lat, lng]);
  circle.setLatLng([lat, lng]);
  map.flyTo([lat, lng]);
  showAmbulancesInRadius();
  clearCalculate();
}

document.addEventListener('click', function(e) {
  suggestion.classList.add('d-none');
})

function showAmbulancesInRadius() {
  fetch('storage/data.json')
  .then(response =>  response.json())
  .then(data => {
    ambulancesMarkers.clearLayers();
    console.clear();
    data.forEach((e, i) => {
      const distance = (map.distance(userMarker.getLatLng(), [e.geopoint._latitude, e.geopoint._longitude])/1000).toFixed(2);
      if (distance <= searchRadius) {
        const popUp = '<p class="mb-1 fw-bold fs-6 text-center">'+e.namaInstansi+'</p><p class="mb-0 fw-bold"><i class="fa-regular fa-truck-medical text-primary"></i> '+e.namaDriver+' <span class="badge text-bg-secondary">'+e.platNomor+'</span></p><p class="mb-1 text-muted"><i class="fa-regular fa-square-phone text-success"></i> '+e.kontakPicAmbulance+'</p><p class="mb-0 text-center"><small>'+distance+' km</small></p>';
        console.log(data[i]);
        L.marker([e.geopoint._latitude, e.geopoint._longitude], {
          icon: ambulanceIcon,
        }).bindPopup(popUp).addTo(ambulancesMarkers);
      }
    });
  });
}

map.on('popupopen', function(e) {
  calculateDistance(userMarker.getLatLng().lat, userMarker.getLatLng().lng, e.popup._source._latlng.lat, e.popup._source._latlng.lng);
  if (polygon) {
    map.removeLayer(polygon);
  }
  polygon = L.polygon([userMarker.getLatLng(), [e.popup._source._latlng.lat, e.popup._source._latlng.lng]], {
    color: 'red'
  }).addTo(map);
});

function clearCalculate() {
  if (polygon) {
    map.removeLayer(polygon);
  }
  chart.updateSeries([{
    data: [0, 0, 0, 0]
  }]);
  document.getElementById('euclidean').value = '';
  document.getElementById('spherical').value = '';
  document.getElementById('haversine').value = '';
  
  document.getElementById('euclideanAccuracy').value = '';
  document.getElementById('sphericalAccuracy').value = '';
  document.getElementById('haversineAccuracy').value = '';
}