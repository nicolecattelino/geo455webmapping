// ===============================
// BASEMAPS + MAP SETUP
// ===============================
var USGS_USImagery = L.tileLayer(
  'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16,
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

var Esri_WorldTopoMap = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});

var mymap = L.map('map', {
  center: [35.64282870549498, -83.54749712586067],
  zoom: 10,
  layers: [Esri_WorldTopoMap]
});

// ===============================
// UI CONTROLS
// ===============================

// Home button
var homeCenter = mymap.getCenter();
var homeZoom = mymap.getZoom();

L.easyButton('<img src="images/globe_icon.png" height="60%"/>', function () {
  mymap.setView(homeCenter, homeZoom);
}, "Home").addTo(mymap);

// Scale bar
L.control.scale({ position: 'bottomright' }).addTo(mymap);

// Mini map
var miniLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');

new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(mymap);

// ===============================
// HELPER FUNCTIONS
// ===============================

// Highlight toggle
function setupHighlight(layerGroup) {
  layerGroup.eachLayer(function (layer) {
    layer.on("click", function () {
      if (layer._selected) {
        layerGroup.resetStyle(layer);
        layer._selected = false;
      } else {
        layer.setStyle({ color: "yellow", weight: 6 });
        layer._selected = true;
      }
    });
  });
}

// Parking icon size
function getIconSize(value) {
  return value >= 100 ? 35 :
         value >= 50  ? 20 :
                        15;
}

// ===============================
// VIEWPOINT IMAGES
// ===============================
var viewpointImages = {
  "Clingmans Dome Tower": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/2017-05-17_13_36_07_View_from_near_the_top_of_the_ramp_to_the_Clingmans_Dome_Observation_Tower.jpg/960px-thumbnail.jpg",
  "Look Rock Tower": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Look_Rock_Observation_Tower.jpg/960px-thumbnail.jpg",
  "Shuckstack": "https://upload.wikimedia.org/wikipedia/commons/6/66/Shuckstack-fontana.jpg",
  "Cove Mountain Fire Tower": "https://upload.wikimedia.org/wikipedia/commons/f/f2/Cove-mtn-air-quality-station-tn1.jpg",
  "Mt. Cammerer Lookout Tower": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Mount_Cammerer_Firetower.jpg",
  "Mt. Sterling Lookout Tower": "images/sterling.jpg"
};

// ===============================
// LOAD ALL DATA
// ===============================
Promise.all([
  fetch("boundary.geojson").then(r => r.json()),
  fetch("easy_trails.geojson").then(r => r.json()),
  fetch("mod_trails.geojson").then(r => r.json()),
  fetch("hard_trails.geojson").then(r => r.json()),
  fetch("parking.geojson").then(r => r.json()),
  fetch("view_towers.geojson").then(r => r.json())
]).then(([boundaryData, easyData, modData, hardData, parkingData, viewpointData]) => {

  // ===============================
  // BOUNDARY
  // ===============================
  var boundaryLayer = L.geoJSON(boundaryData, {
    style: {
      color: "black",
      weight: 2,
      fill: false,
      opacity: 0.8
    }
  }).addTo(mymap);

  // ===============================
  // TRAILS
  // ===============================
  function trailPopup(feature) {
    return "<b>Trail Name:</b> " + feature.properties.TRAILNAME +
           "<br><b>Length:</b> " + feature.properties.LENGTH_MI + " miles" +
           "<br><br><a href='https://www.nps.gov/grsm/planyourvisit/hiking.htm' target='_blank'>More info about hiking the park trails</a>";
  }

  var easyLayer = L.geoJSON(easyData, {
    style: { color: "green", weight: 3, opacity: 0.8 },
    onEachFeature: (f, l) => l.bindPopup(trailPopup(f))
  }).addTo(mymap);

  var moderateLayer = L.geoJSON(modData, {
    style: { color: "orange", weight: 3, opacity: 0.8 },
    onEachFeature: (f, l) => l.bindPopup(trailPopup(f))
  }).addTo(mymap);

  var hardLayer = L.geoJSON(hardData, {
    style: { color: "red", weight: 3, opacity: 0.8 },
    onEachFeature: (f, l) => l.bindPopup(trailPopup(f))
  }).addTo(mymap);

  setupHighlight(easyLayer);
  setupHighlight(moderateLayer);
  setupHighlight(hardLayer);

  // ===============================
  // PARKING (CLUSTERED + INDIVIDUAL)
  // ===============================
  var parkingClusters = L.markerClusterGroup();

  var parkingLayer = L.geoJSON(parkingData, {

    pointToLayer: function (feature, latlng) {
      var spaces = feature.properties.parking || 0;
      var size = getIconSize(spaces);

      var icon = L.icon({
        iconUrl: "images/car_icon.png",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2]
      });

      return L.marker(latlng, { icon: icon });
    },

    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "<b>Location:</b> " + feature.properties.LOC_NAME +
        "<br><b>Parking Spaces:</b> " + (feature.properties.parking || 0)
      );
    }

  });

  parkingClusters.addLayer(parkingLayer);

  // ===============================
  // VIEWPOINTS
  // ===============================
  var viewpointLayer = L.geoJSON(viewpointData, {

    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: "images/tower_icon.png",
          iconSize: [20, 20],
          iconAnchor: [8, 8]
        })
      });
    },

    onEachFeature: function (feature, layer) {
      var name = feature.properties.LOC_NAME;
      var img = viewpointImages[name];

      layer.bindPopup(
        "<b>Viewpoint:</b> " + name +
        "<br><b>Type:</b> " + feature.properties.DATAACCESS +
        "<br><br>" +
        (img ? "<img src='" + img + "' width='220'>" : "<i>No photo available</i>")
      );
    }

  });

  // ===============================
  // SEARCH
  // ===============================
  var allTrailsLayer = L.layerGroup([
    easyLayer,
    moderateLayer,
    hardLayer
  ]);

  var searchControl = new L.Control.Search({
    layer: allTrailsLayer,
    propertyName: 'TRAILNAME',
    marker: false,
    position: 'topright',
    collapsed: false,
    textPlaceholder: 'Search for a trail...',
    moveToLocation: function(latlng, title, map) {
      map.fitBounds(latlng.layer.getBounds());
    }
  });

  mymap.addControl(searchControl);

  // ===============================
  // LAYER CONTROL
  // ===============================
  var baseLayers = {
    "Satellite": USGS_USImagery,
    "Topography": Esri_WorldTopoMap
  };

  var overlays = {
    "🟩 Easy Trails": easyLayer,
    "🟧 Moderate Trails": moderateLayer,
    "🟥 Hard Trails": hardLayer,
    "<img src='images/car_icon.png' height=16> Parking (individual)": parkingLayer,
    "<img src='images/cluster_icon.png' height=16> Parking (clustered)": parkingClusters,
    "<img src='images/tower_icon.png' height=16> View towers": viewpointLayer
  };

  L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(mymap);

});