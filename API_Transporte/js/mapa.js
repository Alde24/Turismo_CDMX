let mapa, directionsService, directionsRenderer, geocoder;

function iniciarMapa() {
  // Inicializar el mapa
  mapa = new google.maps.Map(document.getElementById("mapa"), {
    zoom: 14,
    center: { lat: 19.504952676161075, lng: -99.14629081790021 }, // Centro inicial
  });

  // Inicializar servicios de direcciones y renderización
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: true,
    map: mapa,
    panel: document.getElementById("panel"),
  });

  directionsRenderer.setMap(mapa);

  // Inicializar geocoder
  geocoder = new google.maps.Geocoder();

  // Configurar Autocomplete para los campos de entrada
  const opciones = {
    fields: ["formatted_address", "geometry"],
    componentRestrictions: { country: "mx" }, // Opcional: restringir a México
  };

  const autocompleteInicio = new google.maps.places.Autocomplete(
    document.getElementById("inicio"),
    opciones
  );

  const autocompleteDestino = new google.maps.places.Autocomplete(
    document.getElementById("destino"),
    opciones
  );

  // Manejar cambios en las direcciones para calcular distancia total
  directionsRenderer.addListener("directions_changed", () => {
    const directions = directionsRenderer.getDirections();
    if (directions) {
      computeTotalDistance(directions);
    }
  });
}

function calcularRuta() {
  iniciarMapa();
  const inicio = document.getElementById("inicio").value;
  const destino = document.getElementById("destino").value;
  const escalasTexto = document.getElementById("escalas").value;
  const modo = document.getElementById("modo").value;

  if (!["DRIVING", "WALKING", "TRANSIT"].includes(modo)) {
    alert("Por favor, selecciona un modo de transporte válido.");
    return;
  }

  const escalas = escalasTexto
    .split(",")
    .map((lugar) => lugar.trim())
    .filter((lugar) => lugar.length > 0);

  if (!inicio || !destino) {
    alert("Por favor, ingresa tanto un punto de inicio como un destino.");
    return;
  }
  

  obtenerCoordenadas(inicio, (inicioCoord) => {
    obtenerCoordenadas(destino, (destinoCoord) => {
      if (modo === "TRANSIT" && escalas.length > 0) {
        generarRutasPorSegmentos(inicioCoord, destinoCoord, escalas, modo);
      } else {
        const waypoints = escalas.map((escala) => ({ location: escala, stopover: true }));
        generarRuta(inicioCoord, destinoCoord, waypoints, modo);
      }
    });
  });
}

function obtenerCoordenadas(direccion, callback) {
  geocoder.geocode({ address: direccion }, (resultados, estado) => {
    if (estado === google.maps.GeocoderStatus.OK) {
      callback(resultados[0].geometry.location);
    } else {
      alert("No se pudo obtener la ubicación de: " + direccion);
    }
  });
}

function generarRuta(inicio, destino, waypoints, modo) {
  if (modo === "TRANSIT" && waypoints.length > 0) {
    // Si es transporte público y hay escalas, calculamos por segmentos
    generarRutasPorSegmentos(inicio, destino, waypoints, modo);
  } else {
    const solicitud = {
      origin: inicio,
      destination: destino,
      waypoints: waypoints,
      travelMode: modo,
    };

    directionsService.route(solicitud, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
        const panelDiv = document.getElementById("panel");
        panelDiv.innerHTML = ""; // Limpiar instrucciones previas
        mostrarInstrucciones(result, panelDiv);
      } else {
        alert("No se pudo calcular la ruta completa.");
      }
    });
  }
}

function mostrarInstrucciones(result, panelDiv) {
  const legs = result.routes[0].legs;

  legs.forEach((leg, index) => {
    const steps = leg.steps;

    steps.forEach((step, stepIndex) => {
      let instrucciones = step.instructions || "Sin instrucciones disponibles";
      const distancia = step.distance ? step.distance.text : "N/A";
      const duracion = step.duration ? step.duration.text : "N/A";

      // Si es el último paso del segmento, agregar mensaje de llegada con nombre del lugar
      if (stepIndex === steps.length - 1) {
        const nombreDestino = obtenerNombreDelLugar(leg.end_location);
        instrucciones += `<div class="final">¡Has llegado al destino: ${nombreDestino}!</div>`;
      }

      // Insertar instrucciones en el panel
      
    });

    
  });
}

