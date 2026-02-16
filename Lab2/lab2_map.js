const map = L.map("map").setView([44.262305, -88.407822], 12); // Centered on my hometown with the zoom level smaller so you can see the entirety of Appleton and nearby towns and cities

L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { // Picked gray basemap because it is uncluttered
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

L.marker([44.262305, -88.407822]) // Coordinates of my hometown (Appleton, WI)
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>This is my hometown.") // Changed popup text to match what I'm showing on the map
  .openPopup();
