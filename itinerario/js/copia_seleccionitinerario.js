// Referencia de botones de pestañas

const tabButtons = document.querySelectorAll(".tab-button");
const tabContent = document.querySelector("#tab-content");

//const tabButtons = document.querySelectorAll(".tab-button");
//const tabContent = document.querySelector("#tab-content");
/*document.addEventListener("DOMContentLoaded", () => {
    // Variables para las pestañas
    const hospedajeButton = document.querySelector('.btn-primary');
    const comidaButton = document.querySelector('.btn-secondary:nth-child(2)');
    const actividad1Button = document.querySelector('.btn-secondary:nth-child(4)');
    const actividad2Button = document.querySelector('.btn-secondary:nth-child(5)');
    const lugaresButton = document.querySelector('.btn-secondary.lugares');
    const cardContainer = document.querySelector('.card-container');
>>>>>>> Stashed changes
*/
document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".tab-button");
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            buttons.forEach(btn => {
                btn.classList.remove("btn-primary");
                btn.classList.add("btn-secondary");
            });
            this.classList.add("btn-primary");
            this.classList.remove("btn-secondary");
        });
    });
});


document.querySelectorAll('.tab-button').forEach((button) => {
    button.addEventListener('click', () => {
      // Restablecer colores de todos los botones
      document.querySelectorAll('.tab-button').forEach((btn) => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
      });

      // Cambiar el color del botón seleccionado
      button.classList.remove('btn-secondary');
      button.classList.add('btn-primary');
  
      // Opcional: Actualizar el contenido del contenedor de tarjetas según la selección
      const selectedCategory = button.dataset.tab;
      const tabContent = document.getElementById('tab-content');
  
      tabContent.innerHTML = `<p>Has seleccionado: ${selectedCategory}</p>`;
    });
  });

  document.querySelectorAll('.btn-primary, .btn-secondary').forEach((button) => {
    button.addEventListener('click', () => {
      const tabContent = document.getElementById('tab-content');

      // Vermos si ya hay tarjetas visibles
      const cardsVisible = tabContent.children.length > 0;

      // Si hay tarjetas visibles y ocultarlas
      if (cardsVisible) {
        tabContent.innerHTML = ''; 
      } else {
        tabContent.innerHTML = ``;
      }
    });
  });
  
  document.querySelector('.slide-left').addEventListener('click', function () {
    const botonesWrapper = document.querySelector('.botones .d-flex');
    const currentTransform = getComputedStyle(botonesWrapper).transform;
  
    const matrix = currentTransform !== 'none' ? new DOMMatrix(currentTransform) : new DOMMatrix();
    const shiftAmount = 120; // Cuánto quieres que se deslice cada vez
  
    // Verificar si estamos al inicio
    if (matrix.m41 < 0) {
      botonesWrapper.style.transform = `translateX(${matrix.m41 + shiftAmount}px)`; 
    }
  });
  
  document.querySelector('.slide-right').addEventListener('click', function () {
    const botonesWrapper = document.querySelector('.botones .d-flex');
    const currentTransform = getComputedStyle(botonesWrapper).transform;
  
    const matrix = currentTransform !== 'none' ? new DOMMatrix(currentTransform) : new DOMMatrix();
    const shiftAmount = -120; 
    const maxTranslateX = botonesWrapper.scrollWidth - botonesWrapper.clientWidth;
  
    // Verificar si ya no estamos al final
    if (Math.abs(matrix.m41) < maxTranslateX) {
      botonesWrapper.style.transform = `translateX(${matrix.m41 + shiftAmount}px)`;
    }
  });

  const progressBar = document.querySelector('.custom-progress-bar');
  const updateBudgetProgress = () => {
    const selectedCards = document.querySelectorAll('.card-checkbox:checked').length;
    const totalCards = document.querySelectorAll('.card-checkbox').length;
    const percentage = Math.round((selectedCards / totalCards) * 100);
    progressBar.style.width = `${percentage}%`;
    progressBar.textContent = `${percentage}%`;
  };

  document.querySelectorAll('.card-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', updateBudgetProgress);
  });

  // Función para generar itinerario
  /*document.querySelector('.btn-info').addEventListener('click', () => {
    const selectedCards = document.querySelectorAll('.card-checkbox:checked');
    if (selectedCards.length === 0) {
      showErrorModal('Por favor, selecciona al menos una propuesta para generar un itinerario.');
      return;
    }

    let itinerarySummary = 'Resumen del Itinerario:\n';
    selectedCards.forEach((checkbox) => {
      const card = checkbox.closest('.card');
      const title = card.querySelector('.card-title').textContent.trim();
      itinerarySummary += `- ${title}\n`;
    });

    showErrorModal(itinerarySummary);
  });*/

/**
 * Generar estrellas de calificación.
 * @param {number} calificacion - Calificación del 0 al 5.
 * @returns {string} - HTML de las estrellas.
 */
function generarEstrellas(calificacion) {
    const estrellasLlenas = Math.floor(calificacion);
    const mediaEstrella = calificacion % 1 >= 0.5 ? 1 : 0;
    const estrellasVacias = 5 - estrellasLlenas - mediaEstrella;

    return (
        '<i class="bi bi-star-fill star-icon"></i>'.repeat(estrellasLlenas) +
        '<i class="bi bi-star-half star-icon"></i>'.repeat(mediaEstrella) +
        '<i class="bi bi-star star-icon"></i>'.repeat(estrellasVacias)
    );
}
// Función para mostrar el modal con un mensaje personalizado de error
function showErrorModal(message) {
    $("#errorModalBody").text(message); // Inserta el mensaje de error en el cuerpo del modal
    $("#exampleModal").modal("show"); // Muestra el modal de error
}
// Función para mostrar el modal con un mensaje personalizado de éxito
function showEdicionModal(message) {
    $("#modalEdicionMessage").text(message); // Inserta el mensaje en el párrafo específico
    $("#EdicionModal").modal("show"); // Muestra el modal de éxito
}

// Función para mostrar el modal con un mensaje personalizado de éxito
function showSuccesModal(message) {
    $("#modalMessage").text(message); // Inserta el mensaje en el párrafo específico
    $("#succesModal").modal("show"); // Muestra el modal de éxito
}
function showConfirmacionModal(message){
    $("#confirmacionMessage").text(message); // Inserta el mensaje en el párrafo específico
    $("#ConfirmacionModal").modal("show"); // Muestra el modal de éxito
}

// Función para mostrar el modal con un mensaje personalizado de éxito
/*function showTazimModal() { // Inserta el mensaje en el párrafo específico
    $("#TazimModal").modal("show"); // Muestra el modal de éxito
}
function unshowTazimModal() { // Inserta el mensaje en el párrafo específico
    $("#TazimModal").modal("hide"); // Muestra el modal de éxito
}
*/


