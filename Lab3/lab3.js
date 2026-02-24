const map = L.map("map").setView([44.24408087004536, -89.63411348536166], 7);

L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { // Picked gray basemap because it is uncluttered and makes the balloon icons easy to notice
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

const myIcon = L.icon({
    iconUrl: 'images/balloon_clipart.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});

var monroe = L.marker([42.6022742,-89.62834953], {icon: myIcon})
  .bindPopup("<b>Monroe Balloons and Bands Festival</b><br>Time of event: Mid-June").addTo(map);

var rns = L.marker([43.56667519,-90.88702085], {icon: myIcon})
  .bindPopup("<b>Rise & Shine Balloon Rally</b><br>Time of event: Late June").addTo(map);

var tng = L.marker([44.97397585,-89.796432], {icon: myIcon})
  .bindPopup("<b>Taste N' Glow Balloon Fest</b><br>Time of event: Mid-July").addTo(map);

var dairy = L.marker([44.70859672,-90.1258743], {icon: myIcon})
  .bindPopup("<b>Dairyland Balloon Jubilee</b><br>Time of event: Mid-July").addTo(map);

var paper = L.marker([44.27282424,-88.34700422], {icon: myIcon})
  .bindPopup("<b>Paperfest</b><br>Time of event: Mid-July").addTo(map);

var eaa = L.marker([43.9798155,-88.56752573], {icon: myIcon})
  .bindPopup("<b>EAA Airventure</b><br>Time of event: Late July").addTo(map);

var salute = L.marker([45.67854072,-89.42352885], {icon: myIcon})
  .bindPopup("<b>Saluting Heroes Balloon Rally</b><br>Time of event: Early August").addTo(map);

var lake = L.marker([44.0916171,-87.65644432], {icon: myIcon})
  .bindPopup("<b>Lakeshore Balloon Rally</b><br>Time of event: Early August").addTo(map);

var burger = L.marker([44.50726762,-88.33742266], {icon: myIcon})
  .bindPopup("<b>Burgerfest</b><br>Time of event: Mid-August").addTo(map);

var summer = L.marker([44.22947193,-88.3316257], {icon: myIcon})
  .bindPopup("<b>Summer In The Park - Flight Night</b><br>Time of event: Mid-August").addTo(map);

var igNight = L.marker([44.51909157,-88.01641863], {icon: myIcon})
  .bindPopup("<b>igNight Market</b><br>Time of event: Mid-August").addTo(map);