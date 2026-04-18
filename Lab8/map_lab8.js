var basemap = L.tileLayer('https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.cat" target="_blank">Breton OpenStreetMap Team</a>'
});

var mymap = L.map('map', {
    center: [43.09157730670122, -89.41174811804763],
    zoom: 7,
    layers: basemap,
});  

var cities = L.geoJson(loc, {
     style: function (feature) {
        return { fillColor: 'rgba(206, 154, 177, 0.63)', fillOpacity: 0.25,
               color: '#014bb9c5', weight: 2, opacity: 1};
    },
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindTooltip(feature.properties.NAME, {permanent: false, direction: 'right'});
    }
}).addTo(mymap);
    
mymap.fitBounds(cities.getBounds());

var migrationLayer = new L.migrationLayer({
    map: mymap,
    data: data,
    pulseRadius:20,
    pulseBorderWidth:1,
    arcWidth:5,
    arcLabel:false,
    arcLabelFont:'14px sans-serif',
    maxWidth:10
});

migrationLayer.addTo(mymap);

function hide(){
    migrationLayer.hide();
}
function show(){
    migrationLayer.show();
}
function play(){
    migrationLayer.play();
}
function pause(){
    migrationLayer.pause();
}
function returnto(){
  window.location.href = "../index.html";
}