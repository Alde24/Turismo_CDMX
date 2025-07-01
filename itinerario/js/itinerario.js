document.addEventListener("DOMContentLoaded", function () {
  // Cargar el encabezado y pie de página de forma dinámica
  fetch("../../navbar/html/navbar.html")
    .then(response => response.ok ? response.text() : Promise.reject("Error al cargar el navbar"))
    .then(data => document.getElementById("header").innerHTML = data)
    .catch(error => console.error(error));

  fetch("../../navbar/html/footer.html")
    .then(response => response.ok ? response.text() : Promise.reject("Error al cargar el footer"))
    .then(data => document.getElementById("footer").innerHTML = data)
    .catch(error => console.error(error));
});

//Variables globales
let mapa, directionsService, directionsRenderer, geocoder, markers = [],inicio,destino,escalas,fotosBase=[];
//RUTAS POR EL MOMENTO ESTATICAS
const rutas = {
  day1: [
      { descripcion: "Desayuno en Harbuguesas Sotelo", name: "Hamburguesas Sotelo", lat: 19.447187493764595, lng: -99.21519757538655, hora: "10:00 am"  },
      { descripcion: "Visitar el Museo Soumaya", name: "Museo Soumaya", lat: 19.440918815515342, lng: -99.20487498244994, hora: "11:00 am" },
      { descripcion: "Cena en el hogar de la tlayuda", name: "Hogar de la tlayuda", lat: 19.41812147629711, lng: -99.16587819454072, hora: "12:00 am"  },
  ],
  day2: [
      { descripcion: "Desayuno en VIPS San Rafael", name: "VIPS San Rafael", lat: 19.43648175214144, lng: -99.15747294590925, hora: "10:00 am" },
      { descripcion: "Visitar el Monumento a la Revolución", name: "Monumento a la Revolucion", lat: 19.436441282496748, lng: -99.1546298044097, hora: "11:30 am" },
      { descripcion: "Cena en Piazzaroma", name: "Piazzaroma", lat: 19.43663658087851, lng: -99.15283022001589, hora: "8:00 pm" }
  ],
  day3: [
      { descripcion: "Desayuno en Azul Histórico", name: "Restaurante Azul Histórico", lat: 19.4328813424215, lng: -99.13600994049737, hora: "9:00 am" },
      { descripcion: "Visitar la Catedral Metropolitana", name: "Catedral Metropolitana", lat: 19.434447899219194, lng: -99.13303763579106, hora: "10:30 am" },
      { descripcion: "Descansar en Hotel Catedral", name: "Hotel Catedral", lat: 19.435797061554936, lng: -99.13306134503259, hora: "8:00 pm" }
  ],
  day4: [
      { descripcion: "Desayuno en la Perla de la Obrera", name: "Perla de la Obrera", lat: 19.413460921097293, lng: -99.14356459301241, hora: "9:30 am" },
      { descripcion: "Visitar el Museo del Juguete Antiguo", name: "Museo del Juguete Antiguo", lat: 19.415965982978705, lng: -99.14455149119433, hora: "11:00 am" },
      { descripcion: "Cena en Taqueria la Michoana", name: "Taqueria la Michoana", lat: 19.411704569819587, lng: -99.14148569421849, hora: "7:30 pm" }
  ]
};
// Inicializa el mapa
// Inicializa el mapa
function iniciarMapa() {
  // Obtener las coordenadas del primer lugar de day1
  const primerLugar = rutas.day1[0];
  // Verifica si Google Maps está disponible
  if (typeof google === 'object' && typeof google.maps === 'object') {
    mapa = new google.maps.Map(document.getElementById("mapaAPI"), {
      zoom: 14,
      center: {  lat: primerLugar.lat, lng: primerLugar.lng  }, // Centro inicial
    });

    // Inicializar servicios de direcciones y renderización
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
      draggable: true,
      map: mapa,
      panel: document.getElementById("instrucciones"),
    });

  directionsRenderer.setMap(mapa);

  // Inicializar geocoder
  geocoder = new google.maps.Geocoder();
   
  
  } else {
    console.error("Error al cargar Google Maps. Asegúrate de incluir la API.");
  }
}


