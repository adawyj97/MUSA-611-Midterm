/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [39.859357, -98.707155],
  zoom: 5
});

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var dataset = "https://raw.githubusercontent.com/adawyj97/MUSA-611-Midterm/master/Data/eme_query.geojson";
var specimenData;
var featureGroup;

function csvtoJSON(data) {
  var parsed = [];
  var rows = data.split("\n");
  for (var i=0;i<rows.length;i=i+1){
      parsed.push(rows[i].split(','));}
  return parsed;
}

function transformData(data) {
  transformedData = [];
  keys = data[0];
  for (i=1;i<data.length;i++) {
    newArray = [];
    for(j=0;j<keys.length;j++) {
      curKey = keys[j];
      newArray[curKey] = data[i][j];
    }
    transformedData.push(newArray);
  }
  return transformedData;
}

var myStyle = function(feature) {
  /*
    switch (feature.properties.COLLDAY) {
      case 'MON':   return {color: "#EC7063"};
      case 'TUE':   return {color: "#1D7813"};
      case 'WED':   return {color: "#1ABC9C"};
      case 'THU': return {color: "#426DC5"};
      case 'FRI':   return {color: "#CA2B67"};
        }
        */
        return {fillColor: 'red'};
};

var showResults = function() {
  /* =====================
  This function uses some jQuery methods that may be new. $(element).hide()
  will add the CSS "display: none" to the element, effectively removing it
  from the page. $(element).show() removes "display: none" from an element,
  returning it to the page. You don't need to change this part.
  ===================== */
  // => <div id="intro" css="display: none">
  $('#intro').hide();
  // => <div id="results">
  $('#results').show();
};


var eachFeatureFunction = function(layer) {
  layer.on('click', function (event) {
    /* =====================
    The following code will run every time a layer on the map is clicked.
    Check out layer.feature to see some useful data about the layer that
    you can use in your application.
    ===================== */
    //console.log(layer.feature.properties.COLLDAY);
    $('.day-of-week').text(layer.feature.properties.COLLDAY);
    showResults();
  });
};

var myFilter = function(feature) {
  return true;
  /*
  if (feature.properties.COLLDAY != ' ') {
    return true;
  } else {
    return false;
  }
  */

};



$(document).ready(function() {
  $.ajax(dataset).done(function(data) {
      specimenData = JSON.parse(data);
      featureGroup = L.geoJson(specimenData, {
        style: myStyle,
        filter: myFilter
      }).addTo(map);
        });
      });

/*
  $.ajax(datasetMine).done(function(data) {
    var parsedData = JSON.parse(data);
    featureGroup = L.geoJson(parsedData, {
      style: myStyle,
      filter: myFilter
    }).addTo(map);

        // quite similar to _.each
        //featureGroup.eachLayer(eachFeatureFunction);
      });

$(document).ready(function() {
  $.ajax(dataset).done(function(data) {
    var parsedData = JSON.parse(data);
    featureGroup = L.geoJson(parsedData, {
      style: myStyle,
      filter: myFilter
    }).addTo(map);

    // quite similar to _.each
    featureGroup.eachLayer(eachFeatureFunction);
  });
*/
