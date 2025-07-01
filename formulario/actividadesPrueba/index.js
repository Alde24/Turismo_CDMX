let map;
let autocomplete;
let infoWindow;

// Inicializar el autocompletado al cargar la página
function initAutocomplete() {
    const input = document.getElementById('autocomplete');
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields(['place_id', 'geometry', 'name']); // Ajustar los campos que deseas recuperar

    // Escuchar cuando se seleccione un lugar
    autocomplete.addListener('place_changed', onPlaceChanged);
}

// Manejar el evento cuando el usuario selecciona un lugar
function onPlaceChanged() {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
        console.log("No details available for input: '" + place.name + "'");
        return;
    }
    console.log(place);
    // Centrar el mapa en el lugar seleccionado
    map.setCenter(place.geometry.location);
    map.setZoom(14);
    // Llamar a la función de Nearby Search para encontrar lugares cercanos
    nearbySearch(place.geometry.location);
}

// Inicializar el mapa
async function initMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");

    // Coordenadas iniciales (puedes personalizarlas según prefieras)
    const initialLocation = new google.maps.LatLng(19.42713335570158, -99.16764891944884);

    // Crear el mapa
    map = new Map(document.getElementById("map"), {
        center: initialLocation,
        zoom: 11,
        mapId: "DEMO_MAP_ID",
    });

    infoWindow = new InfoWindow();
    let idFormularioActual=JSON.parse(localStorage.getItem('idFormularioFinal'));
    // Inicializar Autocomplete
    //initAutocomplete();
    $.ajax({
        //configurar 5 propiedades
        //url: sustituye al atributo action
        url:"../php/buscarActividades.php",
        //tipo de envio GET O POST
        type:"POST",
        //los datos
        data:{idFormulario:idFormularioActual},
        //tomar los utlimos cambios sin tomar a la memoria cache
        cache:false,
        //es un callback u evento que sucede dentro del evento, a quien voy a ejecutar una vez realizado el envío
        //respAX la respuesta que da el servidor
        success:(respAX)=>{
            let respAjax = JSON.parse(respAX);
            if (respAjax.status === "success") {
                
                // Hacer otra petición AJAX para obtener los datos de la API
                $.ajax({
                    url: "../php/obtenerDetallesLugar.php", 
                    type: "POST",
                    data: { place_id: respAjax.idlugarDestino }, 
                    cache: false,
                    success: (respLugar) => {
                        console.log(respLugar.status);
                        try {
                            //let respApi = JSON.parse(respLugar);
                            //console.log(respLugar);
                            if (respLugar.status === "OK") {
                                const location = respLugar.result.geometry.location; // Extraer la ubicación
                                console.log("Ubicación obtenida:", location);
                                // Centrar el mapa en el lugar seleccionado
                                map.setCenter(respLugar.result.geometry.location);
                                map.setZoom(14);
                                // Llamar a nearbySearch con la ubicación
                                nearbySearch(location);
                            } else {
                                console.error("Error en la API de Google:", respLugar.status);
                            }
                        } catch (error) {
                            console.error("Error al procesar la respuesta de la API:", error, respLugar);
                        }
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        console.error("Error en la solicitud a obtenerDetallesLugar.php:", textStatus, errorThrown);
                    }
                });


            }
            //llamar a la funcion nearbySearch con el parametro center que es obtenido de llamar 
            //a la API pasandole como parametro el ID del lugar, luego obtenemos la propiedad place.geometry.location y esta es enviada a 
            //la funcion nearbySearch. ejemplo nearbySearch(place.geometry.location);
        }
    });    



}

// Nearby Search para lugares cercanos
async function nearbySearch(center) {
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // Parámetros para Nearby Search
    const request = {
        fields: ["displayName", "location", "id"],
        locationRestriction: {
            center: center,
            radius: 1000, // Ajusta el radio de búsqueda en metros
        },
        includedPrimaryTypes: ["hotel"],
        //includedTypes: ["point_of_interest"],
        maxResultCount: 20,
        rankPreference: SearchNearbyRankPreference.POPULARITY, //tambiémn puede ser por la distancia -> rankPreference: SearchNearbyRankPreference.DISTANCE/POPULARITY
        language: "en-US",
    };

    const { places } = await Place.searchNearby(request);
    const lugaresID=[];
    if (places.length) {
        console.log("Lugares encontrados:", places);

        const { LatLngBounds } = await google.maps.importLibrary("core");
        const bounds = new LatLngBounds();

        // Agregar marcadores al mapa
        places.forEach((place) => {
            const marker = new AdvancedMarkerElement({
                map,
                position: place.location,
                title: place.displayName,
            });

            bounds.extend(place.location);
            lugaresID.push(place.Eg.id);
            // Mostrar información del lugar al hacer clic en el marcador
            marker.addListener("click", () => {
                infoWindow.setContent(place.displayName);
                infoWindow.open(map, marker);
            });
        });
        localStorage.setItem('IdsLugaresActividades2', JSON.stringify(lugaresID));
        // Ajustar el mapa para mostrar todos los marcadores
        map.fitBounds(bounds);
    } else {
        console.log("No se encontraron resultados");
    }
}

// Cargar el mapa al inicializar la página
window.onload = initMap;
