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
      normalizeChart(map.distance(markerA.getLatLng(), markerB.getLatLng()))
    ]
  }]);
}