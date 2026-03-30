// Create map:
var mymap = L.map("map", {
  center: [51.48882027639122, -0.1028811094342392],
  zoom: 11
});

var grey = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(mymap);

var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; OpenStreetMap'
});

/* ---------------------------------------------------------
   Add minimap  — use OSM tiles (no API key needed)
   --------------------------------------------------------- */

// Add minimap control
var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(mymap);

// Color values for choropleth map
function getColorDensity(value) {
    return value > 139 ? '#54278f':
           value > 87  ? '#756bb1':
           value > 53  ? '#9e9ac8':
           value > 32  ? '#cbc9e2':
                         '#f2f0f7';
}

// Color values for language choropleth map
function getColorLanguage(value) {
    return value > 6.450409 ? '#08519c' :
           value > 4.432128 ? '#3182bd' :
           value > 2.250533 ? '#6baed6' :
           value > 0.985702 ? '#bdd7e7' :
                          '#eff3ff';
}

//Styling of borders
function styleDensity(feature){
    return {
        fillColor: getColorDensity(feature.properties.pop_den),   
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
} 

// Styling of language density borders
function styleLanguage(feature){
    return {
        fillColor: getColorLanguage(feature.properties.no_eng_den),
        weight: 2,
        opacity: 1,
        color: '#696969',
        fillOpacity: 0.9
    };
}

/* ---------------------------------------------------------
   Highlight function
   --------------------------------------------------------- */
function highlightFeature(e) {
  var layer = e.target;
  
  layer.setStyle({
    weight: 5,
    color: '#666',
    fillOpacity: 0.7
  });
  
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

/* ---------------------------------------------------------
   Reset function
   --------------------------------------------------------- */
function resetDensityHighlight(e) {
  densitylayer.resetStyle(e.target);
  e.target.closePopup();
}

/* ---------------------------------------------------------
   Reset function for language density
   --------------------------------------------------------- */
function resetLanguageHighlight(e) {
  languagelayer.resetStyle(e.target);
  e.target.closePopup();
}

/* ---------------------------------------------------------
  Interaction function
   --------------------------------------------------------- */
function onEachDensityFeature(feature, layer) {
  layer.bindPopup(
    '<strong>' + feature.properties.NAME + '</strong><br>' + 
    '<span style="color:purple">' + feature.properties.pop_den + ' people/hectares</span>'
  );
  
  layer.on({
    mouseover: function (e) {
      highlightFeature(e);
      e.target.openPopup();
    },
    mouseout: resetDensityHighlight
  });
}

/* ---------------------------------------------------------
  Interaction function for language layer
   --------------------------------------------------------- */
function onEachLanguageFeature(feature, layer) {
  layer.bindPopup(
    '<strong>' + feature.properties.name + '</strong><br>' + 
    '<span style="color:blue">' + feature.properties.no_eng_den.toFixed(2) + ' non-English speakers/hectare</span>'
  );
  
  layer.on({
    mouseover: function (e) {
      highlightFeature(e);
      e.target.openPopup();
    },
    mouseout: resetLanguageHighlight
  });
}

// Add map data and choropleth colors
var densitylayer = L.geoJSON(data, { style: styleDensity, onEachFeature: onEachDensityFeature }).addTo(mymap);

// Add map data and choropleth colors
var languagelayer = L.geoJSON(speaker_den, { style: styleLanguage, onEachFeature: onEachLanguageFeature });

/* ---------------------------------------------------------
  Build legends in the side panel
   --------------------------------------------------------- */
function buildLegendHTML(title, grades, colorFunction) {
  var html = '<div class="legend-title">' + title + '</div>';
  
  for (var i = 0; i < grades.length; i++) {
    var from = grades[i];
    var to = grades[i + 1];
    
    html +=
      '<div class="legend-box">' + 
        '<span class="legend-color" style="background:' + colorFunction(from + 0.5) + '""></span>' + 
        '<span>' + from + (to ? '&ndash;' + to : '+') + '</span>' + 
        '</div>';
  }
  
  return html;
}

//Insert non-English speaker density legend into side panel
var densityLegendDiv = document.getElementById('density-legend');
if (densityLegendDiv) {
  densityLegendDiv.innerHTML = buildLegendHTML(
    'Population Density',
    [0, 32, 53, 87, 139],
    getColorDensity
  );
}

//Insert language legend into side panel
var languageLegendDiv = document.getElementById('language-legend');
if (languageLegendDiv) {
  languageLegendDiv.innerHTML = buildLegendHTML(
    'Non-English Speaker Density',
    [0, 0.99, 2.25, 4.43, 6.45],
    getColorLanguage
  );
}

/* Layer control and Menu Item */

var baseLayers = {
  "Population Density": densitylayer,
  "Non-English Speaker Density": languagelayer
};

var overlays = {};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(mymap);

