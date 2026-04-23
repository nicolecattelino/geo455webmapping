var USGS_USImagery = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});

var mymap = L.map('map', {
    center: [35.64282870549498, -83.54749712586067],
    zoom: 10,
    layers: Esri_WorldTopoMap
});

//Easy button variables and controls
var homeCenter = mymap.getCenter(); 
var homeZoom = mymap.getZoom();
L.easyButton('<img src="images/globe_icon.png" height="60%"/>', function () {
    mymap.setView(homeCenter, homeZoom);
}, "Home").addTo(mymap);

//Scale bar
L.control.scale({
    position: 'bottomright'
}).addTo(mymap);

// Minimap
var miniLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add minimap control
var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(mymap);

function setupHighlight(layerGroup) {

  layerGroup.eachLayer(function (layer) {

    layer.on("click", function () {

      if (layer._selected) {
        layerGroup.resetStyle(layer);
        layer._selected = false;
      } else {
        layer.setStyle({
          color: "yellow",
          weight: 6
        });
        layer._selected = true;
      }

    });

  });

}

var boundaryLayer = L.geoJSON(boundary, {
  style: function () {
    return {
      color: "black",
      weight: 2,
      fill: false,
      opacity: 0.8
    };
  }
}).addTo(mymap);

// Easy trails
var easyLayer = L.geoJSON(easyTrails, {
  style: function () {
    return {
      color: "green",
      weight: 3,
      opacity: 0.8
    };
  },

  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<b>Trail Name:</b> " + feature.properties.TRAILNAME +
      "<br><b>Length:</b> " + feature.properties.LENGTH_MI + " miles"
    );
  }
});

// Moderate trails
var moderateLayer = L.geoJSON(moderateTrails, {
  style: function () {
    return {
      color: "orange",
      weight: 3,
      opacity: 0.8
    };
  },

  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<b>Trail Name:</b> " + feature.properties.TRAILNAME +
      "<br><b>Length:</b> " + feature.properties.LENGTH_MI + " miles"
    );
  }
}).addTo(mymap);

// Hard trails
var hardLayer = L.geoJSON(hardTrails, {
  style: function () {
    return {
      color: "red",
      weight: 3,
      opacity: 0.8
    };
  },

  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<b>Trail Name:</b> " + feature.properties.TRAILNAME +
      "<br><b>Length:</b> " + feature.properties.LENGTH_MI + " miles"
    );
  }
});

setupHighlight(easyLayer, "green");
setupHighlight(moderateLayer, "orange");
setupHighlight(hardLayer, "red");

// Parking lot icon sizes
function getIconSize(value) {
  return value >= 89 ? 34 :
         value >= 43 ? 30 :
         value >= 21 ? 26 :
         value >= 8  ? 22 :
                       18;
}


var parkingClusters = L.markerClusterGroup();



// Parking layer icon
var parkingLayer = L.geoJSON(parkingSpots, {

  pointToLayer: function (feature, latlng) {

    var spaces = feature.properties.parking || 0;
    var size = getIconSize(spaces);

    var carIcon = L.icon({
      iconUrl: "images/car_icon.png",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2]
    });

    return L.marker(latlng, { icon: carIcon });
  },

  onEachFeature: function (feature, layer) {

    var spaces = feature.properties.parking || 0;

    layer.bindPopup(
      "<b>Location:</b> " + feature.properties.LOC_NAME +
      "<br><b>Parking Spaces:</b> " + spaces +
      "<br><b>Type:</b> " + feature.properties.TYPE
    );
  }
});

parkingClusters.addLayer(parkingLayer);
mymap.addLayer(parkingClusters);

// Search box
/*var searchControl = new L.Control.Search({
    position:'topright',
    layer: peaks,
    propertyName: 'TITLE',
    marker: false,
    markeranimate: true,
    delayType: 50,
    collapsed: false,
    textPlaceholder: 'Search by Peak Name: e.g. Everest, Lhotse',   
    moveToLocation: function(latlng, title, map) {
        mymap.setView(latlng, 15);}
}); 

mymap.addControl(searchControl); */

/* Layer control and Menu Item */

var baseLayers = {
  Satellite: USGS_USImagery,
  Topography: Esri_WorldTopoMap
};

var overlays = {
  "🟩 Easy Trails": easyLayer,
  "🟧 Moderate Trails": moderateLayer,
  "🟥 Hard Trails": hardLayer,
  "<img src='images/cluster_icon.png' height=16> Parking (Clustered)": parkingClusters
};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(mymap);