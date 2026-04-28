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
      "<br><b>Length:</b> " + feature.properties.LENGTH_MI + " miles" + 
      "<br><br><a href='https://www.nps.gov/grsm/planyourvisit/hiking.htm' target='_blank'>More info about hiking the park trails</a>"
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
      "<br><b>Length:</b> " + feature.properties.LENGTH_MI + " miles" + 
      "<br><br><a href='https://www.nps.gov/grsm/planyourvisit/hiking.htm' target='_blank'>More info about hiking the park trails</a>"
    );
  }
});

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
      "<br><b>Length:</b> " + feature.properties.LENGTH_MI + " miles" + 
      "<br><br><a href='https://www.nps.gov/grsm/planyourvisit/hiking.htm' target='_blank'>More info about hiking the park trails</a>"
    );
  }
});

setupHighlight(easyLayer, "green");
setupHighlight(moderateLayer, "orange");
setupHighlight(hardLayer, "red");

// Parking lot icon sizes
function getIconSize(value) {
  return value >= 89 ? 35 :
         value >= 43 ? 30 :
         value >= 21 ? 25 :
         value >= 8  ? 20 :
                       15;
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
      "<br><b>Parking Spaces:</b> " + spaces
    );
  }
});

parkingClusters.addLayer(parkingLayer);

// View tower images
var viewpointImages = {
  "Clingmans Dome Tower": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/2017-05-17_13_36_07_View_from_near_the_top_of_the_ramp_to_the_Clingmans_Dome_Observation_Tower_in_Great_Smoky_Mountains_National_Park%2C_on_the_border_of_Sevier_County%2C_Tennessee_and_Swain_County%2C_North_Carolina.jpg/960px-thumbnail.jpg?_=20170923223808",
  "Look Rock Tower": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/2017-05-17_19_41_34_View_south_from_the_Look_Rock_Observation_Tower_at_Look_Rock_along_Foothills_Parkway_in_Great_Smoky_Mountains_National_Park%2C_within_Blount_County%2C_Tennessee.jpg/960px-thumbnail.jpg?_=20170924044716",
  "Shuckstack": "https://upload.wikimedia.org/wikipedia/commons/6/66/Shuckstack-fontana.jpg?_=20070819234834",
  "Cove Mountain Fire Tower": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Cove-mtn-air-quality-station-tn1.jpg/500px-Cove-mtn-air-quality-station-tn1.jpg?_=20091012213534",
  "Mt. Cammerer Lookout Tower": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Mount_Cammerer_Firetower_%28245735700%29.jpg/960px-Mount_Cammerer_Firetower_%28245735700%29.jpg?_=20240822180408",
  "Mt. Sterling Lookout Tower": "images/sterling.jpg"
};


// Viewpoints
var viewpointLayer = L.geoJSON(viewpoints, {

  pointToLayer: function (feature, latlng) {

    var vpIcon = L.icon({
      iconUrl: "images/camera_icon.png",
      iconSize: [20, 20],
      iconAnchor: [8, 8]
    });

    return L.marker(latlng, { icon: vpIcon });
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

// Search box
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

/* Layer control and Menu Item */

var baseLayers = {
  Satellite: USGS_USImagery,
  Topography: Esri_WorldTopoMap
};

var overlays = {
  "🟩 Easy Trails": easyLayer,
  "🟧 Moderate Trails": moderateLayer,
  "🟥 Hard Trails": hardLayer,
  "<img src='images/car_icon.png'height=16> Parking lots (individual)": parkingLayer,
  "<img src='images/cluster_icon.png' height=16> Parking lots (clustered)": parkingClusters,
  "<img src='images/camera_icon.png'height=16> View towers": viewpointLayer
};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(mymap);