$(document).ready(() => {
    let fechaInicio;
    let fechaFin;
    let diasItinerario = [];
    let diaActual = 0; // Índice del día actual
    let totalDias = 0;
    const idFormStorage = localStorage.getItem('idFormularioActual');
    const idUsuarioStorage = localStorage.getItem('idUser');
    //Verificar que el usuario selecciono la opcion de No Sorprendeme
    var ConoceLugares = localStorage.getItem("Ubicacion_Conocida");
    // Objeto para almacenar los lugares seleccionados
    const lugaresSeleccionados = {};
    //Objeto que va a guardar los valores de las fechas y destinos
    let itinerario = {};
    let itinerarioDias = {};
    let itinerarioComida = {};
    let categoriasUsuario ={};
    // Consulta las preferencias de categorías guardadas en el formulario
    let datos = {};
    let subCategoriasIds = [];
    let categoriasNombres = [];
    let subcategoriasPorCategoria = {}; // Objeto que asociará subcategorías a sus categorías
    // Crear un array plano que combine todos los lugares de las subcategorías
    let lugaresArray = [];
    let arrayLocaciones = [];
    // Variable global para almacenar categorías y sus lugares
    let categoriasLugares = {};
    //Variable global para almacenar categorias,lugares y dias
    let categoriasLugaresDistribuidos
    var indice ;
    var SelectionCategory = 'Lugares'

    // Elementos del DOM
    const btnAtras = $("#btnAtras");
    const btnAdelante = $("#btnAdelante");
    const FechaItinerario = $("#FechaItinerario");
    const DestinoItinerario = $("#DestinoItinerario");

    if (!idFormStorage) {
        console.error("No hay un ID de formulario guardado en LocalStorage");
        return;
    }else if(!idUsuarioStorage){
        console.error("No hay un ID de usuario guardado en LocalStorage");
        return;
    }

    // Solicitar las fechas al servidor
    $.ajax({
        url: "../php/ConsultarFormulario.php",
        type: "POST",
        data: {
            Consulta: 'Fechas',
            idFormulario: idFormStorage
        },
        dataType: "json",
        success: function (response) {
            console.log("Respuesta del servidor:", response);

            if (response.error) {
                console.error("Error en la respuesta:", response.error);
                return;
            }

            // Procesar fechas si están presentes
            if (response.Fechas) {
                if (response.Fechas.error) {
                    console.warn("Error en Fechas:", response.Fechas.error);
                } else {
                    fechaInicio = convertirFormatoFecha(response.Fechas.FechaInicio);
                    fechaFin = convertirFormatoFecha(response.Fechas.FechaFin);
                    // Calcular el total de días del itinerario
                    totalDias = calcularTotalDias(fechaInicio, fechaFin);
                    console.log("Total de días del itinerario:", totalDias);

                    
                    // Generar los días del itinerario
                    diasItinerario = generarDiasItinerario(fechaInicio, fechaFin);
                    console.log("Días del itinerario:", diasItinerario);
                    if(ConoceLugares=='Si'){
                        // Inicializar la vista
                        actualizarVista();
                    }
                    else{
                        actualizarVista();
                    }
                    
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("Error en la solicitud AJAX:", error);
        }
    });

    
    //AQUI VAMOS A SEPARAR SI EL USUARIO INGRESA DESTINOS O NO
    if(ConoceLugares == 'Si'){
            /*Inicia logica de comia*/
            $("#BtnSeccComida").on('click',function(){
                //Ocultamos la seccion de categorias de usuario
                $("#TituloCategorias").hide();
                $("#instrucciones").hide();
                $("#CategoriasUsuario").hide();
                $("#InstCheckbox").show();
               const fechaSeleccionada = $("#FechaItinerario").text();
               //console.log(fechaSeleccionada);
               //console.log(itinerario[fechaSeleccionada]);
               //Guardar en la variable global la categoria
               SelectionCategory = $(this).text();

               console.log(fechaSeleccionada);
               
               Comida(fechaSeleccionada);
               function Comida (fechaSeleccionada){
                   
                   console.log(itinerarioDias[fechaSeleccionada]);

                   //if(itinerarioDias[fechaSeleccionada]){
                        /*
                        // Obtener los nombres de todos los lugares en el itinerario
                           const nombresLugares = itinerarioDias[fechaSeleccionada]
                           .map(lugar => lugar.nombre) // Extraer los nombres
                           .filter(nombre => !!nombre) // Filtrar valores nulos o indefinidos
                           .join(", "); // Unir los nombres con comas
   
                       // Mostrar los lugares de comida cerca del punto de interés
                       if (nombresLugares) {
                           $("#Lugar").text(`Lugares de comida cerca del punto de interés: ${nombresLugares}`);
                       } else {
                           $("#Lugar").text("Lugares de comida cerca del punto de interés no especificados.");
                       }

                       $("#LugaresSelecc").show();
                       */
                       $.ajax({
                           url: "../php/si_comida.php", 
                           type: "POST",
                           data: {
                               idUsuario: idUsuarioStorage,
                               idFormulario: idFormStorage,
                               Consulta:"Comida"
                           },
                           dataType: "json",
                           success: function (responseComida) {
                               if (responseComida.status === "success") {
                                    console.log(idFormStorage);
                                    console.log(idUsuarioStorage);
                                    console.log("Datos obtenidos:", responseComida);
                                   
                                    const prioridadComida = responseComida.prioridadComida;
                                   const distanciaComida = responseComida.distanciaComida;
                                   const tiposEstablecimientos = responseComida.establecimientos;
                                   // Definir variables necesarias
                                    const destinos = responseComida.destinos
                       
                                   const resultadosComida = {}; // Objeto para almacenar los resultados organizados por tipo
                                   const establecimientosUnicos = []; // Array para almacenar establecimientos únicos en categoría 'food'
                                   let establecimientosConPrecio = {};
                                  
                                   si_buscarRestaurantesCerca(destinos, tiposEstablecimientos, resultadosComida).then(() => {
                                    console.log("Resultados organizados:", resultadosComida);
                                    });
                                    
                                    /*
                                   itinerarioDias[fechaSeleccionada].forEach(dia => {
                                       const tabContent = document.getElementById('tab-content');
                                   
                                       // Reinicia los datos para cada día en el itinerario
                                       const resultadosComida = {}; // Reiniciar resultados por tipo
                                       const establecimientosUnicos = []; // Reiniciar establecimientos únicos por día
                                       let establecimientosConPrecio = [];
                                   
                                       // Limpiar el contenedor de las tarjetas antes de agregar nuevas
                                       tabContent.innerHTML = ''; 
                                    
                                       si_buscarRestaurantesCerca(tiposEstablecimientos, distanciaComida, idLugarDestino, resultadosComida)
                                           .then(() => {
                                               const establecimientosUnicos = []; // Reiniciar establecimientos únicos por día
                                               let establecimientosConPrecio = [];
                                               // Filtrar los resultados para obtener solo establecimientos únicos en categoría 'food'
                                               const idsUnicos = new Set(); // Usamos un Set para rastrear IDs únicos
                                   
                                               for (const categoria in resultadosComida) {
                                                   if (categoria === 'food') { // Solo en la categoría 'food'
                                                       resultadosComida[categoria].forEach(establecimiento => {
                                                           if (!idsUnicos.has(establecimiento.idEstablecimiento)) {
                                                               idsUnicos.add(establecimiento.idEstablecimiento);
                                                               establecimientosUnicos.push(establecimiento);
                                                           }
                                                       });
                                                   }
                                               }
                                   
                                               // Filtrar los establecimientos con un valor válido en precio
                                               establecimientosConPrecio = establecimientosUnicos.filter(establecimiento => {
                                                   return (
                                                       establecimiento.precio !== undefined &&
                                                       establecimiento.precio !== null &&
                                                       establecimiento.precio !== "No disponible"
                                                   );
                                               });
                                   
                                               // Mostrar solo los primeros 10 resultados
                                               const primerosDiez = establecimientosConPrecio.slice(0, 10);
                                               console.log("establecimientos con precio:", establecimientosConPrecio);
                                               // Crear y mostrar tarjetas para los primeros 10 resultados
                                               primerosDiez.forEach(establecimiento => {
                                                   const detallesCom = {
                                                       nombre: establecimiento.nombre,
                                                       direccion: establecimiento.direccion,
                                                       valoracion: establecimiento.valoracion,
                                                       idEstablecimiento: establecimiento.idEstablecimiento,
                                                       descripcion: establecimiento.descripcion || "", // Valor por defecto si no hay descripción
                                                       categorias: establecimiento.categorias,
                                                       precio: establecimiento.precio,
                                                       Latitud: establecimiento.Latitud,
                                                       Longitud: establecimiento.Longitud,
                                                   };
                                   
                                                   // Crear la tarjeta y agregarla al contenedor
                                                   const card = crearCardComida(detallesCom);
                                                   tabContent.appendChild(card); // Añadir la tarjeta al contenedor
                                               });
                                           });
                                   });*/
        
        
                                   
                               } else {
                                   console.error("Error al obtener comida :", responseComida.message);
                                   showErrorModal("Error al obtener las preferencias de comida.");
                               }
                           },
                           error: function (xhr, status, error) {
                               console.error("Error al obtener comida:", error);
                               showErrorModal("Error del servidor al obtener las preferencias de comida.");
                           },
                       });
                       // Eliminar manejadores previos de los botones para evitar duplicados
                       btnAtras.off("click");
                       btnAdelante.off("click");
   
                       // Manejar clic en "Atrás"
                       btnAtras.on("click", () => {
                           if (diaActual > 0) {
                               diaActual--;
                               if(ConoceLugares=='Si'){
                                   // Inicializar la vista
                                   actualizarVista();
                               }
                               else{
                                   actualizarVistaSinDestino();
                                   Comida($("#FechaItinerario").text());
                                   
   
                               }
                               
                           }
                       });
   
                       // Manejar clic en "Adelante"
                       btnAdelante.on("click", () => {
                           if (diaActual < diasItinerario.length - 1) {
                               diaActual++;
                               if(ConoceLugares=='Si'){
                                   // Inicializar la vista
                                   actualizarVista();
                               }
                               else{
                                   actualizarVistaSinDestino();
                                   Comida($("#FechaItinerario").text());
                                   
                               }
                           }
                       });
                       
                   //}else{
                   //    showErrorModal("Debes de seleccionar los lugares de interes para buscar establecimientos de comida.");
                   //}
               } 
           });
            /*Fin de logica de comida*/
    }else{
        //LOGICA ALDEBARAN
        actualizarVistaSinDestino();
        //Aqui vamos a poner la logica para la cards de lugares, comida
        //=================ACTIVIDADES A REALIZAR=============================//       
        datos = {
            idUsuario: idUsuarioStorage,
            idFormulario: idFormStorage,
            Consulta: 'Subcategorias',
        };
        $("#TituloCategorias").show();
        $("#CategoriasUsuario").show();
        $("#instrucciones").show();
        $("#InstCheckbox").show();
        // Realizar la solicitud AJAX
        obtenerSubcategorias(datos);
        LlamarCategorias();
        
        // Manejar el evento de clic con jQuery
        $("#GuardarLugaresDia").on("click", function () {
            const fechaSeleccionada = $("#FechaItinerario").text(); // Obtener el texto de la fecha actual mostrad
            //Verificar en que seccion estoy
            console.log("Estoy en la categoria: "+SelectionCategory);
            // Validar que se seleccionó una fecha
            if (!fechaSeleccionada) {
                showErrorModal("Por favor selecciona una fecha.");
                return;
            }

            // Validar que hay lugares seleccionados para la fecha
            if (!itinerarioDias[fechaSeleccionada] || itinerarioDias[fechaSeleccionada].length === 0 ) {
                showErrorModal("No se han seleccionado lugares para esta fecha.");
                return;
            }

            // Guardar el itinerario en el servidor o realizar otra acción
            console.log(`Itinerario guardado para ${fechaSeleccionada}:`, itinerarioDias[fechaSeleccionada]);

            $.ajax({
                url: "../php/GuardarItinerario.php", 
                type: "POST",
                data: { 
                    idUsuario: idUsuarioStorage,
                    idFormulario: idFormStorage,
                    fecha: fechaSeleccionada, 
                    lugares: JSON.stringify(itinerarioDias[fechaSeleccionada]),
                    comida : JSON.stringify(itinerarioComida[fechaSeleccionada]),
                    Categoria:SelectionCategory
                },
                dataType: "json", // Respuesta esperada en formato JSON
                success: function (response) {
                    if (response.status === "success") {
                        showSuccesModal("Lugares guardados correctamente.");
                        console.log(response);
                    } else {
                        showErrorModal("Error: " + response.message)
                        console.error(response);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error al guardar el itinerario:", xhr.responseText || error);
                    showErrorModal("Error inesperado. Intenta de nuevo.");
                }
            });
            
        });

        //Logica para la seleccion de COMIDA
        $("#BtnSeccComida").on('click',function(){
             //Ocultamos la seccion de categorias de usuario
             $("#TituloCategorias").hide();
             $("#instrucciones").hide();
             $("#CategoriasUsuario").hide();
             $("#InstCheckbox").show();
            const fechaSeleccionada = $("#FechaItinerario").text();
            //console.log(fechaSeleccionada);
            //console.log(itinerario[fechaSeleccionada]);
            //Guardar en la variable global la categoria
            SelectionCategory = $(this).text();
            Comida(fechaSeleccionada);
            function Comida (fechaSeleccionada){
                //const fechaSeleccionada = $("#FechaItinerario").text();
                console.log(itinerarioDias[fechaSeleccionada]);
                if(itinerarioDias[fechaSeleccionada]){
                     // Obtener los nombres de todos los lugares en el itinerario
                        const nombresLugares = itinerarioDias[fechaSeleccionada]
                        .map(lugar => lugar.nombre) // Extraer los nombres
                        .filter(nombre => !!nombre) // Filtrar valores nulos o indefinidos
                        .join(", "); // Unir los nombres con comas

                    // Mostrar los lugares de comida cerca del punto de interés
                    if (nombresLugares) {
                        $("#Lugar").text(`Lugares de comida cerca del punto de interés: ${nombresLugares}`);
                    } else {
                        $("#Lugar").text("Lugares de comida cerca del punto de interés no especificados.");
                    }
                    $("#LugaresSelecc").show();
                    $.ajax({
                        url: "../php/ConsultarFormularioSorprendeme.php", 
                        type: "POST",
                        data: {
                            idUsuario: idUsuarioStorage,
                            idFormulario: idFormStorage,
                            Consulta: 'Comida',
                            subcategorias: '', // IDs de subcategorías
                        },
                        dataType: "json",
                        success: function (responseComida) {
                            if (responseComida.status === "success") {
                                const prioridadComida = responseComida.prioridadComida;
                                const distanciaComida = responseComida.distanciaComida;
                                const tiposEstablecimientos = responseComida.establecimientos;
                    
                                const resultadosComida = {}; // Objeto para almacenar los resultados organizados por tipo
                                const establecimientosUnicos = []; // Array para almacenar establecimientos únicos en categoría 'food'
                                let establecimientosConPrecio = {};
    
                                itinerarioDias[fechaSeleccionada].forEach(dia => {
                                    const tabContent = document.getElementById('tab-content');
                                
                                    // Reinicia los datos para cada día en el itinerario
                                    const resultadosComida = {}; // Reiniciar resultados por tipo
                                    const establecimientosUnicos = []; // Reiniciar establecimientos únicos por día
                                    let establecimientosConPrecio = [];
                                
                                    // Limpiar el contenedor de las tarjetas antes de agregar nuevas
                                    tabContent.innerHTML = ''; 
                                
                                    buscarRestaurantesCerca(tiposEstablecimientos, distanciaComida, dia.id, resultadosComida)
                                        .then(() => {
                                            const establecimientosUnicos = []; // Reiniciar establecimientos únicos por día
                                            let establecimientosConPrecio = [];
                                            // Filtrar los resultados para obtener solo establecimientos únicos en categoría 'food'
                                            const idsUnicos = new Set(); // Usamos un Set para rastrear IDs únicos
                                
                                            for (const categoria in resultadosComida) {
                                                if (categoria === 'food') { // Solo en la categoría 'food'
                                                    resultadosComida[categoria].forEach(establecimiento => {
                                                        if (!idsUnicos.has(establecimiento.idEstablecimiento)) {
                                                            idsUnicos.add(establecimiento.idEstablecimiento);
                                                            establecimientosUnicos.push(establecimiento);
                                                        }
                                                    });
                                                }
                                            }
                                
                                            // Filtrar los establecimientos con un valor válido en precio
                                            establecimientosConPrecio = establecimientosUnicos.filter(establecimiento => {
                                                return (
                                                    establecimiento.precio !== undefined &&
                                                    establecimiento.precio !== null &&
                                                    establecimiento.precio !== "No disponible"
                                                );
                                            });
                                
                                            // Mostrar solo los primeros 10 resultados
                                            const primerosDiez = establecimientosConPrecio.slice(0, 10);
                                
                                            // Crear y mostrar tarjetas para los primeros 10 resultados
                                            primerosDiez.forEach(establecimiento => {
                                                const detallesCom = {
                                                    nombre: establecimiento.nombre,
                                                    direccion: establecimiento.direccion,
                                                    valoracion: establecimiento.valoracion,
                                                    idEstablecimiento: establecimiento.idEstablecimiento,
                                                    descripcion: establecimiento.descripcion || "", // Valor por defecto si no hay descripción
                                                    categorias: establecimiento.categorias,
                                                    precio: establecimiento.precio,
                                                    Latitud: establecimiento.Latitud,
                                                    Longitud: establecimiento.Longitud,
                                                };
                                
                                                // Crear la tarjeta y agregarla al contenedor
                                                const card = crearCardComida(detallesCom);
                                                tabContent.appendChild(card); // Añadir la tarjeta al contenedor
                                            });
                                        });
                                });
                                
    
                                
                            } else {
                                console.error("Error al obtener comida :", responseComida.message);
                                showErrorModal("Error al obtener las preferencias de comida.");
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error("Error al obtener comida:", error);
                            showErrorModal("Error del servidor al obtener las preferencias de comida.");
                        },
                    });
                    // Eliminar manejadores previos de los botones para evitar duplicados
                    btnAtras.off("click");
                    btnAdelante.off("click");

                    // Manejar clic en "Atrás"
                    btnAtras.on("click", () => {
                        if (diaActual > 0) {
                            diaActual--;
                            if(ConoceLugares=='Si'){
                                // Inicializar la vista
                                actualizarVista();
                            }
                            else{
                                actualizarVistaSinDestino();
                                Comida($("#FechaItinerario").text());
                                

                            }
                            
                        }
                    });

                    // Manejar clic en "Adelante"
                    btnAdelante.on("click", () => {
                        if (diaActual < diasItinerario.length - 1) {
                            diaActual++;
                            if(ConoceLugares=='Si'){
                                // Inicializar la vista
                                actualizarVista();
                            }
                            else{
                                actualizarVistaSinDestino();
                                Comida($("#FechaItinerario").text());
                                
                            }
                        }
                    });
                    
                }else{
                    showErrorModal("Debes de seleccionar los lugares de interes para buscar establecimientos de comida.");
                }
            }
            
            
        });
        //Logica para la seleccion de LUGARES (VOLVER A MOSTRAR CATEGORIAS)
        $("#BtnSeccLugares").on('click',function(){
            const fechaSeleccionada = $("#FechaItinerario").text();
            console.log(itinerarioDias[fechaSeleccionada]);
            SelectionCategory = $(this).text();
            datos = {
                idUsuario: idUsuarioStorage,
                idFormulario: idFormStorage,
                Consulta: 'Subcategorias',
            };
            obtenerSubcategorias(datos);
            LlamarCategorias();
            //Ocultamos la seccion de categorias de usuario
            $("#TituloCategorias").show();
            $("#instrucciones").show();
            $("#CategoriasUsuario").show();
            $("#InstCheckbox").show();
            $("#LugaresSelecc").hide();
            
            
        });

        //Logica para la seleccion de TRANSPORTE
        $("#BtnSeccTransporte").on('click',function(){
            SelectionCategory = $(this).text();
            //Ocultamos la seccion de categorias de usuario
            $("#TituloCategorias").hide();
            $("#instrucciones").hide();
            $("#CategoriasUsuario").hide();
            $("#InstCheckbox").hide();
            $("#LugaresSelecc").hide();
        });

    }
    
    /**
     * Función para convertir formato de fecha de "aaaa/mm/dd" a "dd/mm/aaaa"
     * @param {string} fechaOriginal - Fecha en formato "aaaa/mm/dd"
     * @returns {string} Fecha en formato "dd/mm/aaaa"
     */
    function convertirFormatoFecha(fechaOriginal) {
        if (!fechaOriginal || typeof fechaOriginal !== "string") {
            console.error("Fecha inválida:", fechaOriginal);
            return fechaOriginal;
        }
        const partes = fechaOriginal.split("-");
        if (partes.length === 3) {
            return `${partes[2]}-${partes[1]}-${partes[0]}`; // Formato "dd-mm-aaaa"
        }
        console.error("Formato inesperado de fecha:", fechaOriginal);
        return fechaOriginal;
    }   
    
    // Función para calcular el total de días entre fechaInicio y fechaFin
    function calcularTotalDias(fechaInicio, fechaFin) {
        // Convertir las fechas a objetos Date
        const inicio = new Date(fechaInicio.split("-").reverse().join("-"));
        const fin = new Date(fechaFin.split("-").reverse().join("-"));

        // Calcular la diferencia en milisegundos
        const diferenciaMs = fin - inicio;

        // Convertir la diferencia en milisegundos a días
        const dias = diferenciaMs / (1000 * 60 * 60 * 24) + 1; // Sumar 1 para incluir el día de inicio

        return dias;
    }


    /**
     * Genera un arreglo de días entre dos fechas
    */
    function generarDiasItinerario(inicio, fin) {
        const dias = [];
        let fechaActual = new Date(inicio.split("-").reverse().join("-") + "T12:00:00Z"); // Añadir hora explícita
        const fechaFin = new Date(fin.split("-").reverse().join("-") + "T12:00:00Z");
        while (fechaActual <= fechaFin) {
            dias.push(
                `${fechaActual.getDate().toString().padStart(2, "0")}-${(fechaActual.getMonth() + 1).toString().padStart(2, "0")}-${fechaActual.getFullYear()}`
            );
            fechaActual.setUTCDate(fechaActual.getUTCDate() + 1); // Evitar problemas de zona horaria
        }
        return dias;
    }
    

    /**
     * Actualiza la vista con el día actual
     */
    function actualizarVista() {
        if (diasItinerario.length === 0) return;

        const fecha = diasItinerario[diaActual];
        FechaItinerario.text(fecha);
        DestinoItinerario.text(`Destino: Lugar ${diaActual + 1}`); // Puedes ajustar esto según tus datos reales

        actualizarBotones();
    }

    /**
     * Actualiza la vista con el día actual sin destinos
     */
    function actualizarVistaSinDestino() {
        if (diasItinerario.length === 0) return;
        const fecha = diasItinerario[diaActual];
        FechaItinerario.text(fecha);
        actualizarBotones();
    }

    /**
     * Habilita o deshabilita los botones según el día actual
     */
    function actualizarBotones() {
        btnAtras.prop("disabled", diaActual === 0);
        btnAdelante.prop("disabled", diaActual === diasItinerario.length - 1);
    }

    // Manejar clic en "Atrás"
    btnAtras.on("click", () => {
        if (diaActual > 0) {
            diaActual--;
            if(ConoceLugares=='Si'){
                // Inicializar la vista
                actualizarVista();
            }
            else{
                actualizarVistaSinDestino();
            }
            
        }
    });

    // Manejar clic en "Adelante"
    btnAdelante.on("click", () => {
        if (diaActual < diasItinerario.length - 1) {
            diaActual++;
           
            if(ConoceLugares=='Si'){
                // Inicializar la vista
                actualizarVista();
            }
            else{
                actualizarVistaSinDestino();
            }
        }
    });

    function mostrarDiasCompletados() {
        const contenedorDias = $(".botones"); 
        contenedorDias.empty(); // lmpiar contenido previo
    
        diasItinerario.forEach((dia, index) => {
            const botonDia = $(`
                <button class="btn btn-warning mx-1" data-index="${index}">
                    ${dia.split("-")[0]} <!-- Solo muestra el día numérico -->
                </button>
            `);
    
            botonDia.on("click", () => {
                diaActual = index; 
                actualizarVista(); 
            });
    
            // Agregar clase si es el dia actual
            if (index === diaActual) {
                botonDia.addClass("btn-seleccionado");
            }
    
            contenedorDias.append(botonDia);
        });
    }
    
    function actualizarVista() {
        if (diasItinerario.length === 0) return;
    
        const fecha = diasItinerario[diaActual];
        FechaItinerario.text(fecha);
        //DestinoItinerario.text(`Destino: Lugar ${diaActual + 1}`); 
        
        // Actualizar botones
        actualizarBotones();
        mostrarDiasCompletados();
    }

    //Seccion de transporte
    // Función para obtener el icono según el tipo de transporte
    function obtenerIconoTransporte(tipo) {
        switch (tipo.toLowerCase()) {
            case 'publico':
                return '<i class="bi bi-bus-front" title="Transporte Público"></i>';
            case 'privado':
                return '<i class="bi bi-car-front" title="Transporte Privado"></i>';
            case 'caminando':
                return '<i class="bi bi-person-walking" title="Caminando"></i>';
            default:
                return '<i class="bi bi-question-circle" title="Desconocido"></i>';
        }
    }
     // Función para agregar la card de transporte al HTML
    function agregarTransporteCard(tipo, prioridad) {
        const iconoTransporte = obtenerIconoTransporte(tipo);
        const transporteCardHTML = `
            <h3 class="col-12">Transporte</h3>
            <div class="transporte-card row">
                  <div class="col-lg-3" id="img-tipo-transporte">
                    ${iconoTransporte}
                  </div>
                  <div class="col-lg-9 transporte-card-content p-4 text-center">
                    <div class="row">
                      <div class="col-12 transporte-item">
                          <h5>Tipo: ${tipo}</h5>
                          <button class="btn editar-btn w-50" data-tipo="transporte">
                              <i class="bi bi-pencil"></i>
                              <span>Editar</span>
                          </button>
                      </div>
                      <div class="col-12 transporte-item">
                          <h5>Prioridad: ${prioridad}</h5>
                          <button class="btn editar-btn w-50" data-tipo="prioridad">
                              <i class="bi bi-pencil"></i>
                              <span>Editar</span>
                          </button>
                      </div>
                    </div>
                  </div>
              </div>
        `;
        $("#tab-content").empty();  // Limpiar contenido previo
        $("#tab-content").append(transporteCardHTML); // Agregar contenido al contenedor #tab-content
    }
    const BtnSeccTransporte = $("#BtnSeccTransporte");
    BtnSeccTransporte.on("click",()=>{
        const idFormStorage = localStorage.getItem('idFormularioActual');
        if (!idFormStorage) {
            console.error("No hay un ID de formulario guardado en LocalStorage");
            return;
        }

        // Evitar duplicar tarjetas si ya se cargaron
        if ($(".transporte-card").length > 0) {
            console.log("Las tarjetas de transporte ya están cargadas.");
            return;
        }
        // Solicitar las opciones de transporte al servidor
        $.ajax({
            url: "../php/ConsultarFormulario.php",
            type: "POST",
            data: {
                Consulta: 'Transporte',
                idFormulario: idFormStorage
            },
            dataType: "json",
            success: function (response) {
                console.log("Respuesta del servidor:", response);

                if (response.error) {
                    console.error("Error en la respuesta:", response.error);
                    return;
                }

                // Procesar fechas si están presentes
                if (response.Transporte) {
                    if (response.Transporte.error) {
                        console.warn("Error en Fechas:", response.Fechas.error);
                    } else {
                        //Si no hay errores, agregar los datos de transporte a la pantalla
                        // Obtener los datos de transporte
                        const tipoTransporte = response.Transporte.Tipo;
                        const prioridadTransporte = response.Transporte.Prioridad;

                        // Agregar los datos de transporte al HTML
                        agregarTransporteCard(tipoTransporte, prioridadTransporte);
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error("Error en la solicitud AJAX:", error);
            }
        });
        //Aqui vamos a mostrar lo que ingreso el usuario y si quiere cambiarlo
        $("#SeccionTransporte").toggleClass("activo"); // Mostrar/ocultar la sección

    })
    // Evento para manejar clics en los botones de editar
    $(document).on("click", ".editar-btn", function () {
        const tipoEdicion = $(this).data("tipo");
        const modal = $("#EdicionModal");
        console.log("Boton de editar presionado");
        if (tipoEdicion === "transporte") {
            modal.find(".modal-title").text("Editar Tipo de Transporte");
            modal.find(".modal-body").html(`
                <div class="form-group">
                    <p class="text-center">¿Qué tipo de transporte utilizarás?</p>
                    <div id="tipoTransporteRadio">
                        <div class="row mt-3">
                            <input type="radio" id="publico" name="tipoTransporte" value="publico" class="col-1 radio-input">
                            <label for="publico" class="col-11">Transporte Público</label>
                        </div>

                        <div class="row mt-3">
                            <input type="radio" id="privado" name="tipoTransporte" value="privado" class="col-1 radio-input">
                            <label for="privado" class="col-11">Transporte Privado</label>
                        </div>
                        <div class="row mt-3">
                            <input type="radio" id="caminando" name="tipoTransporte" value="caminando" class="col-1 radio-input">
                            <label for="caminando" class="col-11">Caminando</label>
                        </div>
                    </div>
                </div>
            `);
        } else if (tipoEdicion === "prioridad") {
            modal.find(".modal-title").text("Editar Prioridad del Transporte");
            modal.find(".modal-body").html(`
                <div class="form-group">
                    <p for="prioridad-transporte" class="text-center">¿Cuánta prioridad le das al transporte?</p>
                    <div class="row">  
                        <input type="range" id="prioridad-transporte" name="prioridadTransporte" min="1" max="10" value="5" class="col-11 color-range">
                        <span id="valor-prioridad" class="valor col-1">5</span>
                    </div>
                </div>
            `);
        }

        modal.modal("show"); //Mostrar el Modal
        // Guardar el tipo de edición en un atributo para usarlo al guardar
        modal.data("tipo-edicion", tipoEdicion);
    
    });

    // Actualizar valor del rango en tiempo real
    $(document).on("input", "#prioridad-transporte", function () {
        $("#valor-prioridad").text($(this).val());
    });
    // Guardar cambios al presionar "Guardar"
    $(document).on("click", "#GuardarEdicion", function () {
        const modal = $("#EdicionModal");
        const tipoEdicion = modal.data("tipo-edicion");
        const idFormStorage = localStorage.getItem('idFormularioActual');
        console.log(tipoEdicion);

        if (!idFormStorage) {
            console.error("No hay un ID de formulario guardado en LocalStorage");
            return;
        }

        let datos = {};
        //Preguntar que datos se van a guardar, por que lo podemos utilizar para los demas campos
        if (tipoEdicion === "transporte") {
            const transporteSeleccionado = $("input[name='tipoTransporte']:checked").val();
            if (!transporteSeleccionado) {
                showErrorModal("Por favor selecciona un tipo de transporte.");
                return;
            }
            datos = {
                Consulta: 'ActualizarTransporte',
                idFormulario: idFormStorage,
                tipoTransporte: transporteSeleccionado
            };
        } else if (tipoEdicion === "prioridad") {
            const prioridadSeleccionada = $("#prioridad-transporte").val();
            datos = {
                Consulta: 'ActualizarPrioridadTransporte',
                idFormulario: idFormStorage,
                prioridadTransporte: prioridadSeleccionada
            };
        }

        // Realizar la solicitud AJAX
        $.ajax({
            url: "../php/EditarFormulario.php", // Asegúrate de que este archivo maneje la actualización
            type: "POST",
            data: datos,
            dataType: "json",
            success: function (response) {
                console.log("Respuesta del servidor:", response);

                if (response.success) {
             
                    //Ocultar el modal de transporte
                    modal.modal("hide");
                    //Mostrar modal de exito
                    showSuccesModal(response.success);
                    // Actualizar los valores en la tarjeta
                    if (tipoEdicion === "transporte") {
                        $(".transporte-card h5:contains('Tipo:')").text(`Tipo: ${datos.tipoTransporte}`);
                    } else if (tipoEdicion === "prioridad") {
                        $(".transporte-card h5:contains('Prioridad:')").text(`Prioridad: ${datos.prioridadTransporte}`);
                    }
                } else {
                    showErrorModal("Hubo un error al guardar los cambios. Intenta nuevamente.");
                }
            },
            error: function (xhr, status, error) {
                console.error( error);
                showErrorModal("Error del servidor, por favor, vuelve a intentar");
            }
        });
    });
   
    //tazim: FUNCION PARA BUSCAR ESTABLECIMIENTOS CUANDO SI SABE SU(S) DESTINO(S)
    async function si_buscarRestaurantesCerca(destinos, tiposEstablecimientos, resultadosComida) {
        // Iterar sobre cada destino recibido
        for (const destino of destinos) {
            const idLugarDestino = destino.idLugarDestino;
            const distanciaEnMetros = destino.distanciaComida * 1000; // Convertir distancia a metros
            const tiposQuery = tiposEstablecimientos.join('|'); // Combinar tipos en un string
            const urlProxy = `../php/ProxyComida.php?place_id=${idLugarDestino}&radius=${distanciaEnMetros}&type=restaurant&keyword=${tiposQuery}`;
    
            try {
                // Solicitar datos del proxy para este destino
                const response = await fetch(urlProxy);
                const data = await response.json();
                console.log(`Resultados para destino ${idLugarDestino} (fecha: ${destino.fecha}):`, data);
    
                if (data.status === "success") {
                    /*const lugares = data.lugares;*/
                    const lugares = data.lugares.slice(0, 10); 
    
                    // Procesar cada lugar obtenido
                    lugares.forEach(lugar => {
                        const descripcionLugar = obtenerDescripcionLugar(lugar.nombre);
    
                        const detallesComida = {
                            nombre: lugar.nombre,
                            direccion: lugar.direccion,
                            valoracion: lugar.rating,
                            idEstablecimiento: lugar.id,
                            descripcion: descripcionLugar,
                            categorias: lugar.categorias,
                            precio: lugar.nivel_precio,
                            Latitud: lugar.coordenadas.lat,
                            Longitud: lugar.coordenadas.lng,
                            fecha: destino.fecha // Añadir la fecha del destino
                        };
    
                        // Organizar los resultados por tipo de establecimiento
                        lugar.categorias.forEach(categoria => {
                            if (!resultadosComida[categoria]) {
                                resultadosComida[categoria] = [];
                            }
                            resultadosComida[categoria].push(detallesComida);
                        });
                    });
                } else {
                    console.error(
                        `Error en la búsqueda de restaurantes para destino ${idLugarDestino}:`,
                        data.message
                    );
                    showErrorModal(
                        `No se encontraron restaurantes para el destino con fecha ${destino.fecha}.`
                    );
                }
            } catch (error) {
                console.error(
                    `Error al buscar restaurantes para destino ${idLugarDestino}:`,
                    error
                );
                showErrorModal(`Error al conectar con el proxy para el destino con fecha ${destino.fecha}.`);
            }
        }
    }
    
    //FUNCIONES PARA BUSCAR ESTABLECIMIENTOS DE COMIDA CUANDO NO TENGA UN DESTINO
    // Función para buscar restaurantes cerca de un lugar

    async function buscarRestaurantesCerca(tiposEstablecimientos, distancia, id, resultadosComida) {
        const tiposQuery = tiposEstablecimientos.join('|'); // Combinar tipos
        const distanciaEnMetros = distancia * 1000; // Convertir a metros
        
        const urlProxy = `../php/ProxyComida.php?place_id=${id}&radius=${distanciaEnMetros}&type=restaurant&keyword=${tiposQuery}`;
        
        try {
            const response = await fetch(urlProxy);
            const data = await response.json();
            console.log(data);
            if (data.status === "success") {
                const lugares = data.lugares;
                
                lugares.forEach(lugar => {
                    const descripcionLugar = obtenerDescripcionLugar(lugar.nombre);
    
                    const detallesComida = {
                        nombre: lugar.nombre,
                        direccion: lugar.direccion,
                        valoracion: lugar.rating,
                        //fotoReferencia: lugar.fotos?.[0],
                        idEstablecimiento: lugar.id,
                        descripcion: descripcionLugar,
                        categorias: lugar.categorias,
                        precio: lugar.nivel_precio,
                        Latitud: lugar.coordenadas.lat,
                        Longitud: lugar.coordenadas.lng
                    };
    
                    // Agregar al objeto de resultados organizados por tipo
                    lugar.categorias.forEach(categoria => {
                        if (!resultadosComida[categoria]) {
                            resultadosComida[categoria] = [];
                        }
                        resultadosComida[categoria].push(detallesComida);
                    });
    
                    
                });
            } else {
                console.error("Error en la búsqueda de restaurantes:", data.message);
                showErrorModal("No se encontraron restaurantes con las preferencias seleccionadas.");
            }
        } catch (error) {
            console.error("Error al buscar restaurantes:", error);
            showErrorModal("Error al conectar con el proxy.");
        }
    }
    

        
    
    // Función para crear la tarjeta de comida similar a la tarjeta de lugar
    function crearCardComida(detallesComida) {
        const { nombre, direccion, valoracion, idEstablecimiento,descripcion, categorias,precio,Latitud, Longitud } = detallesComida;

        // Verificar si `fotoReferencia` está presente antes de construir la URL
        //const fotoUrl = fotoReferencia ? obtenerUrlFoto(fotoReferencia) : 'https://via.placeholder.com/400x300?text=No+Imagen'; // URL de imagen predeterminada
        const rangoPrecios = {
            0: "Gratis o menos de $1 USD",
            1: "$1 - $10 USD",
            2: "$11 - $30 USD",
            3: "$31 - $60 USD",
            4: "$61 USD o más"
        };
        // Verificar si el precio es válido y asignar un texto apropiado
        const textoPrecio = precio !== undefined && rangoPrecios.hasOwnProperty(precio)
        ? rangoPrecios[precio]
        : "No disponible";
        // Crear el contenedor de la tarjeta
        const card = document.createElement('div');
        card.classList.add('comida-card', 'card');

        // Crear un ID único para cada tarjeta
        const cardId = `card-${nombre.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
       
        card.innerHTML = `
            <div class="card-body">
                <!-- Checkbox para agregar al itinerario -->
                <div class="card-footer">
                    <label for="${cardId}" class="checkbox-label">
                        <input type="checkbox" id="${cardId}" class="checkbox-itinerario">
                        Seleccionar
                    </label>
                </div>
                

                <div class="card-info">
                    <p class="card-title">${nombre}</p>
                    <p class="card-title">Costo aproximado: ${textoPrecio}</p>
                    <div class="star-rating">
                        ${[1, 2, 3, 4, 5].map(index => `
                            <span class="star${index <= (valoracion || 0) ? ' selected' : ''}">★</span>
                        `).join('')}
                    </div>
                </div>
                <!-- Botón para mostrar más información -->
                <div class="card-actions">
                    <button class="btn-mas-info" data-id="${idEstablecimiento}" style="margin-top: 10px;">Ver más</button>
                </div>
            </div>
        `;

        // Agregar el evento para el checkbox
        const checkbox = card.querySelector(`#${cardId}`);
        checkbox.addEventListener('change', (event) => {
            const fechaSeleccionada = $("#FechaItinerario").text();
            if (!fechaSeleccionada) {
                showErrorModal("Por favor selecciona una fecha antes de agregar lugares al itinerario.");
                event.target.checked = false; // Revertir el checkbox si no hay fecha seleccionada
                return;
            }
            if (event.target.checked) {
                // Agregar el restaurante al itinerario para la fecha seleccionada
                if (!itinerarioComida[fechaSeleccionada]) {
                    itinerarioComida[fechaSeleccionada] = [];
                }
                // Agregar el restaurante al objeto de lugares seleccionados
                itinerarioComida[fechaSeleccionada].push({
                    id: idEstablecimiento,
                    nombre,
                    direccion,
                    valoracion,
                    latitud: Latitud,
                    longitud: Longitud,
                });
                console.log(`Restaurante agregado para ${fechaSeleccionada}:`, itinerarioComida[fechaSeleccionada]);
            } else {
                // Eliminar el restaurante del itinerario para la fecha seleccionada
                itinerarioComida[fechaSeleccionada] = itinerarioComida[fechaSeleccionada].filter(
                    (comida) => comida.id !== idEstablecimiento
                );
                if (itinerarioComida[fechaSeleccionada].length === 0) {
                    delete itinerarioComida[fechaSeleccionada]; // Eliminar la fecha si no tiene lugares
                }
                console.log(`Restaurante eliminado para ${fechaSeleccionada}:`, itinerarioComida[fechaSeleccionada]);
            }
        });
        // Agregar evento para el botón "Mostrar más información"
        const btnMasInfo = card.querySelector('.btn-mas-info');
        btnMasInfo.addEventListener('click', () => {
            console.log(`Se presionó "Mostrar más información" para el lugar con ID: ${cardId}`);
            // Aquí puedes mostrar un modal, un alert o información adicional sobre el lugar
            mostrarInformacionLugar({
                nombre,
                direccion,
                valoracion,
                descripcion,
                categorias,
                //fotoUrl,
                latitud: Latitud,
                longitud: Longitud
            });
        });


        return card; // Retorna la tarjeta creada
    }

    const tabContent = document.getElementById("tab-content");
    
    function generateCards(items) {
        tabContent.innerHTML = ""; // Limpia las tarjetas actuales
        items.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${item.fotosLugar[0]}" alt="${item.title}">
                <div class="card-info">
                    <p class="card-title">${item.displayName.text}</p>
                    <p class="card-location">${item.formattedAddress}</p>
                    <div class="star-rating">
                        ${[1, 2, 3, 4, 5].map(() => '<span class="star">★</span>').join("")}
                    </div>
                </div>
            `;

            // Evento de selección de tarjeta
            card.addEventListener("click", () => {
                document.querySelectorAll(".card").forEach(c => c.classList.remove("selected"));
                card.classList.add("selected");
            });

            // Evento para las estrellas
            const stars = card.querySelectorAll(".star");
            stars.forEach((star, index) => {
                star.addEventListener("click", (event) => {
                    event.stopPropagation(); // Evita seleccionar la tarjeta al hacer clic en una estrella
                    stars.forEach((s, i) => s.classList.toggle("selected", i <= index));
                });
            });

            tabContent.appendChild(card);
        });
    }

    
    //Funcionalidad cuando el usuario seleccione la opcion de 'No, sorprendeme'
    
    console.log("EL USUARIO :"+ConoceLugares);
    // Configura tu clave de API de Google Places
    const API_KEY_ALDE = 'AIzaSyBlBfvcJxLHgYnFMJBbgLmdzIS_mI2QZZQ';
    const CDMX_COORDS = { lat: 19.432608, lng: -99.133209 }; // Coordenadas aproximadas del centro de la CDMX
    const RADIO_BUSQUEDA = 20000; // Radio en metros (20 km)
    //API para buscar lugares cercanos a un punto de origen:
    // Nearby Search para lugares cercanos por categoría
    async function buscarLugaresPorCategoria(categorias) {
        const lugaresPorCategoria = {};
        const map = new google.maps.Map(document.createElement('div')); // Necesario para inicializar PlacesService
        const service = new google.maps.places.PlacesService(map); // Inicializamos el servicio

        for (const categoria of categorias) {
            const request = {
                location: CDMX_COORDS, // Coordenadas del centro de búsqueda
                radius: RADIO_BUSQUEDA, // Radio en metros
                type: categoria, // Categoría en formato de Google Places (como "restaurant", "park")
            };

            try {
                const lugares = await new Promise((resolve, reject) => {
                    service.nearbySearch(request, (results, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            resolve(results);
                        } else {
                            console.error(`Error en la búsqueda para categoría ${categoria}:`, status);
                            resolve([]);
                        }
                    });
                });

                // Mapeamos los resultados a un formato más simple
                lugaresPorCategoria[categoria] = lugares.map((place) => ({
                    id: place.place_id,
                    nombre: place.name,
                    latitud: place.geometry.location.lat(),
                    longitud: place.geometry.location.lng(),
                }));
            } catch (error) {
                console.error(`Error en la búsqueda para categoría ${categoria}:`, error);
                lugaresPorCategoria[categoria] = [];
            }
        }

        return lugaresPorCategoria;
    }
    
    async function mostrarLugares(lugares) {
        const tabContent = document.getElementById('tab-content');
        tabContent.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas tarjetas
    
        // Iterar sobre los lugares y obtener detalles de cada uno
        for (const lugar of lugares) {
            try {
                
                // Obtener detalles del lugar desde la API usando el `id` como `place_id`
                const detallesLugar = await obtenerDetallesLugar(lugar.id);
                // Obtén la descripción desde la API de Wikipedia
                const descripcionLugar = await obtenerDescripcionLugar(lugar.nombre);
                // Crear una tarjeta para el lugar con los detalles obtenidos
                const card = crearTarjetaLugar({
                    nombre: lugar.nombre,
                    direccion: detallesLugar.direccion,
                    valoracion: detallesLugar.valoracion,
                    descripcion: descripcionLugar,
                    categorias : detallesLugar.categorias,
                    photoReference : detallesLugar.photoReference,
                    idLugar : lugar.id,
                    precio : detallesLugar.precio,
                    Latitud : lugar.latitud,
                    Longitud : lugar.longitud
                });
    
                // Agregar la tarjeta al contenedor
                tabContent.appendChild(card);
            } catch (error) {
                console.error(`Error al procesar el lugar: ${lugar.nombre}`, error);
            }
        }
        
    }
    
   // Función para crear la tarjeta con la URL de la foto
    function crearTarjetaLugar(detallesLugar) {
        const { nombre, direccion, valoracion, descripcion, categorias,idLugar,precio,Latitud,Longitud } = detallesLugar;

        // Crear el contenedor de la tarjeta
        const card = document.createElement('div');
        card.classList.add('lugar-card', 'card');
        
        // Crear un ID único para cada tarjeta
        const cardId = `card-${nombre.replace(/\s+/g, '-')}`;  // Usamos el nombre para crear un ID único
        
        card.innerHTML = `
            <div class="card-body">
                <!-- Checkbox para agregar al itinerario -->
                <div class="card-footer">
                    <label for="${cardId}" class="checkbox-label">
                        <input type="checkbox" id="${cardId}" class="checkbox-itinerario">
                        Seleccionar
                    </label>
                </div>


                

                <div class="card-info">
                    <p class="card-title">${nombre}</p>
                   
                    
                    <div class="star-rating">
                        ${[1, 2, 3, 4, 5].map(index => `
                            <span class="star${index <= (valoracion || 0) ? ' selected' : ''}">★</span>
                        `).join('')}
                    </div>
        
                    
                </div>
                <!-- Botón para mostrar más información -->
                <div class="card-actions">
                    <button class="btn-mas-info" data-id="${idLugar}" style="margin-top: 10px;">Ver más</button>
                </div>
                
            </div>
        `;

        // Agregar el evento para el checkbox
        const checkbox = card.querySelector(`#${cardId}`);
        checkbox.addEventListener('change', (event) => {
            const fechaSeleccionada = $("#FechaItinerario").text();
            if (!fechaSeleccionada) {
                alert("Por favor selecciona una fecha antes de agregar lugares al itinerario.");
                event.target.checked = false; // Revertir el checkbox si no hay fecha seleccionada
                return;
            }
            if (event.target.checked) {
                // Agregar el lugar al itinerario para la fecha seleccionada
                if (!itinerarioDias[fechaSeleccionada]) {
                    itinerarioDias[fechaSeleccionada] = [];
                }
                // Agregar el lugar al objeto de lugares seleccionados
                itinerarioDias[fechaSeleccionada].push({
                    id: idLugar,
                    nombre,
                    direccion,
                    valoracion,
                    categorias,
                    latitud: Latitud,
                    longitud: Longitud,
                });
                console.log(`Lugar agregado para ${fechaSeleccionada}:`, itinerarioDias[fechaSeleccionada]);
            } else {
                // Eliminar el lugar del itinerario para la fecha seleccionada
                itinerarioDias[fechaSeleccionada] = itinerarioDias[fechaSeleccionada].filter(
                    (lugar) => lugar.id !== idLugar
                );
                if (itinerarioDias[fechaSeleccionada].length === 0) {
                    delete itinerarioDias[fechaSeleccionada]; // Eliminar la fecha si no tiene lugares
                }
                console.log(`Lugar eliminado para ${fechaSeleccionada}:`, itinerarioDias[fechaSeleccionada]);
            }
        });
        // Agregar evento para el botón "Mostrar más información"
        const btnMasInfo = card.querySelector('.btn-mas-info');
        btnMasInfo.addEventListener('click', () => {
            console.log(`Se presionó "Mostrar más información" para el lugar con ID: ${idLugar}`);
            // Aquí puedes mostrar un modal, un alert o información adicional sobre el lugar
            mostrarInformacionLugar({
                id: idLugar,
                nombre,
                direccion,
                valoracion,
                descripcion,
                categorias,
                latitud: Latitud,
                longitud: Longitud,
                precio
            });
        });


        return card; // Retorna la tarjeta creada
    }
  
    // Función para obtener detalles del lugar desde la API de Google Places
    function obtenerDetallesLugar(placeId) {
        const fields = "formatted_address,name,rating,types,price_level,geometry";
        
        const url = `../php/Proxy.php?place_id=${placeId}&fields=${fields}&language=es`;

        // Retorna la promesa para que pueda manejarse con .then() en el llamado
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.result) {
                    const tipos = data.result.types || [];
                    if (tipos.includes("lodging")) { // 'lodging' es el tipo asociado con hoteles en la API de Google Places
                        console.warn("Este lugar es un hotel, se excluirá:", data.result.name);
                        return null; // Excluye este lugar
                    }
                    return {
                        nombre: data.result.name || "No disponible",
                        direccion: data.result.formatted_address || "No disponible",
                        valoracion: data.result.rating || "No disponible",
                        categorias: tipos,
                        precio: data.result.price_level || "No disponible",
                        idLugar: placeId,
                        Latitud: data.result.geometry.location.lat || "No disponible",
                        Longitud: data.result.geometry.location.lng || "No disponible"
                    };
                } else {
                    console.error("No se encontraron resultados para este lugar.");
                    return null;
                }
            })
            
    }
    
    async function obtenerDescripcionLugar(lugar) {
        try {
            const response = await fetch(`../php/WikipediaApi.php?lugar=${encodeURIComponent(lugar)}`);
            const data = await response.json();
            return data.descripcion || "No se encontró una descripción para este lugar.";
        } catch (error) {
            console.error(`Error al obtener descripción para el lugar: ${lugar}`, error);
            return "Error al obtener la descripción.";
        }
    }
    
    function obtenerUrlFoto(photoReference) {
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${API_KEY_ALDE}`;
        return url;
    }
    function dividirLugaresEnDias(lugares, totalDias) {
        const lugaresPorDia = [];
        const lugaresPorDiaCompleto = Math.floor(lugares.length / totalDias);
        const lugaresRestantes = lugares.length % totalDias;
    
        let indice = 0;
    
        for (let i = 0; i < totalDias; i++) {
            let lugaresDelDia = [];
            // Asignar lugares completos
            for (let j = 0; j < lugaresPorDiaCompleto; j++) {
                lugaresDelDia.push(lugares[indice]);
                indice++;
            }
            // Asignar un lugar adicional si hay sobrantes
            if (lugaresRestantes > 0) {
                lugaresDelDia.push(lugares[indice]);
                indice++;
            }
            lugaresPorDia.push(lugaresDelDia);
        }
    
        return lugaresPorDia;
    }
    
    // Función para manejar la acción de "Mostrar más información"
    async function mostrarInformacionLugar(detalles) {
        const { id, nombre, direccion, valoracion, descripcion, categorias, fotoUrl ,precio} = detalles;
        // Obtener la descripción del lugar de manera asíncrona
        const desc = await obtenerDescripcionLugar(nombre);
        // Mapeo de los valores de precio a rangos
        const rangoPrecios = {
            0: "Gratis o menos de $1 USD",
            1: "$1 - $10 USD",
            2: "$11 - $30 USD",
            3: "$31 - $60 USD",
            4: "$61 USD o más"
        };
        // Llenar los campos del modal con la información del lugar
        $('#InfoModalLabel').text(nombre); // Título del modal
        $('#Ubicacion').text(`Ubicación: ${direccion || 'No disponible'}`); // Ubicación
        $('#Descripcion').text(`Descripción: ${desc || 'Sin descripción'}`); // Descripción
         $('#Categorias').text(`Categorías: ${categorias ? categorias.join(', ') : 'Sin categorías'}`); // Categorías
        // Mostrar el rango de precios
        const textoPrecio = precio !== undefined && rangoPrecios[precio] ? rangoPrecios[precio] : 'No disponible';
        $('#Precio').text(`Precio estimado: ${textoPrecio}`); // Precio
        //cuando presione el boton de ver detalles dirigirlo a la pantalla de detalles
        $('#buttonModal').on('click', function() {
            // Crear una sesión donde se almacene el ID del lugar
            localStorage.setItem('detalleLugar', JSON.stringify(id));
          
            // Dirigir a la pantalla de detalles
            window.location.href = "../html/infoLugar.html";
        });          
        // Mostrar el modal
        $('#InfoModal').modal('show');
    }

    async function obtenerSubcategorias(datos) {
        $.ajax({
            url: "../php/ConsultarFormularioSorprendeme.php", // Archivo PHP que maneja la consulta
            type: "POST",
            data: datos, // Datos necesarios para la consulta
            dataType: "json", // Respuesta esperada en formato JSON
            success: function (response) {
                console.log("Respuesta del servidor:", response);
    
                if (response.status === "success") {
                    // Extraemos las subcategorías de la respuesta
                    const subcategorias = response.subcategorias;
                    console.log("Subcategorías obtenidas:", subcategorias);
    
                    // Extraemos los IDs de las subcategorías
                    subCategoriasIds = subcategorias.map(subcategoria => subcategoria.idValor);
                    console.log("Subcategorías a enviar:", subCategoriasIds);
    
                    // Realizar otra solicitud AJAX para obtener las categorías correspondientes
                    $.ajax({
                        url: "../php/ConsultarFormularioSorprendeme.php", // Nuevo archivo PHP para consultar categorías
                        type: "POST",
                        data: {
                            idUsuario: idUsuarioStorage,
                            idFormulario: idFormStorage,
                            Consulta: 'Categorias',
                            subcategorias: subCategoriasIds, // Enviar los IDs de subcategorías
                        },
                        dataType: "json", // Respuesta esperada en formato JSON
                        success: function (responseSubcategorias) {
                            console.log("Respuesta de categorías por subcategorías:", responseSubcategorias);
    
                            if (responseSubcategorias.status === "success") {
                                // Asociar subcategorías con categorías
                                responseSubcategorias.categorias.forEach((categoriaNombre, index) => {
                                    subcategoriasPorCategoria[subCategoriasIds[index]] = categoriaNombre;
                                    categoriasNombres.push(categoriaNombre);
                                });
    
                                console.log("Categorías asociadas a las subcategorías:", subcategoriasPorCategoria);
    
                                // Crear conjunto único de categorías
                                const categoriasUnicas = new Set();
                                responseSubcategorias.categorias.forEach(item => {
                                    categoriasUnicas.add(item.Nombre);
                                });
    
                                // Generar y asociar categorías
                                [...categoriasUnicas].forEach((categoria, index) => {
                                    categoriasUsuario[`categoria_${index + 1}`] = categoria;
                                });
                                const nombresCategorias = Object.values(categoriasUsuario);
                                nombresCategorias.forEach(categoria => {
                                    obtenerCategorias(categoria);  // Imprimir cada nombre de categoría
                                });
    
                                // Limpiar el contenedor antes de agregar botones
                                $('#CategoriasUsuario').empty();
    
                                // Generar botones dinámicamente
                                categoriasUnicas.forEach(categoria => {
                                    const button = $('<button>', {
                                        class: 'category-pill',
                                        'data-category': categoria.toLowerCase().replace(/\s+/g, '-'),
                                        text: categoria,
                                    });
                                    $('#CategoriasUsuario').append(button);
                                });
                            } else {
                                console.error("Error al obtener categorías por subcategoría:", responseSubcategorias.message);
                                showErrorModal("Error al obtener las categorías correspondientes.");
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error("Error al obtener categoría por subcategoría:", error);
                            showErrorModal("Error al obtener las categorías correspondientes.");
                        },
                    });
                } else {
                    console.error(response.message || "Error desconocido en la consulta");
                    showErrorModal("Hubo un error en la consulta de datos. Intenta nuevamente.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error en la solicitud AJAX:", error);
                showErrorModal("Error del servidor, por favor, vuelve a intentar.");
            },
        });
    }
    
    async function obtenerCategorias(categoriaSeleccionada) {
        // Buscar subcategorías asociadas
        const subcategoriasIds = [];
        
        for (const clave in subcategoriasPorCategoria) {
            if (subcategoriasPorCategoria[clave].Nombre === categoriaSeleccionada) {
                subcategoriasIds.push(clave);
            }
        }
    
        if (subcategoriasIds.length > 0) {
            console.log(`Subcategorías de ${categoriaSeleccionada}:`, subcategoriasIds);
            
            try {
                // Buscar lugares por categoría
                const lugaresPorCategoria = await buscarLugaresPorCategoria(subcategoriasIds);
                console.log(`Lugares encontrados para la categoría ${categoriaSeleccionada}:`, lugaresPorCategoria);
                
                let lugaresArray = [];
                for (const subcategoriaId of subcategoriasIds) {
                    if (lugaresPorCategoria[subcategoriaId]) {
                        lugaresArray = lugaresArray.concat(lugaresPorCategoria[subcategoriaId]);
                    }
                }
    
                // Asociar los lugares encontrados a la categoría
                if (lugaresArray.length > 0) {
                    categoriasLugares[categoriaSeleccionada] = lugaresArray; // Guardar en la variable global
                    console.log(`Lugares asociados a la categoría ${categoriaSeleccionada}:`, categoriasLugares[categoriaSeleccionada]);
                } else {
                    console.error(`No se encontraron lugares para la categoría: ${categoriaSeleccionada}`);
                    showErrorModal(`No se encontraron lugares para la categoría: ${categoriaSeleccionada}`);
                }
            } catch (error) {
                console.error(`Error al buscar lugares para la categoría ${categoriaSeleccionada}:`, error);
                showErrorModal("Hubo un problema al obtener los lugares. Por favor, inténtalo más tarde.");
            }
        } else {
            console.error(`No se encontraron subcategorías para la categoría: ${categoriaSeleccionada}`);
            showErrorModal(`No se encontraron subcategorías para la categoría: ${categoriaSeleccionada}`);
        }
    }
    // Función para distribuir los lugares de una categoría entre las fechas
    function distribuirLugaresPorFechas(categoriasLugares, fechasItinerario) {
        const resultado = {};

        for (const categoria in categoriasLugares) {
            const lugares = categoriasLugares[categoria];
            const lugaresPorFecha = Math.ceil(lugares.length / fechasItinerario.length); // Dividir de manera uniforme

            resultado[categoria] = {}; // Crear un subobjeto para cada categoría
            let indexLugar = 0;

            fechasItinerario.forEach(fecha => {
                resultado[categoria][fecha] = lugares.slice(indexLugar, indexLugar + lugaresPorFecha);
                indexLugar += lugaresPorFecha;
            });
        }

        return resultado;
    }

    //Funcion para manejar la logica de mostar lugares de interes:
    function Lugares(categoriaSeleccionada){
        // Ejecutar la distribución de los lugares
        categoriasLugaresDistribuidos = distribuirLugaresPorFechas(categoriasLugares, diasItinerario);
    
        // Verificar si existen datos distribuidos para esta categoría
        if (categoriasLugaresDistribuidos[categoriaSeleccionada]) {
            // Obtener la fecha seleccionada
            let fechaSeleccionada = $("#FechaItinerario").text();
            console.log(`Fecha seleccionada: ${fechaSeleccionada}`);
    
            // Acceder a los lugares de la fecha seleccionada
            const lugaresDelDia = categoriasLugaresDistribuidos[categoriaSeleccionada][fechaSeleccionada];
    
            if (lugaresDelDia && Array.isArray(lugaresDelDia)) {
                //console.log(`Lugares para la categoría "${categoriaSeleccionada}" el día ${fechaSeleccionada}:`);
                lugaresDelDia.forEach(lugar => {
                    //console.log(`- ${lugar.nombre} (Lat: ${lugar.latitud}, Lng: ${lugar.longitud})`);
                    // Usar .then() para manejar la promesa
                    const tabContent = document.getElementById('tab-content');
                            // Limpiar el contenedor de las tarjetas antes de agregar nuevas
                            tabContent.innerHTML = ''; // Esto elimina todas las tarjetas previas
                            obtenerDetallesLugar(lugar.id).then(detallesLugar => {
                                if (detallesLugar) {
                                    //console.log(detallesLugar);
                                    // Crear la tarjeta con los detalles obtenidos
                                    const card = crearTarjetaLugar(detallesLugar);
                                    // Obtener el contenedor de tarjetas y agregar la tarjeta recién creada
                                    
                                    tabContent.appendChild(card); // Añadir la tarjeta al contenedor
                                } else {
                                    console.error(`No se pudieron obtener los detalles para el lugar con ID: ${lugar.id}`);
                                }
                            }).catch(error => {
                                console.error("Error al obtener los detalles del lugar:", error);
                            });
                    

                });
            } else {
                console.log(`No se encontraron lugares para la categoría "${categoriaSeleccionada}" el día ${fechaSeleccionada}.`);
            }
        } else {
            console.log(`No se encontraron datos para la categoría: ${categoriaSeleccionada}.`);
        }
    }

    function LlamarCategorias(){
        // Delegación de eventos para evitar múltiples asignaciones
        $('#CategoriasUsuario').on('click', '.category-pill', async function () {
                // Reiniciar al día 1 del itinerario
                diaActual = 0; 
                const fechaSeleccionada = diasItinerario[diaActual]; // Obtener el primer día del itinerario
                $("#FechaItinerario").text(fechaSeleccionada); // Actualizar el texto con el día seleccionado
                actualizarVistaSinDestino();
                // Obtener el nombre de la categoría seleccionada
                const categoriaSeleccionada = $(this).text();
                console.log(`Categoría seleccionada: ${categoriaSeleccionada}`);
                Lugares(categoriaSeleccionada);
                // Eliminar manejadores previos de los botones para evitar duplicados
                btnAtras.off("click");
                btnAdelante.off("click");

                // Manejar clic en "Atrás"
                btnAtras.on("click", () => {
                    if (diaActual > 0) {
                        diaActual--;
                        if(ConoceLugares=='Si'){
                            // Inicializar la vista
                            actualizarVista();
                        }
                        else{
                            actualizarVistaSinDestino();
                            Lugares(categoriaSeleccionada);
                            

                        }
                        
                    }
                });

                // Manejar clic en "Adelante"
                btnAdelante.on("click", () => {
                    if (diaActual < diasItinerario.length - 1) {
                        diaActual++;
                        if(ConoceLugares=='Si'){
                            // Inicializar la vista
                            actualizarVista();
                        }
                        else{
                            actualizarVistaSinDestino();
                            Lugares(categoriaSeleccionada);
                            
                        }
                    }
                });
            
        });
    } 
    
    //Funcionalidad de generar itinerario
    $('#GenerarItinerario').on('click', function () {

        if(ConoceLugares == 'Si'){
            //LOGICA DE OMAR Y TAZIM

        }else{
            //LOGICA ALDEBARAN
            // Verificar que las variables no sean nulas o vacías
            if (!itinerarioDias || Object.keys(itinerarioDias).length === 0) {
                showErrorModal("Por favor, selecciona al menos un lugar para cada dia del itinerario.");
                return; // Detener la ejecución si no hay lugares
            }
        
            if (!itinerarioComida || Object.keys(itinerarioComida).length === 0) {
                showErrorModal("Por favor, selecciona al menos una opción de comida para cada dia del itinerario.");
                return; // Detener la ejecución si no hay opciones de comida
            }
            //VERIFICAR QUE TODOS LOS DIAS TENGAN UN LUGAR
            let diasInvalidos = [];

            diasItinerario.forEach(dia => {
                // Verificar si hay al menos un lugar en itinerarioDias
                if (!itinerarioDias[dia] || itinerarioDias[dia].length === 0) {
                    diasInvalidos.push(`${dia} - lugares`);
                }
        
                // Verificar si hay al menos una opción de comida en itinerarioComida
                if (!itinerarioComida[dia] || itinerarioComida[dia].length === 0) {
                    diasInvalidos.push(`${dia} - comida`);
                }
            });
        
            if (diasInvalidos.length > 0) {
                // Mostrar mensaje indicando los días y datos faltantes
                showErrorModal(`Faltan datos en los siguientes días:\n${diasInvalidos.join('\n')}`);
                return; // Detener la ejecución si hay días incompletos
            }
            //PREGUNTAR SI ESTA SEGURO DE SUS ELECCIONES
            showConfirmacionModal("¿Estas seguro sobre tus preferencias escogidas?");
            $("#AceptarConf").on('click',()=>{
                localStorage.setItem('Fechas',diasItinerario);
                //Vamos a mostrar el itinerario
                window.location.href= '../html/itinerario.html';
            })
        }
        

    });

});