function mostrarInstruccionesTransportePublico(result, panelDiv) {
  const legs = result.routes[0].legs;

  legs.forEach((leg, index) => {
    const steps = leg.steps;

    steps.forEach((step, stepIndex) => {
      let instrucciones = step.instructions || "Sin instrucciones disponibles";
      const distancia = step.distance ? step.distance.text : "N/A";
      const duracion = step.duration ? step.duration.text : "N/A";

      // Si es el último paso del segmento, agregar mensaje de llegada con nombre del lugar
      if (stepIndex === steps.length - 1) {
        const nombreDestino = obtenerNombreDelLugar(leg.end_location);
        instrucciones += `<div class="final">¡Has llegado al destino: ${nombreDestino}!</div>`;
      }

      // Insertar instrucciones en el panel
      panelDiv.innerHTML += `
        <li>
          <p>${instrucciones}</p>
          <p><b>Distancia:</b> ${distancia} <b>Duración:</b> ${duracion}</p>
        </li>`;
    });

    // Al final de cada "leg", mostrar un mensaje de llegada al destino principal
    if (index === legs.length - 1) {
      const nombreDestinoFinal = obtenerNombreDelLugar(leg.end_location);
      panelDiv.innerHTML += `
        <li>
          <div class="final">¡Has llegado al destino final: ${nombreDestinoFinal}!</div>
        </li>`;
    }
  });
}


function computeTotalDistance(result) {
  let total = 0;
  const myroute = result.routes[0];

  if (!myroute) {
    return;
  }

  for (let i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }

  total = total / 1000; // Convertir metros a kilómetros
  document.getElementById("total").innerHTML = `${total.toFixed(2)} km`;
}

function generarRutasPorSegmentos(inicio, destino, escalas, modo) {
  const puntos = [inicio, ...escalas, destino]; // Arreglo con los puntos de inicio, escalas y destino
  let rutaActual = 0; // Controlador del segmento actual

  const panelDiv = document.getElementById("panel");
  panelDiv.innerHTML = ""; // Limpiar instrucciones previas

  function generarSiguienteRuta() {
    if (rutaActual < puntos.length - 1) {
      const solicitud = {
        origin: puntos[rutaActual],
        destination: puntos[rutaActual + 1],
        travelMode: modo,
        transitOptions: modo === "TRANSIT" ? { departureTime: new Date() } : undefined, // Asegura que el transporte público considere la hora
      };

      directionsService.route(solicitud, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const renderer = new google.maps.DirectionsRenderer({
            map: mapa,
            suppressMarkers: false,
            panel: null, // Puede ser `null` si no deseas mostrar instrucciones para este segmento
          });
          renderer.setDirections(result); // Renderizar solo este segmento

          // Mostrar instrucciones de la ruta
          mostrarInstruccionesTransportePublico(result, panelDiv);

          rutaActual++; // Avanzar al siguiente segmento
          generarSiguienteRuta(); // Llamar a la siguiente parte de la ruta
        } else {
          alert("No se pudo calcular la subruta del segmento: " + (rutaActual + 1));
        }
      });
    }
  }

  generarSiguienteRuta(); // Iniciar el cálculo de rutas
}


// Función para obtener solo el nombre del lugar (geocoding inverso)
function obtenerNombreDelLugar(coordenadas) {
  let nombreLugar = "Destino desconocido";

  geocoder.geocode({ location: coordenadas }, (resultados, estado) => {
    if (estado === google.maps.GeocoderStatus.OK && resultados[0]) {
      // Extraer el nombre del lugar del resultado de geocodificación
      for (let i = 0; i < resultados[0].address_components.length; i++) {
        const componente = resultados[0].address_components[i];
        if (componente.types.includes("locality") || componente.types.includes("administrative_area_level_1")) {
          nombreLugar = componente.long_name;
          break;
        }
      }
    }
  });

  return nombreLugar;
}