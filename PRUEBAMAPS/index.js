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

    // Inicializar Autocomplete
    initAutocomplete();
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
        includedPrimaryTypes: [document.getElementById("type").value],
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
        localStorage.setItem('IdsLugares', JSON.stringify(lugaresID));
        // Ajustar el mapa para mostrar todos los marcadores
        map.fitBounds(bounds);
    } else {
        console.log("No se encontraron resultados");
    }
}

// Cargar el mapa al inicializar la página
window.onload = initMap;
