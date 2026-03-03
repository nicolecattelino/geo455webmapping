//const map = L.map("map").setView([44.24408087004536, -89.63411348536166], 7);

var streets = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
    tileSize: 512,
    zoomOffset: -1
});

var USGS_USImageryTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 18,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

var topo = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
    layers: 'SRTM30-Colored-Hillshade'
});

var map = L.map("map", {
  center: [6.794952075439587, 20.91148703911037],
  zoom: 3,
  layers: [USGS_USImageryTopo]
});

var homeCenter = map.getCenter(); 
var homeZoom = map.getZoom();

L.easyButton(('<img src="Home_icon_black.png", height=70%>'), function () {
    map.setView(homeCenter, homeZoom);
}, "Home").addTo(map);

/*Create custom popups with images*/
var greatwallPopup = "Great Wall of China<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/20090529_Great_Wall_8185.jpg/256px-20090529_Great_Wall_8185.jpg' alt='great wall wiki' width='150px'/>";

var chichenPopup = "Chichen-Itza<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/003_El_Castillo_o_templo_de_Kukulkan._Chich%C3%A9n_Itz%C3%A1%2C_M%C3%A9xico._MPLC.jpg/256px-003_El_Castillo_o_templo_de_Kukulkan._Chich%C3%A9n_Itz%C3%A1%2C_M%C3%A9xico._MPLC.jpg' width='150px'/>";

var petraPopup = "Petra<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/The_Monastery%2C_Petra%2C_Jordan8.jpg/256px-The_Monastery%2C_Petra%2C_Jordan8.jpg' width='150px'/>";

var machuPopup = "Machu Pichu<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/256px-Machu_Picchu%2C_Peru.jpg' width='150px'/>";

var christPopup = "Christ the Redeemer<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Aerial_view_of_the_Statue_of_Christ_the_Redeemer.jpg/256px-Aerial_view_of_the_Statue_of_Christ_the_Redeemer.jpg' width='150px'/>";

var coloPopup = "Colosseum<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg/256px-Colosseum_in_Rome-April_2007-1-_copie_2B.jpg' width='150px'/>";

var tajPopup = "Taj Mahal<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Taj-Mahal.jpg/256px-Taj-Mahal.jpg' width='150px'/>";

var customOptions ={'maxWidth': '150','className' : 'custom'};

/*LayerGroup and Data Array*/
var landmarks = L.layerGroup().addTo(map);

var wonders = [
    { name: "Great Wall of China", coords: [40.4505, 116.5490], popupHtml: greatwallPopup },
    { name: "Chichen-Itza", coords: [20.6793, -88.5682], popupHtml: chichenPopup },
    { name: "Petra", coords: [30.3285, 35.4444], popupHtml: petraPopup },
    { name: "Machu Pichu", coords: [-13.1629, -72.5450], popupHtml: machuPopup },
    { name: "Christ the Redeemer", coords: [-22.9517, -43.2104], popupHtml: christPopup },
    { name: "Colosseum", coords: [41.8902, 12.4922], popupHtml: coloPopup },
    { name: "Taj Mahal", coords: [27.1753, 78.0421], popupHtml: tajPopup },
];

function addWondersToLayer(dataArray, layerGroup) {

for (var i = 0; i < dataArray.length; i++) {
    var feature = dataArray[i]; // Going through each feature

    var marker = L.marker(feature.coords); // Create a marker from the coordinates

    marker.bindPopup(feature.popupHtml, customOptions); // Bind the popup (with custom CSS className and maxWidth)


    marker.bindTooltip(feature.name, {
    direction: "top",
    sticky: true,
    opacity: 0.9});

    marker.addTo(layerGroup);
  }
}// Add the markers to the layer group

addWondersToLayer(wonders, landmarks);

/* Adding the Great Wall of China Line */
var lines = L.layerGroup();
var greatWallLineCoords = [
    [40.45058574410227, 116.54903113946699],
    [40.44940804004364, 116.55324919831969],
    [40.44714494004076, 116.55510028845048],
    [40.44545911200895, 116.55455406535388],
    [40.44428131665059, 116.55637480900924],
    [40.44060923386488, 116.56019837128976],
    [40.43557422832096, 116.56189773235194],
    [40.431023921892326, 116.56441642808237],
    [40.43005690361108, 116.56583967643232],
    [40.42912280914733, 116.56815090383526],
    [40.42817101495977, 116.56756399877838]
];

var greatWallLine = L.polyline(greatWallLineCoords, {weight: 14}).addTo(lines);

greatWallLine.bindPopup(greatwallPopup, customOptions);
greatWallLine.bindTooltip("Great Wall of China", { sticky: true });

greatWallLine.on("click", function () {
    map.fitBounds(greatWallLine.getBounds());
});

lines.addTo(map);

/* Layer control and Menu Item */

var baseLayers = {
  Imagery: USGS_USImageryTopo,
  Hillshade: topo,
  Streets: streets
};

var overlays = {
  "Seven Wonders": landmarks,
  "Great Wall": lines
};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);