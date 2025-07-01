$(document).ready(() => {
    async function obtenerDetallesLugar() {
        const lugar = JSON.parse(localStorage.getItem('detalleLugar'));
        if (!lugar) {
            console.error('No se encontró información del lugar en LocalStorage.');
            return null;
        }

        const API_KEY = "AIzaSyBlBfvcJxLHgYnFMJBbgLmdzIS_mI2QZZQ";
        const apiUrl = `https://places.googleapis.com/v1/places/${lugar}?fields=id,displayName,formattedAddress,plusCode,photos,location,priceLevel,priceRange,rating,reviews,nationalPhoneNumber,userRatingCount,types&key=${API_KEY}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Procesar fotos si existen
            if (data.photos && Array.isArray(data.photos)) {
                data.fotosLugar = data.photos.slice(0, 3).map(photo =>
                    `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=400&maxWidthPx=400&key=${API_KEY}`
                );
            } else {
                data.fotosLugar = []; // Evita errores si no hay fotos
            }

            console.log("Detalles del lugar obtenidos:", data);
            return data;
        } catch (error) {
            console.error('Error al obtener los detalles del lugar:', error);
            return null;
        }
    }

    async function obtenerDescripcionLugar(lugar) {
        try {
            const response = await fetch(`../php/WikipediaApi.php?lugar=${encodeURIComponent(lugar)}`);
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data.descripcion_larga || "No se encontró una descripción para este lugar.";
        } catch (error) {
            console.error(`Error al obtener descripción para el lugar: ${lugar}`, error);
            return "Error al obtener la descripción.";
        }
    }

    // Función para convertir priceLevel a valores numéricos aproximados
    function obtenerPrecioNumerico(priceLevel) {
        const precios = {
            0: { min: 0, max: 0, texto: "Gratis" },
            1: { min: 50, max: 200, texto: "$50 - $200 MXN" },
            2: { min: 200, max: 500, texto: "$200 - $500 MXN" },
            3: { min: 500, max: 1500, texto: "$500 - $1500 MXN" },
            4: { min: 1500, max: 5000, texto: "$1500 - $5000 MXN" }
        };
        return precios[priceLevel] || { min: "?", max: "?", texto: "Precio desconocido" };
    }

    async function cargarDatos() {
        const respuesta = await obtenerDetallesLugar();
        if (!respuesta) {
            console.log('No se pudo obtener la información del lugar.');
            return;
        }

        $('#titleLugar').text(respuesta.displayName.text);
        $('#detallesLugar').html(respuesta.formattedAddress); 

        // Obtener descripción y actualizar HTML
        const descripcion = await obtenerDescripcionLugar(respuesta.displayName.text);
        $('#descripcion').html(descripcion);

        // Obtener precio aproximado
        const precioAproximado = obtenerPrecioNumerico(respuesta.priceLevel);
        $('#precioLugar').text(precioAproximado.texto);
        $('#precioNumerico').text(`Estimado: $${precioAproximado.min} - $${precioAproximado.max} MXN`);

        // Insertar fotos en el carrusel
        const carouselInner = $('#carouselFotosInner');
        if (respuesta.fotosLugar.length > 0) {
            respuesta.fotosLugar.forEach((foto, index) => {
                const activeClass = index === 0 ? 'active' : ''; // El primer elemento será el activo
                carouselInner.append(`
                    <div class="carousel-item ${activeClass}">
                        <img src="${foto}" class="d-block w-100" alt="Foto del lugar">
                    </div>
                `);
            });
        } else {
            console.log("No se encontraron fotos para este lugar.");
        }
        // Insertar reseñas en el HTML
        const contenedorReseñas = $('#ContRewiev');
        contenedorReseñas.empty(); // Limpiar reseñas previas
        const nombreLugar = respuesta.displayName.text
        if (respuesta.reviews && respuesta.reviews.length > 0) {
            respuesta.reviews.forEach(review => {
                contenedorReseñas.append(`
                    <div class="swiper-slide">
                            <div class="review-card" onclick="location.href='#'">
                                <div class="stars">${review.rating} ★★★★★</div>
                                <div class="hotel-name">${nombreLugar}</div>
                                
                                <div class="reviewer-info">
                                    
                                    <div>
                                        <div class="reviewer-name">${review.authorAttribution.displayName}</div>
                                        <div class="reviewer-name">${review.originalText.text}</div>
                                        <div class="review-date">${review.relativePublishTimeDescription}</div>
                                    </div>
                                </div>
                            </div>
                    </div>
                `);
            });
        } else {
            contenedorReseñas.html("<p>No hay reseñas disponibles.</p>");
        }
    }

    // Llamar a la función de carga de datos
    cargarDatos();
});
