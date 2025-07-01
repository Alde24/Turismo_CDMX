async function obtenerPreferencias() {
    try {
        const response = await fetch('../php/busquedaHospedaje.php');
        if (!response.ok) throw new Error("Error al obtener las preferencias.");
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

function convertirDistancia(distancia) {
    return {
        "Menos de 1 km": 1000,
        "Entre 1 y 3 km": 3000,
        "Entre 3 y 5 km": 5000,
        "Más de 5 km": 10000
    }[distancia] || 1000;
}

function buscarHospedajes(preferencias) {
    const cdmx = { lat: 19.432608, lng: -99.133209 };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: cdmx,
        zoom: 14,
    });

    const service = new google.maps.places.PlacesService(map);
    const radius = convertirDistancia(preferencias.distancia);
    const minRating = (preferencias.prioridad / 2) - 0.5;

    preferencias.tipoAlojamiento.forEach((tipo) => {
        const request = {
            location: cdmx,
            radius: radius,
            type: tipo,
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                mostrarResultados(results, minRating);
            }
        });
    });
}

function mostrarResultados(places, minRating) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    places.filter(place => place.rating >= minRating).forEach((place) => {
        const card = document.createElement("div");
        card.classList.add("card", "mb-3");

        card.innerHTML = `
            <input type="checkbox" class="card-checkbox" id="checkbox-${place.name}">
            <label for="checkbox-${place.name}" class="card-content">
                <img src="https://via.placeholder.com/150" class="card-img-top" alt="${place.name}">
                <div class="card-body">
                    <h5 class="card-title">${place.name}</h5>
                    <p class="card-text">Calificación: ${place.rating || "Sin calificación"}</p>
                    <p class="card-text">Dirección: ${place.vicinity || "Sin dirección"}</p>
                </div>
            </label>
        `;
        resultsDiv.appendChild(card);
    });
}

document.getElementById("buscarHospedajes").addEventListener("click", async () => {
    const preferencias = await obtenerPreferencias();
    if (preferencias) buscarHospedajes(preferencias);
});
