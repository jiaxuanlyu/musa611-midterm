/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
    center: [39.9554895, 116.486317],
    zoom: 11
  });
  var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);


  
//data
var dataset = "https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/housingprice_Beijing.geojson"
var featureGroup;

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


var myStyle = function(feature) {
  return true
};


var myFilter = function(feature) {
    return true
};


 //marker reference: https://github.com/pointhi/leaflet-color-markers
var cusIcon = new L.Icon({
    iconUrl: "https://cdn2.iconfinder.com/data/icons/navigation-and-location-3/100/navigation_map_pin_pointer_location_marker-11-512.png",
    iconSize: [42, 42],
    iconAnchor: [12, 41],
    popupAnchor: [1, -50],
    shadowSize: [20, 20]
});


//get color by floor
//reference: https://stackoverflow.com/questions/44206050/leaflet-change-circle-marker-color-based-on-text-field
var getFloorColor = function(feature) {
    return {
        radius: feature.properties.floor,
        fillColor: "#FFC772",
        color: "#ff8800",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }
}

//get size of circle by area
var getAreaSize = function(feature) {
  return {
    radius: (feature.properties.area / 3),
    fillColor: "#3399ff",
    color: "#0066CC",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  } 
}


//style Num of beds
var getNumFillColor = function(feature) {
  switch (feature.properties.bedrooms) {
    case 1 : return "#FFD2A4" ;
    case 2 : return "#FFC4FA" ;
    case 3 : return "#FFEE92" ;
    case 4 : return "#cc99ff";
  }
}

var getNumColor =  function(feature) {
  switch (feature.properties.bedrooms) {
    case 1 : return "#FF8912" ;
    case 2 : return "#FF70F2" ;
    case 3 : return "#FFD500" ;
    case 4 : return "#9933ff"
  }
}


var styleNumBed = function(feature) {
  
  return {
    radius: 12,
    fillColor: getNumFillColor(feature),
    color: getNumColor(feature),
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  } 
}

//style Price

function getPriceColor(price) {
  return price < 200 ? '#FA8072' :
         price < 400  ? '#FF6347' :
         price < 600  ? '#DC143C' :
         price < 800  ? '#B22222' :
         price < 1000  ? '#FD8D3C' :
                          '#800000';
}


var stylePrice = function(feature) {
  return {
    radius: ( feature.properties.totalprice / 10 ),
    fillColor: getPriceColor(feature.properties.totalprice),
    color: getPriceColor(feature.properties.totalprice),
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  } 
}

//style Year Built

//reference:https://leafletjs.com/examples/choropleth/
function getYearColor(year) {
  return year < 1990 ? '#B5FFEC' :
         year < 1995  ? '#92EEFF' :
         year < 2000  ? '#6CCFFF' :
         year < 2005  ? '#6CA7FF' :
         year < 2010   ? '#5471FF' :
         year < 2015  ? '#7644FF' :
         year < 2020   ? '#5900DF' :
                          '#FFEDA0';
}

var styleYear = function(feature) {
  return {
    radius: 15,
    fillColor: getYearColor(feature.properties.yearbuilt),
    color: getYearColor(feature.properties.yearbuilt),
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  } 
}






//hide function
var hideInfo = function() {
    $("#floor-box").hide()
    $("#area-box").hide()
    $("#numbed-box").hide()
    $("#price-box").hide()
    $("#year-box").hide()
    $("#test").hide()
}

//show function
var showInfo = function() {
    $("#floor-box").show()
    $("#area-box").show()
    $("#numbed-box").show()
    $("#price-box").show()
    $("#year-box").show()
    $("#test").show()
}



//Overall Visualization Function
var visOverall = function(parsedData) {
  featureGroup = L.geoJson(parsedData, {
    pointToLayer: function (feature, latlng) {
        //console.log(feature.properties.yearbuilt)
        return L.marker(latlng, {icon: cusIcon}).bindPopup('NAME: ' + feature.properties.name)
    }
  }).addTo(map)
}

//Visualize Floor
var visFloor = function(parsedData) {
  featureGroup = L.geoJson(parsedData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, getFloorColor(feature))
        .bindPopup('NAME: ' + feature.properties.name + '<br>FLOOR: ' + feature.properties.floor)
    }
  }).addTo(map)
}


//Visualize Area
var visArea = function(parsedData) {
  featureGroup = L.geoJson(parsedData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, getAreaSize(feature))
        .bindPopup('NAME: ' + feature.properties.name + '<br>AREA: ' + feature.properties.area)
    }
  }).addTo(map)
}

