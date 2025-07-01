$(document).ready(() => {
    // Configura tu clave de API de Google Places
    const API_KEY = 'AIzaSyBlBfvcJxLHgYnFMJBbgLmdzIS_mI2QZZQ';
    const CDMX_COORDS = { lat: 19.432608, lng: -99.133209 }; // Coordenadas de la CDMX
    const RADIO_BUSQUEDA = 20000; // Radio en metros (20 km)
    const map = new google.maps.Map(document.createElement('div')); // Necesario para inicializar PlacesService
    const service = new google.maps.places.PlacesService(map); // Inicializamos el servicio
    let todosLugares = [];

    // Petición AJAX para obtener los lugares
    $.ajax({
        url: './ObtenerFotos.php', // Suponemos que esta URL devuelve los lugares con sus IDs
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            idLugares = response.datos; // Datos recibidos de la petición

            // Promesas para manejar múltiples peticiones asíncronas de fotos
            let promesas = [];

            // Recorrer el arreglo de lugares
            idLugares.forEach(element => {
                // Para cada lugar, obtenemos detalles adicionales, como fotos
                const request = {
                    placeId: element.id // Usamos el ID de cada lugar
                };

                // Crear una promesa para obtener las fotos de cada lugar
                let promesa = new Promise((resolve, reject) => {
                    service.getDetails(request, (place, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            // Si la respuesta es exitosa, obtenemos las fotos del lugar
                            let fotosURLs = [];
                            if (place.photos && place.photos.length > 0) {
                                place.photos.forEach(photo => {
                                    const photoURL = photo.getUrl({ maxWidth: 400, maxHeight: 400 }); // URL de la foto
                                    fotosURLs.push(photoURL); // Guardamos la URL en el arreglo
                                });
                            }

                            // Añadir lugar y fotos al arreglo general
                            todosLugares.push({
                                id: element.id,
                                nombre: place.name,
                                fotos: fotosURLs
                            });

                            resolve(); // Resolver la promesa después de agregar el lugar
                        } else {
                            console.error('Error al obtener detalles del lugar', status);
                            reject(); // Rechazar la promesa si ocurre un error
                        }
                    });
                });

                // Almacenamos la promesa en el arreglo
                promesas.push(promesa);
            });

            // Esperamos a que todas las peticiones se completen antes de enviar los datos
            Promise.all(promesas).then(() => {
                // Aquí puedes hacer algo después de que todas las fotos hayan sido obtenidas
                console.log(todosLugares); // Muestra los lugares con las fotos
                // Enviar los datos en un ajax para guardar las fotos y la ruta en la base de datos
                $.ajax({
                    url: './GuardarFotos.php',
                    type: 'POST',
                    data: { lugares: JSON.stringify(todosLugares) }, // Asegúrate de enviar los datos como JSON
                    dataType: 'json',
                    success: function(response) {
                        console.log('Fotos guardadas con éxito');
                    },
                    error: function(response) {
                        console.error('Error al guardar las fotos');
                    }
                });
            }).catch(error => {
                console.error('Error en las peticiones de fotos:', error);
            });

        },
        error: function(error) {
            console.error('Error al obtener lugares:', error);
        }
    });
});