// Exponer la función globalmente para que se pueda utilizar desde otros lugares
window.iniciarMapa = iniciarMapa;

function showSection(section, day = null) {
  // Alternar la visibilidad de las secciones
  ['calendar', 'itinerary', 'map'].forEach(id =>
    document.getElementById(id)?.classList.toggle('hidden', id !== section)
  );

  // Desmarcar todas las pestañas
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('selected'));

  // Marcar la pestaña seleccionada
  const tab = document.querySelector(`.tab[onclick="showSection('${section}')"]`);
  if (tab) tab.classList.add('selected');

  if (day) {
    const daySelect = document.getElementById('day-select');
    if (daySelect) {
      daySelect.value = day;
      showDay();
    }
  }

  if (section === "map") {
    setTimeout(() => {
      // Obtener las coordenadas del primer lugar de day1
      const primerLugar = rutas.day1[0];
      if (mapa) {
        google.maps.event.trigger(mapa, "resize"); // Actualizar el mapa
        mapa.setCenter({ lat: primerLugar.lat, lng: primerLugar.lng  }); // Centrar el mapa
      } else {
        iniciarMapa(); // Inicializar el mapa si no existe
      }
    }, 300);
  }
}

// Función para mostrar actividades según el día seleccionado
async function showDay(itinerario) {
  // Obtener el valor del día seleccionado desde el selector
  const selectedDay = document.getElementById('day-select-Iti');
  
  // Si no se ha seleccionado un día, detener la función
  if (!selectedDay) return;
  
  const activities = itinerario[selectedDay.value] || []; // Usar value del selector
  console.log(activities);

  // Obtener el contenedor donde se mostrarán las actividades
  const lugaresContainer = document.getElementById("Cont-Itinerario");
  if (!lugaresContainer) return; // Asegurarse de que el contenedor exista

  // Limpiar el contenedor de actividades antes de agregar nuevos elementos
  lugaresContainer.innerHTML = "";

  // Genera las actividades para el día seleccionado
  for (const activity of activities) {
    let detalles = {};
    if (activity.tipo === 'Comida') {
      try {
        // Esperar a que se resuelvan los detalles del lugar
        detalles = await obtenerDetallesLugar(activity.id);
        console.log(detalles); // Aquí los detalles ya estarán disponibles
      } catch (error) {
        console.error("Error al obtener los detalles del lugar:", error);
        detalles = {};
      }
    }

    // Crear la tarjeta de actividad
    const card = document.createElement('div');
    card.classList.add('activity-card', 'row', 'm-4'); // Agregar clases de manera separada

    // Construir el contenido del itinerario con imagen, nombre y hora
    card.innerHTML = `
      <!--<img src="../imgs/viaje.jpg" alt="${activity.nombre}" class="col-lg-2 col-md-2 col-sm-2 my-2 img-fluid iti">-->
      <div class="row activity-content">
        <h3 class="col-12 text-start">${activity.nombre}</h3>
        <div class="row">
          <p class="col-6">${activity.tipo}</p>
          <div class="col-6 activity-price">
            <p> Costo Aprox.: ${detalles?.precio || "Precio no disponible"}</p>
          </div>
        </div>
      </div>
    `;

    // Añadir la tarjeta al contenedor de actividades
    lugaresContainer.appendChild(card);
  }
}

