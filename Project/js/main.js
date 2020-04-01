/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [36.046540, -115],
  zoom: 4
});

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var slides = [
      { title: "Title", description: "Description", poi: "Ordr", legendTitle: "Order of the Insect"},
      { title: "title1", description: "the first description", poi: "HoldingInstitution", legendTitle: "Holding Institution"},
      { title: "title2", description: "the second description", poi: "MicroHabitat", legendTitle: "Microhabitat of the Insect"},
      { title: "title3", description: "the first description", poi: "IdentifiedBy", legendTitle: "Identified by"},
      { title: "made up title", description: "made up description", poi: "Collector", legendTitle: "Collected by"}
    ];

var currentSlide = 0;
var dataset = "https://raw.githubusercontent.com/adawyj97/MUSA-611-Midterm/master/Data/eme_query2000.geojson";
var specimenData;
var featureGroup;
var propertyofInterest = 'Ordr';

var loadSlide = function(slide) {
  featureGroup.clearLayers();
  $('#title').text(slide.title);
  $('#description').text(slide.description);
  $('.legend-title').text(slide.legendTitle);
  propertyofInterest = slide.poi;
  mapPoints(specimenData);
};

var findtenMost = function(data) {
  var uni = [...new Set(data.features.map(function(point) {
    return point.properties[propertyofInterest]}))];
  uni = _.reject(uni, function(element) {
    return element == undefined || element == 'undetermined';
  });
  if (uni.length <= 10) {
    return uni;
  } else {
    var sorted =  _.sortBy(uni, function(value) {
      return _.where(specimenData, {propertyofInterest:value}).length;
    });
    return sorted.slice(0, 10);
  }
};

var next = function() {
  if (currentSlide == slides.length - 1) {

  } else {
    currentSlide = currentSlide + 1;
    loadSlide(slides[currentSlide]);
    $('#previousButton').show();
     }
  if (currentSlide == slides.length - 1) {
    $('#nextButton').hide();
  }
};

var previous = function() {
  if (currentSlide == 1) {
    $('#previousButton').hide();
  }
  $('#nextButton').show();
  currentSlide = currentSlide - 1;
  loadSlide(slides[currentSlide]);
};

function colorMap(points) {
  var uniqueCat = [...new Set(points.features.map(function(point) {
    return point.properties[propertyofInterest];
}))];
  var palettes = palette('mpn65',uniqueCat.length);
  var paletteMap = new Map();
  for(var i=0;i<palettes.length;i++) {
    paletteMap.set(uniqueCat[i],palettes[i]);
  }
  return paletteMap;
}

var myStyle = function(feature) {
  var color = colorMap(specimenData).get(feature.properties[propertyofInterest]);
  return {fillColor: '#' + color, weight: 0};
};

var mapPoints = function(specimenData) {
  featureGroup = L.geoJson(specimenData, {
    style: myStyle,
    filter: myFilter,
    pointToLayer: function(feature, latlng) {
      return new L.CircleMarker(latlng, {
        radius: 5,
        fillOpacity: 0.5
      });
    },
    onEachFeature: function (feature, layer) {
         layer.bindPopup(propertyofInterest + ": " + feature.properties[propertyofInterest]);
     }}).addTo(map);
   legendList = findtenMost(specimenData);
   for (i=0;i<10;i++) {
     var selector = ".legend-labels > li:nth-child(" + String(i+1) + ")";
     if (i>legendList.length-1) {
       $(selector)[0].lastChild.nodeValue = "";
       $(selector).find("span").attr('style', '');
     } else {
       var curLabel = legendList[i];
       $(selector)[0].lastChild.nodeValue = curLabel;
       var legendColor = colorMap(specimenData).get(curLabel);
       $(selector).find("span").attr('style', 'background:#'+ legendColor);
     }
   }
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
};



$(document).ready(function() {
  $.ajax(dataset).done(function(data) {
      specimenData = JSON.parse(data);
      mapPoints(specimenData);
        });
  $( "#nextButton" ).click(function() {
    next();
      });
  $("#previousButton").click(function() {
    previous();
  });
    });
