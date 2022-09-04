function euclidean(lat1, lon1, lat2, lon2) {
  const d = Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)) * 100000;
  document.getElementById('euclidean').value = normalize(d);

  return d;
}

function spherical(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180
  const d = Math.acos(Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)) * R;
  document.getElementById('spherical').value = normalize(d);

  return d;
}

function haversine(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of earth in KM
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c * 1000; // Distance in m
  document.getElementById('haversine').value = normalize(d);

  return d;
}

function normalize(x) {
  if (x >= 1000) {
    return (x / 1000).toFixed(3) + ' km';
  } else {
    return x.toFixed(1) + ' m';
  }
}

function normalizeChart(x) {
  return (x / 1000).toFixed(2) + ' km';
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  chart.updateSeries([{
    data: [
      normalizeChart(euclidean(lat1, lon1, lat2, lon2)),
      normalizeChart(spherical(lat1, lon1, lat2, lon2)),
      normalizeChart(haversine(lat1, lon1, lat2, lon2)),
      normalizeChart(map.distance([lat1, lon1], [lat2, lon2]))
    ]
  }]);
  accuracy(lat1, lon1, lat2, lon2)
}

function accuracy(lat1, lon1, lat2, lon2) {
  const a = euclidean(lat1, lon1, lat2, lon2);
  const b = spherical(lat1, lon1, lat2, lon2);
  const c = haversine(lat1, lon1, lat2, lon2);
  const d = L.latLng(lat1, lon1).distanceTo(L.latLng(lat2, lon2));
  const dd = map.distance([lat1, lon1], [lat2, lon2]);
  // accuracy of each method in percent
  const euclideanAccuracy = (a / d) * 100;
  const sphericalAccuracy = (b / d) * 100;
  const haversineAccuracy = (c / d) * 100;

  console.clear();
  console.log('euclidean: ' + a/1000 + ' km');
  console.log('spherical: ' + b/1000 + ' km');
  console.log('haversine: ' + c/1000 + ' km');
  console.log('leaflet: ' + d/1000 + ' km');
  console.log('');
  console.log('akurasi euclidean : ');
  console.log('(' + d/1000 + ' / ' + a/1000 + ') * 100 = ' + euclideanAccuracy.toFixed(2) + ' %');
  console.log('');
  console.log('akurasi spherical : ');
  console.log('(' + d/1000 + ' / ' + b/1000 + ') * 100 = ' + sphericalAccuracy.toFixed(2) + ' %');
  console.log('');
  console.log('akurasi haversine : ');
  console.log('(' + d/1000 + ' / ' + c/1000 + ') * 100 = ' + haversineAccuracy.toFixed(2) + ' %');
  
  if (document.getElementById('euclideanAccuracy')) {
    document.getElementById('euclideanAccuracy').value = euclideanAccuracy.toFixed(2) + ' %';
  }
  if (document.getElementById('sphericalAccuracy')) {
    document.getElementById('sphericalAccuracy').value = sphericalAccuracy.toFixed(2) + ' %';
  }
  if (document.getElementById('haversineAccuracy')) {
    document.getElementById('haversineAccuracy').value = haversineAccuracy.toFixed(2) + ' %';
  }
}