// Función para obtener detalles del lugar desde la API de Google Places
function obtenerDetallesLugar(placeId) {
  const fields = "formatted_address,name,rating,types,price_level,geometry";
  const url = `../php/proxy.php?place_id=${placeId}&fields=${fields}`;

  // Retorna la promesa para que pueda manejarse con await o then
  return fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Error en la solicitud: ${response.statusText}`);
          }
          return response.json();
      })
      .then(data => {
          // Verificar si se obtuvo un resultado de lugar
          if (data.result) {
              // Convertir price_level a rango en pesos mexicanos
              const priceLevel = data.result.price_level;
              const priceMXN = convertirPriceLevelAPesos(priceLevel);
              return {
                  nombre: data.result.name || "No disponible",
                  direccion: data.result.formatted_address || "No disponible",
                  valoracion: data.result.rating || "No disponible",
                  categorias: data.result.types || "No disponible",
                  precio: priceMXN|| "No disponible",
                  idLugar: placeId,
                  Latitud: data.result.geometry.location.lat || "No disponible",
                  Longitud: data.result.geometry.location.lng || "No disponible"
              };
          } else {
              console.error("No se encontraron resultados para este lugar.");
              return null;
          }
      })
      .catch(error => {
          console.error("Error al obtener los detalles del lugar:", error);
          return null;
      });
}
// Función para convertir price_level a valor medio en pesos mexicanos
function convertirPriceLevelAPesos(priceLevel) {
  switch (priceLevel) {
      case 0:
          return "$0 (Gratis)";
      case 1:
          return "$125 (Rango: $1 - $250)";
      case 2:
          return "$375 (Rango: $251 - $500)";
      case 3:
          return "$750 (Rango: $501 - $1,000)";
      case 4:
          return "$1,500+ (Rango: $1,001 o más)";
      default:
          return "Precio no disponible";
  }
}



function toggleIconsAndContent() {
  const iconRoute = document.getElementById('icon-route');
  const iconList = document.getElementById('icon-list');
  const lugares = document.querySelector('.lugares');
  const indicaciones = document.querySelector('.indicaciones');

  [iconRoute, iconList, lugares, indicaciones].forEach(el => el?.classList.toggle('hidden'));
  // Mostrar o esconder el panel de instrucciones
  const instrucciones = document.getElementById('instrucciones');
  if (instrucciones) {
    instrucciones.classList.toggle('hidden');
  }
}

function showMap(itinerario,transporte) { 
  const mapaSeccion = document.getElementById("mapaAPI");
  if (mapaSeccion) mapaSeccion.classList.remove("hidden");

  const daySelect = document.getElementById('day-select-Map');
 
  if (!daySelect) return;

  // Obtener el día seleccionado. Si no hay selección, usar el día 1 por defecto
  const day = daySelect ? daySelect.value : '1'; 
  console.log(day);

  const lugares = itinerario[day]; // Obtener los lugares del día seleccionado
  if (!lugares) return;
  console.log(lugares);
  // Limpiar el contenido previo de la lista de lugares
  const lugaresContainer = document.querySelector(".lugares");
  if (lugaresContainer) {
    lugaresContainer.innerHTML = "";  // Limpiar antes de agregar nuevos elementos

    // Generar y agregar los nuevos elementos
    lugares.forEach(lugar => {
      const mapCard = document.createElement("div");
      mapCard.classList.add("map-card");

      mapCard.innerHTML = ` 
        <!--<img src="../imgs/viaje.jpg" alt="${lugar.nombre}">-->
        <div class="texto">   
          <h3>${lugar.nombre}</h3>
          
        </div>
      `;

      lugaresContainer.appendChild(mapCard);
    });
  }

  
  calcularRuta(day,transporte,itinerario);
}


function calcularRuta(day,transporte,itinerario) {
  iniciarMapa(); // Inicia el mapa
  console.log(day);

  // Modo de transporte (puede cambiarse a 'DRIVING', 'WALKING', etc.) de acuerdo al valor ingresado por el usuario
  let modo = '';
  if(transporte == 'publico'){
    modo = 'TRANSIT';
  }else if(transporte == 'privado'){
    modo = 'DRIVING';
  }
  else if(transporte == 'caminando'){
    modo = 'WALKING';
  }else{
    modo = 'No disponible';
  }
  
 

  // Obtener las rutas del día seleccionado
  const rutaDia = itinerario[day];

  if (!rutaDia || rutaDia.length < 2) {
    console.error("No se puede procesar la ruta: faltan puntos de inicio o destino.");
    return;
  }

  // Convertir latitudes y longitudes a números
  const convertirCoordenadas = (punto) => ({
    lat: parseFloat(punto.Latitud),
    lng: parseFloat(punto.Longitud),
    descripcion: punto.descripcion,
  });

  // Punto de inicio
  const inicio = convertirCoordenadas(rutaDia[0]);

  // Punto de destino
  const destino = convertirCoordenadas(rutaDia[rutaDia.length - 1]);

  // Escalas (puntos intermedios)
  const escalas = rutaDia.slice(1, -1).map(convertirCoordenadas);

  console.log("Punto de inicio:", inicio);
  console.log("Punto de destino:", destino);
  console.log("Escalas:", escalas);

  // Generar ruta según las condiciones
  if (modo == "TRANSIT") {
    console.log("Publico");
    generarRutasPorSegmentos(inicio, destino, escalas, modo,day);
  } else {
    console.log("No Publico");
    generarRuta(inicio, destino, escalas, modo,day);
  }

  // Bloque comentado para uso futuro (coordenadas dinámicas)
  /* 
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
  */
}

function generarRuta(inicio, destino, waypoints, modo,day) {
  // Validar si es necesario dividir en segmentos por el modo de transporte
  if (modo === "TRANSIT" ) {
    generarRutasPorSegmentos(inicio, destino, waypoints, modo,day);
  } else {
    // Configurar la solicitud de ruta
    const solicitud = {
      origin: { lat: inicio.lat, lng: inicio.lng },
      destination: { lat: destino.lat, lng: destino.lng},
      waypoints: waypoints.map((escala) => ({
        location: { lat: escala.lat, lng: escala.lat},
        stopover: true,
      })),
      travelMode: modo, // Modo de viaje (DRIVING, WALKING, TRANSIT, etc.)
    };

    // Solicitar la ruta al servicio de Google Maps
    directionsService.route(solicitud, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        // Renderizar la ruta en el mapa
        directionsRenderer.setDirections(result);

        // Actualizar el panel con las instrucciones paso a paso
        const panelDiv = document.getElementById("instrucciones");
        if (panelDiv) {
          panelDiv.innerHTML = ""; // Limpiar cualquier contenido previo
          mostrarInstrucciones(result, panelDiv,day);
        }
      } else {
        alert("No se pudo calcular la ruta completa. Verifica los datos proporcionados.");
      }
    });
  }
}

function generarRutasPorSegmentos(inicio, destino, escalas, modo,day) {
  // Crear un arreglo con los puntos de la ruta (inicio, escalas y destino)
  const puntos = [inicio, ...escalas, destino];
  let rutaActual = 0; // Índice para controlar el segmento actual
  console.log(puntos);
  // Limpiar el panel de instrucciones previas si existe
  const panelDiv = document.getElementById("instrucciones");
  if (panelDiv) panelDiv.innerHTML = "";

  // Función para generar la ruta segmento por segmento
  function generarSiguienteRuta() {
    if (rutaActual < puntos.length - 1) {
      // Configurar la solicitud para el segmento actual
      console.log(puntos[rutaActual].lng);
      const solicitud = {
        origin: { lat: puntos[rutaActual].lat, lng: puntos[rutaActual].lng },
        destination: { lat: puntos[rutaActual + 1].lat, lng: puntos[rutaActual + 1].lng},
        travelMode: modo,
        transitOptions: modo === "TRANSIT" ? { departureTime: new Date() } : undefined, // Transporte público considera la hora actual

      };

      // Solicitar la ruta al servicio de Google Maps
      directionsService.route(solicitud, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          // Crear un nuevo renderer para este segmento
          const renderer = new google.maps.DirectionsRenderer({
            map: mapa,
            suppressMarkers: false, // Mostrar marcadores predeterminados de Google
            preserveViewport: true, // No modificar el encuadre del mapa
          });

          renderer.setDirections(result); // Dibujar el segmento en el mapa

          // Mostrar instrucciones en el panel si existe
          if (panelDiv) mostrarInstruccionesTransportePublico(result, panelDiv,day);

          // Avanzar al siguiente segmento
          rutaActual++;
          generarSiguienteRuta(); // Calcular la siguiente parte de la ruta
        } else {
          alert("No se pudo calcular el segmento: " + (rutaActual + 1));
        }
      });
    }
  }

  // Iniciar el cálculo de rutas por segmentos
  generarSiguienteRuta();
}


function mostrarInstrucciones(result, panelDiv,day) {
  const legs = result.routes[0].legs;

  legs.forEach((leg, index) => {
    const steps = leg.steps;

    steps.forEach((step, stepIndex) => {
      let instrucciones = step.instructions || "Sin instrucciones disponibles";
      const distancia = step.distance ? step.distance.text : "N/A";
      const duracion = step.duration ? step.duration.text : "N/A";

      // Si es el último paso del segmento, agregar mensaje de llegada con nombre del lugar
      if (stepIndex === steps.length - 1) {
        const nombreDestino = obtenerNombreLugarDeRuta(leg.end_location,day);
        instrucciones += `<div class="final">¡Has llegado al destino: ${nombreDestino}!</div>`;
      }

      // Insertar instrucciones en el panel
      
    });

    
  });
}

function mostrarInstruccionesTransportePublico(result, panelDiv, day) {
  const legs = result.routes[0].legs;

  legs.forEach((leg, index) => {
    const steps = leg.steps;

    steps.forEach((step, stepIndex) => {
      let instrucciones = step.instructions || "Sin instrucciones disponibles";
      const distancia = step.distance ? step.distance.text : "N/A";
      const duracion = step.duration ? step.duration.text : "N/A";

      // Si es el último paso del segmento, agregar mensaje de llegada con nombre del lugar
      if (stepIndex === steps.length - 1) {
        const nombreDestino = obtenerNombreLugarDeRuta(leg.end_location, day);
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
      const nombreDestinoFinal = obtenerNombreLugarDeRuta(leg.end_location, day);
      panelDiv.innerHTML += `
        <li>
          <div class="final">¡Has llegado al destino final: ${nombreDestinoFinal}!</div>
        </li>`;
    }
  });
}

// Función para obtener el nombre del lugar desde el objeto `rutas`
function obtenerNombreLugarDeRuta(coordenadas, day) {
  const rutaDia = rutas[day];

  if (!rutaDia) return "Destino desconocido";

  // Buscar el lugar según las coordenadas
  const lugar = rutaDia.name;

  return lugar ? lugar.name : "Destino desconocido";
}

let itinerario = {};

//JQUERY
$(document).ready(()=>{
  //VARIABLES GLOBALES
  //Variables del storage
  const idFormStorage = localStorage.getItem('idFormularioActual');
  const idUsuarioStorage = localStorage.getItem('idUser');
  //Verificar que el usuario selecciono la opcion de No Sorprendeme
  var ConoceLugares = localStorage.getItem("Ubicacion_Conocida");
  //Preguntamos si conoce lugares o no
  if(ConoceLugares == 'Si'){
    //LOGICA DE TAZIM Y OMAR

  }else{
    let datosComida = {};
    let datosLugar = {};
    let diasItinerario = localStorage.getItem('Fechas');
    
    let transporte = "";
    const obtenerTransporte = $.ajax({
      url:"../php/ConsultarDiasGuardados.php",
      type: "POST",
      data: {
          Consulta: 'Transporte',
          idFormulario: idFormStorage,
          idUsuario: idUsuarioStorage,
          Fechas: diasItinerario
      },
      dataType: "json"
    })
    
    // Promesas para las llamadas AJAX
    const obtenerComida = $.ajax({
        url: "../php/ConsultarDiasGuardados.php",
        type: "POST",
        data: {
            Consulta: 'Comida',
            idFormulario: idFormStorage,
            idUsuario: idUsuarioStorage,
            Fechas: diasItinerario
        },
        dataType: "json"
    });
    
    const obtenerLugares = $.ajax({
        url: "../php/ConsultarDiasGuardados.php",
        type: "POST",
        data: {
            Consulta: 'Lugares',
            idFormulario: idFormStorage,
            idUsuario: idUsuarioStorage,
            Fechas: diasItinerario
        },
        dataType: "json"
    });
    
    // Esperar a ambas promesas
    Promise.all([obtenerComida, obtenerLugares,obtenerTransporte])
        .then(([responseComida, responseLugar,responseTransporte]) => {
            // Procesar respuesta de comida
            if (responseComida.status === "success") {
                for (const [dia, lugares] of Object.entries(responseComida.data || {})) {
                    if (Array.isArray(lugares)) {
                        datosComida[dia] = lugares;
                    } else {
                        console.error(`Error en comida para el día ${dia}:`, lugares.error);
                    }
                }
            } else {
                console.error(`Error en la consulta de comida: ${responseComida.message}`);
            }
    
            // Procesar respuesta de lugares
            if (responseLugar.status === "success") {
                for (const [dia, lugares] of Object.entries(responseLugar.data || {})) {
                    if (Array.isArray(lugares)) {
                        datosLugar[dia] = lugares;
                    } else {
                        console.error(`Error en lugares para el día ${dia}:`, lugares.error);
                    }
                }
                fotosBase = responseLugar.Fotos;
                console.log(fotosBase);
            
            } else {
                console.error(`Error en la consulta de lugares: ${responseLugar.message}`);
            }
            //Procesar respuesta de transporte
            if(responseTransporte.status === "success"){
              //Almacenar el transporte
              transporte = responseTransporte.data.transporte;
              //console.log(transporte);
            }
            
            // Almacenar el itinerario final intercalado
            itinerario = generarItinerario(datosComida,datosLugar);

            // Mostrar el itinerario (solo para debug)
            //console.log(itinerario);
            
            //Hacel el filtrado de la foto de la base de datos:
            
      
            // Generar las cards dinámicas
            for (const [dia, lugares] of Object.entries(datosLugar)) {
                if (Array.isArray(lugares) && lugares.length > 0) {
                    const primerLugar = lugares[0]; // Seleccionar el primer lugar
                    const foto = fotosBase.filter(f=>{
                      return(
                          f.lugar_id == primerLugar.idLugar
                      )
                    });
                    rutaFoto =foto[0].foto_url
                    const card = `
                        <div class="col-lg-2 col-auto mx-2 mb-4 day-card" id="CardLugar" onclick="showSection('itinerary', '${dia}')">
                            <img src="${rutaFoto}" class="img-fluid" id="ImgCard" alt="Imagen de ${primerLugar.Nombre}">
                            <h5 id="Dia">Día ${Object.keys(datosLugar).indexOf(dia) + 1}</h5>
                            <p class="fecha" id="Fecha">${dia}</p>
                            <p id="Descripcion">${primerLugar.Nombre}</p>
                        </div>
                    `;
                    $('#CardsCalendIti').append(card);
                } else {
                    console.warn(`No hay lugares disponibles para el día ${dia}`);
                }
            }
        })
        .catch(error => {
            console.error("Error en las solicitudes AJAX:", error);
        });
  
    //Mostrar la parte del calendario por default
    showSection('calendar');
    //Modificar la seccion de actividades por dia de manera dinamica
    // Seleccionar el elemento <select> 
    const $selectElement = $('#day-select-Iti');
    
     
    // Verificar si diasItinerario tiene valores
    if (diasItinerario) {
        const dias = diasItinerario.split(',');
        // Iterar sobre los días y agregar opciones dinámicamente
        dias.forEach((fecha, index) => {
            $selectElement.append(
                `<option value="${fecha}">Día ${index + 1} (${fecha.trim()})</option>`
            );
        });
    } else {
        console.error("La variable diasItinerario está vacía o no definida");
    }

    //Detectar el cambio del select dat-select-Iti
    $("#day-select-Iti").on('change',function(){
        //Mostrar el dia con las actividades
        showDay(itinerario);
    })

    //Modificar botones de seleccionar dia del mapa de manera dinamica
    //Seleccionar el elemento <select>
    const $selectDiaMap = $('#day-select-Map');
    // Verificar si diasItinerario tiene valores
    if (diasItinerario) {
      const dias = diasItinerario.split(',');
      // Iterar sobre los días y agregar opciones dinámicamente
      dias.forEach((fecha, index) => {
          $selectDiaMap.append(
              `<option value="${fecha}">Día ${index + 1} (${fecha.trim()})</option>`
          );
      });
    } else {
        console.error("La variable diasItinerario está vacía o no definida");
    }
    //Detectar el cambio del select day-select-Map
    $('#day-select-Map').on('change',function(){
      //Mostrar el mapa con las rutas 
      showMap(itinerario,transporte);
    })

  }

  /*********************************FUNCIONES ALDEBARAN****************************** */
  // Función para generar el itinerario dinámico
  function generarItinerario(datosComida, datosLugar) {
    let iti = {};
    for (const dia in datosComida) {
        if (datosComida.hasOwnProperty(dia)) {
            // Crear un array vacío para los lugares del día
            iti[dia] = [];

            // Obtener los lugares de comida y los puntos de interés para el día
            const lugaresComida = datosComida[dia] || [];
            const lugaresInteres = datosLugar[dia] || [];

            // Intercalar los lugares de comida y los puntos de interés
            let i = 0, j = 0;
            while (i < lugaresComida.length || j < lugaresInteres.length) {
                if (i < lugaresComida.length) {
                    iti[dia].push({
                        tipo: "Comida",
                        nombre: lugaresComida[i].Nombre,
                        id: lugaresComida[i].idLugar,
                        Latitud : lugaresComida[i].Latitud,
                        Longitud: lugaresComida[i].Longitud
                    });
                    i++;
                }
                if (j < lugaresInteres.length) {
                    iti[dia].push({
                        tipo: "Lugar de interés",
                        nombre: lugaresInteres[j].Nombre,
                        id: lugaresInteres[j].idLugar,
                        Latitud : lugaresInteres[j].Latitud,
                        Longitud: lugaresInteres[j].Longitud
                    });
                    j++;
                }
            }
        }
    }
    return iti;
  }


  /**********************************FUNCIONES ALDEBARAN****************************** */

});

document.querySelector('#print-pdf').addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const marginLeft = 10;
  const marginTop = 10;

  const daySelect = document.getElementById('day-select-Iti');
  const container = document.getElementById('Cont-Itinerario');
  const days = Array.from(daySelect.options).slice(1); // Excluye "Seleccionar día"

  let position = marginTop;

  for (const day of days) {
      daySelect.value = day.value;
      await showDay(itinerario); // Actualiza el contenido del contenedor

      try {
          // Captura el contenedor con html2canvas
          const canvas = await html2canvas(container, {
              scale: 3, // Aumenta la calidad
              useCORS: true, // Habilita CORS para recursos externos
              allowTaint: true, // Permite capturar recursos cruzados
              logging: true,
          });

          // Convertir el canvas a datos de imagen
          const imgData = canvas.toDataURL('image/png');

          // Calcula el tamaño en el PDF
          const imgWidth = 190; // Ancho del PDF (ajustado para márgenes)
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (position + imgHeight > 297) {
              pdf.addPage(); // Nueva página si no cabe
              position = marginTop;
          }

          // Agregar el título del día
          pdf.text(`Día: ${day.text}`, marginLeft, position);
          position += 10;

          // Agregar la imagen con los estilos
          pdf.addImage(imgData, 'PNG', marginLeft, position, imgWidth, imgHeight);
          position += imgHeight + 10;

      } catch (error) {
          console.error(`Error al capturar el día ${day.text}:`, error);
          pdf.text(`Error al capturar el contenido del día: ${day.text}`, marginLeft, position);
          position += 20;
      }
  }

  pdf.save('itinerario-completo.pdf');
});
