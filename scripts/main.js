// Set api token
mapboxgl.accessToken = 'pk.eyJ1IjoiaWxzZWtlaWp6ZXIiLCJhIjoiY2s4cjg3OXl4MDBvcTNmcDY4aDBheGdsdCJ9.LO8gzp9Li5w_aE-XIxEuXg';

// Initiate map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-96.548103, 38.708494],
  zoom: 2.95
});

// wacht totdat de map geladen is
map.on('load', function () {

  // nieuwe source places
  map.addSource('places', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      // Saved in locations.js
      'features': myLocationsList
    }
  });

  // Add a layer showing the places.
  map.addLayer({
    'id': 'places',
    'type': 'symbol',
    'source': 'places',
    'layout': {
      'icon-image': '{icon}-15', // icon verwijst naar de properties in het object met een plaats en wordt vervangen
      'icon-allow-overlap': true
    }
  });

  // Create a popup, but don't add it to the map yet.
  var popup = new mapboxgl.Popup({
    // closeButton: true,
    //closeOnClick: true
  });

  map.on('click', 'places', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var title = e.features[0].properties.title;
    var description = e.features[0].properties.description;
    var image = e.features[0].properties.image;

    var weather = document.getElementById('weather');
    var information = document.getElementById('info');
    console.log(e.features[0]);


    // Populate the popup and set its coordinates based on the feature found.
    popup.setLngLat(coordinates)
         .setHTML(title)
         .addTo(map);


    information.innerHTML = title + '<br/ >' + description + '<br/ >' + image;
    
    function getAPIdata() {

      var url = 'https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather';
      var apiKey = 'd5f739d90c88a68cb8b29f0a686ef15f';
      var lat = e.features[0].geometry.coordinates[1]; //latitude van locatie waarop geklikt wordt
      var lon = e.features[0].geometry.coordinates[0]; //longitude van locatie waarop geklikt wordt
      console.log(lat, lon)

      var request = url + '?' + 'lat=' + lat + '&' + 'lon=' + lon + '&appid=' + apiKey;

      // get current weather
      fetch(request)
      
      // parse to JSON format
      .then(function(response) {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      
      // render weather per day
      .then(function(response) {
        // render weatherCondition
        console.log(response);
        onAPISucces(response);  
      })
      
      // catch error
      .catch(function (error) {
        onAPIError(error);
      });
    }


    function onAPISucces(response) {
      // get type of weather in string format
      var type = response.weather[0].description;

      // get temperature in Celcius
      var locationWeather = title +', ' + response.sys.country;
      var iconWeather = 'http://openweathermap.org/img/w/'+response.weather[0].icon+'.png';
      var degC = Math.floor(response.main.temp - 273.15);

      // render weather in DOM
      // locatie: land, naam stad, timezone, temp, icoontje, desciptie
      var weatherBox = document.getElementById('weather');
      var weatherInformation = '<strong>'+ locationWeather+'</strong>' +'<br/>';
      weatherInformation +='<img id="weatherIcon" src="'+iconWeather+'"/>';
      weatherInformation += '<p>'+ degC + '&#176;C</p> <p>' + type +'</p><br>';
      //weatherInformation += ;

      weatherBox.innerHTML = weatherInformation;
    }


    function onAPIError(error) {
      console.error('Request failed', error);
      var weatherBox = document.getElementById('weather');
      weatherBox.className = 'hidden'; 
    }



    // init data stream
    getAPIdata();

  });

});












