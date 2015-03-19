// CLOSURE
// (function(){})();

(function(){
    if (navigator.geolocation) {//comprobar si esta disponible geolocalización
        navigator.geolocation.getCurrentPosition(getCoords, errorFound);

    } else{
        alert("actualiza tu navegador");
    }

    function errorFound(error){//Función que se ejecuta si hay error
        alert("Ocurrió un error: " + error.code);
        // 0: Error deconocido
        // 1: Permiso Denegado
        // 2: Posición no esta disponible
        // 3: Timeout
    }

    function getCoords(position){//Función que se ejecuta si la geolocalización se ejeceta correctamente
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        console.log("Tu posición es: " + lat + "," + lon);
    }

})();