//Visualize NumBed
var visNumBed = function(parsedData) {
  featureGroup = L.geoJson(parsedData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, styleNumBed(feature))
        .bindPopup('NAME: ' + feature.properties.name + '<br>BEDROOMS: ' + feature.properties.bedrooms)
    }
  }).addTo(map)
}

//Visualize Price
var visPrice = function(parsedData) {
  featureGroup = L.geoJson(parsedData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, stylePrice(feature))
        .bindPopup('NAME: ' + feature.properties.name + '<br>PRICE: ' + feature.properties.totalprice)
    }
  }).addTo(map)
}

//Visualize Year Built
var visYear = function(parsedData) {
  featureGroup = L.geoJson(parsedData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, styleYear(feature))
        .bindPopup('NAME: ' + feature.properties.name + '<br>BUILT YEAR: ' + feature.properties.yearbuilt)
    }
  }).addTo(map)
}


//button back function
var backClick = function() {
  $("button.back").click(function() {

    $('.numbed-legend').hide()
    $('.price-legend').hide()
    $('.year-legend').hide()


    map.removeLayer(featureGroup)

    showInfo()

    //change text
    $("h1").text("Housing in Beijing")
    $(".main").text("Let's start explore the housing in Beijing!")

    //visualize data at the first page
    $.ajax(dataset).done(function(data) {
    var parsedData = JSON.parse(data);
    visOverall(parsedData)
    });

    $("button.back").hide()
    $("button.back").unbind()

  })
}






//ACTION HERE
$(document).ready(function() {

  //hide back button
  $("button.back").hide()
  $('.numbed-legend').hide()
  $('.price-legend').hide()
  $('.year-legend').hide()

  //visualize data at the first page
  $.ajax(dataset).done(function(data) {
    var parsedData = JSON.parse(data);
    visOverall(parsedData)
  });

  //button-floor event
  $("button.floor-button").click(function() {

    //remove icons at first    
    map.removeLayer(featureGroup)

    hideInfo()

    $("button.back").show()

    //change text
    $("h1").text("The distribution of floors of these houses")
    $(".main").text("The floor of the housing is represented by the size of circle. The larger the circle, the higher floor of the housing.")

    $.ajax(dataset).done(function(data) {
        var parsedData = JSON.parse(data);
        visFloor(parsedData)
      });
    
    backClick()

  });

  //button area event
  $("button.area-button").click(function() {

    //remove icons at first    
    map.removeLayer(featureGroup)

    hideInfo()

    $("button.back").show()

    //change text
    $("h1").text("The distribution of areas of these houses")
    $(".main").text("The area of the housing is represented by the size of circle. The larger the circle, the larger the area.")

    $.ajax(dataset).done(function(data) {
        var parsedData = JSON.parse(data);
        visArea(parsedData)
      });

    backClick()

  });

  //button Numbed event
  $("button.numbed-button").click(function() {

    //remove icons at first    
    map.removeLayer(featureGroup)

    hideInfo()

    $("button.back").show()
    $('.numbed-legend').show()

    //change text
    $("h1").text("The distribution of the number of bedrooms within these houses")
    $(".main").text("The number of bedrooms for each house is represented by different color.")

    $.ajax(dataset).done(function(data) {
        var parsedData = JSON.parse(data);
        visNumBed(parsedData)
      });
    
    backClick()

  });

  //button Price event
  $("button.price-button").click(function() {

    //remove icons at first    
    map.removeLayer(featureGroup)

    hideInfo()

    $("button.back").show()
    $('.price-legend').show()

    //change text
    $("h1").text("The distribution of the housing price")
    $(".main").text("The housing price is visualized by different color and size.")

    $.ajax(dataset).done(function(data) {
        var parsedData = JSON.parse(data);
        visPrice(parsedData)
      });

    backClick()

  });

  //button Year event
  $("button.year-button").click(function() {

    //remove icons at first    
    map.removeLayer(featureGroup)

    hideInfo()

    $("button.back").show()
    $('.year-legend').show()

    //change text
    $("h1").text("The distribution of the housing built year")
    $(".main").text("The housing built year is visualized by different color.")

    $.ajax(dataset).done(function(data) {
        var parsedData = JSON.parse(data);
        visYear(parsedData)
      });

    backClick()

  });


});






