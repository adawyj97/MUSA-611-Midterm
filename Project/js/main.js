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
      { title: "Essig Museum Collecion",
        description: "Here is a map of the insect specimen collection of the Essig Museum. Due to the huge size of the collection, only specimens collected in the past 20 years are shown. The colors of the circle markers correspond to the orders of the insects. The ten orders that most frequently occur in the specimens are shown in the legend.",
        poi: "Ordr", legendTitle: "Order of the Insect"},
      { title: "Essig Museum Collecion", description: "The colors of the circle markers now correspond to the holding institutions of the specimens. The legend is sorted by the number of specimens holded by the institution in this collection.", poi: "HoldingInstitution", legendTitle: "Holding Institution"},
      { title: "Essig Museum Collecion", description: "The colors of the circle markers now correspond to the identifiers of species of the specimens. The legend shows the identifiers who identified the top ten numbers of specimens in this collection.", poi: "IdentifiedBy", legendTitle: "Identified by"},
      { title: "Essig Museum Collecion", description: "The colors of the circle markers now correspond to the collectors of the specimens. The legend shows the collectors who collected the top ten numbers of specimens in this collection.", poi: "Collector", legendTitle: "Collected by"},
      { title: "Essig Museum Collecion", description: "The colors of the circle markers now correspond to the microhabitats of the insects. The legend shows the ten most common microhabitats in the collection. Since most of specimens don't have a microhabitat specified, the view is set to one specimens whose microhabitat is debris.", poi: "MicroHabitat", legendTitle: "Microhabitat of the Insect",
      bounds:  [[31.590460, -111.128960],[31.353965, -110.094728]]}
    ];

var currentSlide = 0;
var dataset = "https://raw.githubusercontent.com/adawyj97/MUSA-611-Midterm/master/Data/eme_query2000.geojson";
var specimenData;
var featureGroup;
var propertyofInterest = 'Ordr';

var loadSlide = function(slide) {
  if ("bounds" in slide) {
    map.fitBounds(slide.bounds);
  }
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
