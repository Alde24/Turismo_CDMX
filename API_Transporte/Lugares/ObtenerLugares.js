$(document).ready(() => {
    // Configura tu clave de API de Google Places
    const API_KEY = 'AIzaSyBlBfvcJxLHgYnFMJBbgLmdzIS_mI2QZZQ';
    const CDMX_COORDS = { lat: 19.432608, lng: -99.133209 }; // Coordenadas de la CDMX
    const RADIO_BUSQUEDA = 20000; // Radio en metros (20 km)
    const map = new google.maps.Map(document.createElement('div')); // Necesario para inicializar PlacesService
    const service = new google.maps.places.PlacesService(map); // Inicializamos el servicio
    let todosLugares = [];

    // Ajax para obtener todas las subcategorías y categorías asociadas
    $.ajax({
        url: './ObtenerLugares.php',
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {
            if (respuesta.status == 'success') {
                let datos = respuesta.datos;

                datos.forEach(elemento => {
                    let request = {
                        location: CDMX_COORDS,
                        radius: RADIO_BUSQUEDA,
                        type: elemento.idValor
                    };

                    function buscarLugares(nextPageToken = null) {
                        if (nextPageToken) {
                            request.pagetoken = nextPageToken;
                        }

                        service.nearbySearch(request, (results, status, pagination) => {
                            //console.log(pagination);
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                results.forEach(place => {
                                    // Filtrar los lugares que no sean hoteles o irrelevantes
                                    if (!place.types.includes('lodging') && !place.types.includes('hotel')) {
                                        let direccion = place.vicinity || "Dirección no disponible";

                                        // Añadir el lugar al array
                                        todosLugares.push({
                                            id: place.place_id,
                                            nombre: place.name,
                                            latitud: place.geometry.location.lat(),
                                            longitud: place.geometry.location.lng(),
                                            Nombrecategoria: elemento.CategoriaNombre,
                                            idCategoria: elemento.idCategorias,
                                            NombreSub: elemento.nombre,
                                            idSub: elemento.idSubCategoria,
                                            idValorSub: elemento.idValor,
                                            direccion: direccion,
                                            rating: place.rating,
                                            precio : place.price
                                        });
                                    }
                                });

                                // Si hay más resultados, paginar con un delay de 2 segundos (requerido por Google)
                                if (pagination.hasNextPage == 'True') {
                                    console.log('Mas paginas sobre ');
                                    setTimeout(() => buscarLugares(pagination.nextPageToken), 2000);
                                } else {
                                    enviarLugaresAlServidor();
                                }
                            } else {
                                console.error(`Error en la búsqueda para ${elemento.CategoriaNombre}:`, status);
                            }
                        });
                    }

                    buscarLugares();
                });
            } else {
                console.log('No hay subcategorías');
            }
        },
        error: function () {
            console.error("Error al obtener categorías y subcategorías");
        }
    });

    function enviarLugaresAlServidor() {
        if (todosLugares.length > 0) {
            $.ajax({
                url: './GuardarLugares.php',
                type: 'POST',
                data: { lugares: JSON.stringify(todosLugares) },
                success: function (response) {
                    console.log('Lugares guardados con éxito:', response);
                },
                error: function (xhr, status, error) {
                    console.error('Error al guardar los lugares:', error);
                }
            });
        }
    }
});
