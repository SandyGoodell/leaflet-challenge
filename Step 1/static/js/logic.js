/* NOTE FOR STEP 2
/  You can use the javascript Promise.all function to make two d3.json calls, 
/  and your then function will not run until all data has been retreived.
/
/ ----------------------------------------
/  Promise.all(
/    [
/        d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"),
/        d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
/    ]
/  ).then( ([data,platedata]) => {
/
/        console.log("earthquakes", data)
/        console.log("tectonic plates", platedata)
/
/    }).catch(e => console.warn(e));
/
/ ----------------------------------------*/
// Create the map object with options.
var myMap = L.map("map", {
    center: [0,0],
    zoom: 2
});

// Add a tile layer - this will be the background of the map object
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// Make a call that retrieves our earthquake geoJSON data and make a promise

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
  console.log(data);

  // Create function to determine the color of the marker based on the magnitude of earthquakes
  function getColor(mag) {
    switch (true) {
    case mag > 90:
      return "#ea2c2c";
    case mag > 70:
      return "#ea822c";
    case mag > 50:
      return "#ee9c00";
    case mag > 30:
      return "#eecc00";
    case mag > 10:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }


  // Create function to determine the radius of the earthquake marker basdie on it magnitude
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }
   
  // create function for the style data for each of the earthquakes shown on the map object
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]), 
      color: "#000000",
      radius: getRadius(feature.properties.mag), 
      stroke: true,
      weight: 0.5
    };
  }

  
  //add GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);  
    },
    //set the style for each circle marker
    style: styleInfo,
    //create popup for each marker to display the magnitude and location of the earthquake
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: " 
        + feature.properties.place
      );
    }
  }).addTo(myMap);

  // set up a legend
  // create a legend control object with - Act-02-04 ln 58
  const legend = L.control({ position: "bottomleft"
 });
  //details for legend control
  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = "<table style= 'background-color: white'><tr><td colspan='2' ><h3>&nbsp;&nbsp;Depth </h3></td></tr>"+
                  "<tr><td>-9-10</td><td style= 'background-color: #98ee00'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>"+
                  "<tr><td>11-30</td><td style= 'background-color: #d4ee00'></td></tr>"+
                  "<tr><td>31-50</td><td style= 'background-color: #eecc00'></td></tr>"+
                  "<tr><td>51-70</td><td style= 'background-color: #ee9c00'></td></tr>"+
                  "<tr><td>71-90</td><td style= 'background-color: #ea822c'></td></tr>"+
                  "<tr><td>91+</td><td style= 'background-color: #ea2c2c'></td></tr>"+
                  "</table>";

    return div;
  };
// add legend to the map object
legend.addTo(myMap)

});