(function(){

    // -- CONSTANTES -----------------------------------------------------

    var API_WORLDTIME_KEY = "0856c982ef9341d549db3530663dc",
        API_WORLDTIME     = "http://api.worldweatheronline.com/free/v2/tz.ashx?format=json&key=" + API_WORLDTIME_KEY + "&q=",
        API_WEATHER_KEY = "80114c7878f599621184a687fc500a12",
        API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&",
        IMAGE_WEATHER   = "http://openweathermap.org/img/w/";

    // -- VARIABLES ------------------------------------------------------

        var cities = [],
            today   = new Date(),
            timeNow = today.toLocaleTimeString(),
            cityWeather = {};
            cityWeather.zone;
            cityWeather.icon;
            cityWeather.temp;
            cityWeather.temp_max;
            cityWeather.temp_min;
            cityWeather.main;

    // -- ELEMENTOS CACHEADOS ---------------------------------------
        ///////////////////////////////////////////
        //es muy buena práctica guardar los      //
        //elementos en variables para evitar     //
        //obligar al navegador a volver a buscar //
        //los elementos                          //
        ///////////////////////////////////////////

        var $body             = $("body"),
            $loader           = $(".loader"),
            nombreNuevaCiudad = $("[data-input='cityAdd']"),
            buttonAdd         = $("[data-button='add']"),
            buttonLoad        = $('[data-saved-cities]');

// -- FUNCIONES --------------------------------------------------

    $( buttonAdd ).on("click", addNewCity);

    $( nombreNuevaCiudad ).on("keypress", function(event) {
        // console.log(event.which); //console.log de la tecla que se presiona dentro del input
        if (event.which == 13) {
            addNewCity(event);
        }
    });

    $( buttonLoad ).on("click", loadSaveCities);

    if (navigator.geolocation) {//comprobar si esta disponible geolocalización
        navigator.geolocation.getCurrentPosition(getCoords, errorFound);

    } else{
        alert("actualiza tu navegador");
    }

    function errorFound(error) {//Función que se ejecuta si hay error
        console.log("Ocurrió un error: " + error.code);
        // 0: Error deconocido
        // 1: Permiso Denegado
        // 2: Posición no esta disponible
        // 3: Timeout
    };

    function getCoords(position) {//Función que se ejecuta si la geolocalización se hace correctamente
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        console.log("Tu posición es: " + lat + "," + lon);

        $.getJSON(API_WEATHER_URL + "lat=" + lat +"&lon=" + lon, getCurrentWeather);
    };

    function getCurrentWeather(data) {
        cityWeather.zone     = data.name;
        cityWeather.icon     = IMAGE_WEATHER + data.weather[0].icon + ".png";
        cityWeather.temp     = data.main.temp - 273.15;
        cityWeather.temp_max = data.main.temp_max - 273.15;
        cityWeather.temp_min = data.main.temp_min - 273.15;
        cityWeather.main     = data.weather[0].main;

        //render
        renderTemplate(cityWeather);
        // console.log(data);
    };


    function activateTemplate(id) {
      var t = document.querySelector(id);
      return document.importNode(t.content, true);
    };

    function renderTemplate(cityWeather, localtime) {
        var clone = activateTemplate("#template--city"),
            timeToShow;

        if (/*localtime=true esto es igual a*/localtime) {
            timeToShow = localtime.split(" ")[1];

        } else {
            timeToShow = timeNow;
        }

        clone.querySelector("[data-time]").innerHTML = timeToShow;
        clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
        clone.querySelector("[data-icon]").src = cityWeather.icon;
        clone.querySelector("[data-temp='max']").innerHTML = cityWeather.temp_max.toFixed(1);
        clone.querySelector("[data-temp='min']").innerHTML = cityWeather.temp_min.toFixed(1);
        clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(1);

        $( $loader ).hide();
        $( $body ).append(clone);
    };

    function addNewCity(event) {
        event.preventDefault();                                       // |||||||||||||||||) Función callback donde recibe la respuesta
        $.getJSON(API_WEATHER_URL + "q=" + $( nombreNuevaCiudad ).val(), getWeatherNewCity);
    };

    function getWeatherNewCity(data){

        $.getJSON(API_WORLDTIME + $( nombreNuevaCiudad ).val(), function(response){

        $( nombreNuevaCiudad ).val('');

        cityWeather = {};
        cityWeather.zone     = data.name;
        cityWeather.icon     = IMAGE_WEATHER + data.weather[0].icon + ".png";
        cityWeather.temp     = data.main.temp - 273.15;
        cityWeather.temp_max = data.main.temp_max - 273.15;
        cityWeather.temp_min = data.main.temp_min - 273.15;
        cityWeather.main     = data.weather[0].main;

        renderTemplate(cityWeather, response.data.time_zone[0].localtime);
        // console.log(response);

        // push permite guardar unelemento en el array
        cities.push(cityWeather);
        localStorage.setItem('cities', JSON.stringify(cities));

        });

    };

    function loadSaveCities(event) {
        event.preventDefault();

        function renderCities(cities) {
            cities.forEach(function(city) {
                renderTemplate(city);
            });
        };

        var cities = JSON.parse( localStorage.getItem('cities') );
        renderCities(cities);
    };

})();
