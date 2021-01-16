const config = {
  MAPBOX_TOKEN: 'pk.eyJ1IjoiZ3JvdW5kc3dlbGwtYWRtaW4iLCJhIjoiY2tqeThneDI4MHA1aDJubndwdHN2N3F4ZiJ9.EHo8XTT5sjssUO-ejcF81w',
  ORGS_URL: "https://docs.google.com/spreadsheets/d/1MICdnJ5CnjIh2kYodN4vdFEN0r94Gbbdv7o4Xvkq1O4/gviz/tq?tqx=out:csv&sheet=Organisations",
  EVENTS_URL: "https://docs.google.com/spreadsheets/d/1MICdnJ5CnjIh2kYodN4vdFEN0r94Gbbdv7o4Xvkq1O4/gviz/tq?tqx=out:csv&sheet=Events",
  LATITUDE_FIELD: "Latitude",
  LONGITUDE_FIELD: "Longitude",
  MAP_STYLE: "mapbox://styles/groundswell-admin/ckjzlwiu90o0017tcoks030j7",
  MAP_CENTER: [-0.12, 51.5], //London
  HIGHLIGHT_COLOR: "#92d2d6",
  AREAS_OF_WORK: "Areas of Work",
  HELP_NEEDED: "Help Needed",
  SHOW_FIRST: ["anti-hate", "interfaith", "bame", "business support"],
  BREAKPOINT: 760,
};

let lastLocation = null;

(function orgsFromGoogleSheet() {
  const oReq = new XMLHttpRequest();

  let url = config.ORGS_URL;
  oReq.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
  oReq.send();

  oReq.onload = function(e) {
    csv2geojson.csv2geojson(oReq.responseText, {
      latfield: config.LATITUDE_FIELD,
      lonfield: config.LONGITUDE_FIELD,
      delimiter: ","
    }, function (err, geojson) {
      geojson.features.forEach(function (location, index) {
        location.properties.Id = index;
        listing(location, true);
        mapMarker(location, true);
        collectFilters(location);
      });
      sortByDistance(config.MAP_CENTER, true);
      formatFilters(); // Rewrite as Promise
    });
  };
})();

(function eventsFromGoogleSheet() {
  const oReq = new XMLHttpRequest();

  let url = config.EVENTS_URL;
  oReq.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
  oReq.send();

  oReq.onload = function(e) {
    csv2geojson.csv2geojson(oReq.responseText, {
      latfield: config.LATITUDE_FIELD,
      lonfield: config.LONGITUDE_FIELD,
      delimiter: ","
    }, function (err, geojson) {
      geojson.features.forEach(function (location, index) {
        location.properties.Id = index;
        listing(location, false);
        mapMarker(location, false);
        collectFilters(location);
      });
      sortByDistance(config.MAP_CENTER, false);
    });
  };
})();
