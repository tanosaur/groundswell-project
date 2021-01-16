mapboxgl.accessToken = config.MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: config.MAP_STYLE,
  center: config.MAP_CENTER,
  zoom: 10,
});

const geocoder = new MapboxGeocoder({
  accessToken: config.MAPBOX_TOKEN,
  mapboxgl: mapboxgl,
  marker: {
    color: config.SHARP_COLOR,
  },
});

(function addGeocoder() {
  document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
  document.getElementsByClassName("mapboxgl-ctrl-geocoder--input")[0].placeholder = "E.g. NW6 7QB, Manchester";
  document.getElementsByClassName("mapboxgl-ctrl-geocoder--input")[0].focus();
})();

function showLocation(location) {
  flyTo(location);
  selectedMarker(location);
  selectedListing(location);
  selectedViewToggles();
  lastLocation = location;
}

function flyTo(location) {
  let shifted = null;

  if (window.innerWidth > config.BREAKPOINT) {
    shifted = [location.geometry.coordinates[0] - 0.031, location.geometry.coordinates[1]];
  } else {
    shifted = [location.geometry.coordinates[0], location.geometry.coordinates[1] - 0.005];
  }

  if (location.geometry) {
    map.flyTo({
      center: shifted,
      zoom: 12,
    });
  }
}

function selectedMarker(location) {
  // let selectedMarker = document.getElementById(location.properties.Id);
  new mapboxgl.Popup({
    offset: 20,
    closeOnClick: true,
    closeButton: false,
  }).setLngLat(location.geometry.coordinates)
  .setHTML(location.properties.Name)
  .addTo(map); //don't know why i have to recreate this again
}

function mapMarker(location, orgs) {
  let marker = document.createElement("div");
  if (orgs) {
    marker.className = "orgs-marker";
    marker.id = "orgs" + location.properties.Id;
  } else {
    marker.className = "events-marker";
    marker.id = "events" + location.properties.Id;
  }

  new mapboxgl.Marker({
      element: marker,
  }).setLngLat(location.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({
      offset: 20,
      closeButton: false,
      closeonClick: true,
      })
    .setHTML(location.properties.Name)) //this should be able to be deleted but why not?
  .addTo(map);

  marker.addEventListener("click", function(e) {
    showLocation(location);
  });
}

function clearPopup() {
  const popups = document.getElementsByClassName("mapboxgl-popup");
  if (popups[0]) popups[0].remove();
}
