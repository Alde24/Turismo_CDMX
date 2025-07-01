
/*
document.addEventListener("DOMContentLoaded", function() {
    const addButton = document.querySelector(".btn-add");
    const container = document.getElementById("destinos-container");
    let destinoCount = 1;
    addButton.addEventListener("click", function() {
        if (destinoCount < 5) {
            const newInput = document.createElement("input");
            newInput.type = "text";
            newInput.name = `destino${destinoCount + 1}`;
            newInput.id = `destino${destinoCount + 1}`;
            newInput.placeholder = "Punto de llegada adicional";
            container.appendChild(newInput);
            //Input oculto enviado a la BD
            const newInputHidden = document.createElement("input");
            newInputHidden.type = "hidden";
            newInputHidden.name = "idDestino[]";
            newInputHidden.id = `idDestino${destinoCount + 1}`;
            newInputHidden.value = "";
            //Asignar autocomplete al nuevo input creado
            asignarAutocomplete(`destino${destinoCount + 1}`, `idDestino${destinoCount + 1}`);
            destinoCount++;
            
        } else {
            showErrorModal("Número máximo de destinos adicionales alcanzado.");
        }
    });
});*/

$(document).ready(()=>{
    localStorage.removeItem('idFormularioActual');
    consultarIdFormulario().then((idFormularioS) => { // Agregar datos adicionales
        console.log('EL ID PARA ESTE FORMULARIO ES:'+idFormularioS);
        
    }).catch((error) => {
        console.error("Error:", error);
    });
    //añadir un nuevo input destino
    const addButton = document.querySelector(".btn-add");
    const container = document.getElementById("destinos-container");
    let destinoCount = 0;
    


    let coordDestino;
    let coordOrigen;
    // Inicializar autocompletado de lugar de origen y destino
    function initAutocomplete() {
        // Definir los límites de la CDMX
        const cdmxBounds = {
            north: 19.592757, // Límite norte de CDMX
            south: 19.090223, // Límite sur de CDMX
            east: -98.938204, // Límite este de CDMX
            west: -99.364204, // Límite oeste de CDMX
        };
    
        // Configurar opciones de Autocomplete
        const opciones = {
            bounds: cdmxBounds, // Limitar sugerencias a la CDMX
            strictBounds: true, // Solo mostrar resultados dentro de los límites especificados
            componentRestrictions: { country: "mx" }, // Opcional: restringir a México
            fields: ["place_id", "geometry", "name"],
        };
    
        const $origen = $('#origen'); // Referencia al input de origen
        const $destino = $('#destino'); // Referencia al input de destino
    
        if ($origen.length === 0) {
            console.error("Input con id 'origen' no encontrado.");
            return;
        }
    
        // Inicializar autocompletado con Google Maps API
        const autocompleteOrigen = new google.maps.places.Autocomplete($origen[0], opciones);
        const autocompleteDestino = new google.maps.places.Autocomplete($destino[0], opciones);
    
        // Escuchar cuando se selecciona un lugar en el campo de origen
        autocompleteOrigen.addListener('place_changed', () => {
            const place = autocompleteOrigen.getPlace();
    
            if (!place.geometry) {
                console.log("No details available for input: '" + place.name + "'");
                return;
            }
    
            coordOrigen = place.geometry.location.toString();
    
            $('#idLugarOrigen').val(place.place_id); // Actualizar el input oculto con el ID del lugar
            console.log($origen.val()); // Mostrar el valor seleccionado en el input de origen
            console.log("Lugar seleccionado:", place.name);
            console.log("ID del lugar:", place.place_id);
            console.log("Coordenadas:", place.geometry.location.toString());
        });
    
        // Escuchar cuando se selecciona un lugar en el campo de destino
        autocompleteDestino.addListener('place_changed', () => {
            const placeDestino = autocompleteDestino.getPlace();
    
            if (!placeDestino.geometry) {
                console.log("No details available for input: '" + placeDestino.name + "'");
                return;
            }
    
            coordDestino = placeDestino.geometry.location.toString();
    
            $('#idLugarDestino').val(placeDestino.place_id); // Actualizar el input oculto con el ID del lugar
            console.log($destino.val()); // Mostrar el valor seleccionado en el input de destino
            console.log("Lugar seleccionado:", placeDestino.name);
            console.log("ID del lugar:", placeDestino.place_id);
            console.log("Coordenadas:", placeDestino.geometry.location.toString());
        });
    }
    
    // Inicializar Google Places Autocomplete
    initAutocomplete();

    let currentStep = 1;
    const totalSteps = 5;
    //respuesta del primer formulario:
    const steps = document.querySelectorAll(".step-section");
    const stepIndicators = document.querySelectorAll(".step");
    const btnNext = document.querySelector(".btn-next"); 
    const btnPrev = document.querySelector(".btn-prev"); 
    const btnSave = document.querySelector(".btn-save"); 
    const btnRespParciales = document.querySelectorAll(".btn-guardar"); 

    /*Inputs de tipo range*/ 
    //input de prioridad de transporte
    const inputPrioridadTransporte = document.getElementById('prioridad-transporte');
    //span de prioridad
    const spanValorTransporte = document.getElementById('valor-prioridad');
    
    //input de prioridad de comida
    const inputPrioridadComida = document.getElementById('prioridad-comida');
    //span de prioridad de comida
    const spanValorComida = document.getElementById('valorPrioridadComida');
    //input de prioridad de actividades
    const inputPrioridadActividades = document.getElementById('prioridad-act');
    //span de prioridad de actividades
    const spanValorActividades = document.getElementById('valor-prioridadActividades');

    // Ocultar el botón de guardar inicialmente
    btnSave.style.display = 'none';
    // Variable global para almacenar los días del itinerario
    let itinerarioDias = [];
    //Variable para almacenar el numero de destinos por dias
    let NumDestinos=[0,0,0,0,0,0,0];
    // Objeto para almacenar datos de origen y destino por día
    let datosPorDia = {};


    const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' }); // Fecha actual en formato YYYY-MM-DD   

    // Calcular la fecha máxima para el inicio (hoy + 6 meses)
    const seisMeses = new Date();
    seisMeses.setMonth(seisMeses.getMonth() + 6); // Sumar 6 meses a la fecha actual
    const seisMesesString = seisMeses.toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' }); // Convertir a formato YYYY-MM-DD

    // Establecer límites en los campos de fecha
    $('#fecha-inicio').attr({
        'min': hoy,
        'max': seisMesesString
    });

    // Escuchar el cambio en la fecha de inicio para ajustar los límites de fecha de fin
    $('#fecha-inicio').on('change', function () {
        const fechaInicioString = $(this).val(); // Obtener la fecha seleccionada como cadena
        const fechaInicio = new Date(`${fechaInicioString}T00:00:00`);
            console.log(fechaInicio);
        if (!isNaN(fechaInicio)) { // Validar que la fecha sea válida
            // Calcular la fecha mínima y máxima para fecha de fin
            const fechaMin = new Date(fechaInicio);
            const fechaMax = new Date(fechaInicio);
            fechaMin.setDate(fechaMin.getDate() ); // Sumar 1 día a la fecha de inicio
            fechaMax.setDate(fechaMax.getDate() + 7); // Sumar 7 días a la fecha de inicio

            // Convertir las fechas a formato YYYY-MM-DD
            const fechaMinString = fechaMin.toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
            const fechaMaxString = fechaMax.toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });

            // Actualizar los límites del campo de fecha de fin
            $('#fecha-fin').attr({
                'min': fechaMinString,
                'max': fechaMaxString
            });

            // Opcional: Reiniciar el valor de fecha-fin si ya no está en el rango permitido
            const fechaFinActual = $('#fecha-fin').val();
            if (fechaFinActual && (fechaFinActual < fechaMinString || fechaFinActual > fechaMaxString)) {
                $('#fecha-fin').val(''); // Limpiar el campo de fecha de fin
            }
        }
    });
    
    // Escuchar el cambio en la fecha de fin para calcular los días del itinerario
    $('#fecha-fin').on('change', function () {
        const fechaInicioString = $('#fecha-inicio').val(); // Obtener la fecha de inicio seleccionada
        const fechaFinString = $(this).val(); // Obtener la fecha de fin seleccionada
        

        // Validar que ambas fechas estén seleccionadas
        if (!fechaInicioString || !fechaFinString) {
            console.error("Por favor selecciona tanto la fecha de inicio como la fecha de fin.");
            return;
        }

        const fechaInicio = new Date(`${fechaInicioString}T00:00:00`);
        const fechaFin = new Date(`${fechaFinString}T23:59:59`);

        // Validar que la fecha de inicio no sea mayor que la fecha de fin
        if (fechaInicio > fechaFin) {
            //alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
            return;
        }

        // Calcular la diferencia en días
        const diferencia = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24);

        // Limpiar el arreglo de itinerario y las opciones del select
        itinerarioDias = [];
        
        $('#day-select-Map').empty();
        $('#day-select-Map').append('<option value="Seleccionar dia">Seleccionar día</option>');

        // Llenar el itinerario con las fechas correspondientes
        for (let i = 0; i <= diferencia; i++) {
            const fecha = new Date(fechaInicio);
            fecha.setDate(fecha.getDate() + i); // Sumar días

            const fechaFormateada = formatearFecha(fecha); // Usar función para formatear
            itinerarioDias.push({ dia: i + 1, fecha: fechaFormateada });

            // Agregar las opciones al select
            $('#day-select-Map').append(
                `<option value="${fechaFormateada}">Día ${i + 1}: ${fechaFormateada}</option>`
            );

            console.log(`Día ${i + 1}: ${fechaFormateada}`);
        }

        
    });
     // Función que asigna el autocomplete y actualiza los inputs ocultos con place_id, latitud y longitud
     function asignarAutocomplete(idInput, idOculto, idLatOculto, idLngOculto) {
        const input = document.getElementById(idInput);
    
        if (!input) {
            console.error(`Input con id '${idInput}' no encontrado.`);
            return;
        }
    
        const opciones = {
            bounds: {
                north: 19.592757,
                south: 19.090223,
                east: -98.938204,
                west: -99.364204,
            },
            strictBounds: true,
            componentRestrictions: { country: "mx" },
            fields: ["place_id", "geometry", "name"],
        };
    
        const autocomplete = new google.maps.places.Autocomplete(input, opciones);
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
    
            if (!place.geometry) {
                console.error(`No hay detalles disponibles para: '${place.name}'.`);
                return;
            }
    
            const lat = place.geometry.location.lat().toString();
            const lng = place.geometry.location.lng().toString();
    
            document.getElementById(idOculto).value = place.place_id;
            document.getElementById(idLatOculto).value = lat;
            document.getElementById(idLngOculto).value = lng;
    
            console.log(`Destino actualizado: ${place.name}, Latitud: ${lat}, Longitud: ${lng}`);
        });
    }
    

    $('#day-select-Map').on('change', function () {
        const diaSeleccionado = $(this).val();
        const diaAnterior = $(this).data('diaSeleccionado') || null;
    
        console.log(`Día anterior: ${diaAnterior}, Día seleccionado: ${diaSeleccionado}`);
    
        // Guardar datos del día anterior antes de cambiar
        if (diaAnterior && diaAnterior !== "Seleccionar dia") {
            const destinos = [];
            $('#destinos-container .input-group').each(function () {
                const destinoInput = $(this).find('input[type="text"]');
                const idLugar = $(this).find('input[name="idDestino[]"]');
                const lat = $(this).find('input[name="latDestino[]"]');
                const lng = $(this).find('input[name="lngDestino[]"]');
    
                destinos.push({
                    nombre: destinoInput.val(),
                    idLugar: idLugar.val(),
                    latitud: lat.val(),
                    longitud: lng.val(),
                });
            });
    
            // Guarda los datos actuales del día anterior
            datosPorDia[diaAnterior] = {
                origen: {
                    nombre: $('#origen').val(),
                    idLugar: $('#idLugarOrigen').val(),
                    latitud: $('#latOrigen').val(),
                    longitud: $('#lngOrigen').val(),
                },
                destinos,
            };
    
            console.log(`Datos guardados para el día ${diaAnterior}:`, datosPorDia[diaAnterior]);
        }
    
        // Actualizar el día seleccionado
        $(this).data('diaSeleccionado', diaSeleccionado);
    
        // Mostrar/ocultar bloques
        if (diaSeleccionado === 'Seleccionar dia') {
            console.log("OCULTAR");
            $('#BloqueOrigenes').hide();
            $('#BloqueDestinos').hide();
        } else {
            console.log("MOSTRAR");
            $('#BloqueOrigenes').show();
            $('#BloqueDestinos').show();
    
            // Cargar los datos del día seleccionado, si existen
            const datosDia = datosPorDia[diaSeleccionado];
    
            if (datosDia) {
                $('#origen').val(datosDia.origen.nombre).prop('disabled', false);
                $('#idLugarOrigen').val(datosDia.origen.idLugar);
                $('#latOrigen').val(datosDia.origen.latitud);
                $('#lngOrigen').val(datosDia.origen.longitud);
    
                $('#destinos-container').empty();
                datosDia.destinos.forEach((destino) => crearDestino(destino));
            } else {
                // Inicializar campos vacíos si no hay datos
                $('#origen').val('');
                $('#idLugarOrigen').val('');
                $('#latOrigen').val('');
                $('#lngOrigen').val('');
                $('#destinos-container').empty();
            }
        }
    });
    
    
    

    function crearDestino(destino = { nombre: '', idLugar: '', latitud: '', longitud: '' }) {
        const destinoCount = $('#destinos-container .input-group').length + 1;
    
        const inputGroup = $(`
            <div class="input-group" data-index="${destinoCount}">
                <button  id="btn-remove" type="button" class="btn-remove">-</button>
                <input type="text" id="destino${destinoCount}" name="destino[]" placeholder="Punto de llegada" value="${destino.nombre}">
                <input type="hidden" id="idDestino${destinoCount}" name="idDestino[]" value="${destino.idLugar}">
                <input type="hidden" id="latDestino${destinoCount}" name="latDestino[]" value="${destino.latitud}">
                <input type="hidden" id="lngDestino${destinoCount}" name="lngDestino[]" value="${destino.longitud}">
                
            </div>
        `);
    
        $('#destinos-container').append(inputGroup);
    
        // Asignar Autocomplete
        asignarAutocomplete(
            `destino${destinoCount}`,
            `idDestino${destinoCount}`,
            `latDestino${destinoCount}`,
            `lngDestino${destinoCount}`
        );
    
        // Listener para eliminar destino
        inputGroup.find('.btn-remove').on('click', function () {
            inputGroup.remove();
        });
    }
    

    // Función para añadir un destino por defecto
    function addDefaultDestino() {
        crearDestino({ nombre: '', idLugar: '', latitud: '', longitud: '' }, 1);
    }

    // Asignar autocomplete al origen y primer destino al cargar
    asignarAutocomplete('origen', 'idLugarOrigen', 'latOrigen', 'lngOrigen');
    

    // Limitar los destinos por día
    $('#btn-add').on('click', function () {
        const diaSeleccionado = $('#day-select-Map').val(); // Día actualmente seleccionado
        if (!diaSeleccionado) {
            showErrorModal("Por favor, selecciona un día del itinerario antes de añadir destinos.");
            return;
        }

        // Obtener el número de destinos ya añadidos para el día actual
        const destinosActuales = $('#destinos-container .input-group').length;

        if (destinosActuales < 5) {
            crearDestino();
        } else {
            showErrorModal("Número máximo de destinos alcanzado para este día (5 destinos).");
        }
    });
    
    // Función para formatear fecha en formato dd-mm-yyyy
    function formatearFecha(fecha) {
        const dia = ('0' + fecha.getDate()).slice(-2);
        const mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Meses de 0-11
        const anio = fecha.getFullYear();
        return `${dia}-${mes}-${anio}`;
    }
    function convertirFecha(fecha) {
        const [dia, mes, anio] = fecha.split('-');
        return `${anio}-${mes}-${dia}`;
    }
    
    
    // Función para guardar los valores del día actual en el objeto datosPorDia
    function guardarDatosDelDiaActual() {
        const diaSeleccionado = $('#day-select-Map').val(); // Día seleccionado actual
        if (!diaSeleccionado) {
            console.error("No se ha seleccionado un día.");
            return;
        }
    
        // Obtener los valores del origen
        const origen = {
            nombre: $('#origen').val(), // Valor del campo de texto
            idLugar: $('#idLugarOrigen').val(), // ID asociado al lugar
            latitud: $('#latOrigen').val(), // Latitud del origen
            longitud: $('#lngOrigen').val(), // Longitud del origen
        };
        //console.log("N:"+origen.nombre+"id:"+origen.id+"lat:"+origen.lat+"lng:"+origen.lng);
        // Verificar si el origen tiene datos válidos
        if (!origen.nombre || !origen.id || !origen.lat || !origen.lng) {
            console.warn("El origen no tiene datos completos o válidos. Revisar los campos de origen:", origen);
        }
    
        // Obtener los destinos
        const destinos = [];
        $('#destinos-container .input-group').each(function () {
            const destino = {
                nombre: $(this).find('input[type="text"]').val()?.trim() || '',
                idLugar: $(this).find('input[name="idDestino[]"]').val()?.trim() || '',
                latitud: $(this).find('input[name="latDestino[]"]').val()?.trim() || '',
                longitud: $(this).find('input[name="lngDestino[]"]').val()?.trim() || '',
            };
    
            // Solo agregar destinos con datos válidos
            if (destino.nombre && destino.idLugar && destino.latitud && destino.longitud) {
                destinos.push(destino);
            } else {
                console.warn("Se encontró un destino con datos incompletos y no será guardado:", destino);
            }
        });
    
        // Verificar si no hay destinos y mostrar advertencia si es necesario
        if (destinos.length === 0) {
            console.warn("No se encontraron destinos válidos para el día:", diaSeleccionado);
        }
    
        // Actualizar datosPorDia para el día seleccionado
        datosPorDia[diaSeleccionado] = {
            origen: origen,
            destinos: destinos,
        };
    
        console.log(`Datos guardados para el día ${diaSeleccionado}:`, datosPorDia[diaSeleccionado]);
    }  
    //validar los datos del formulario de presupuesto:
    const ValidarPresuppuesto= new JustValidate('#presupuestoForm');
    ValidarPresuppuesto
    .addField("#presupuesto",[
        {
            rule: 'required',
            errorMessage: "Introduce tu presupuesto"
        },
        {
            rule:"number",
            errorMessage:"Solo números"
        },
        {
            rule:"minNumber",
            value:1,
            errorMessage:"Ingresa un presupuesto mayor a 0"
        },
        {
            rule:"maxNumber",
            value:10000,
            errorMessage:"Ingresa un presupuesto menor a 10000"
        }
    ])
    .addField("#acompanantes",[
        {
            rule:"required",
            errorMessage:"Introduce la cantidad de acompañantes"
        },
        {
            rule:"integer",
            errorMessage:"Solo numeros enteros"
        },
        {
            rule:"maxNumber",
            value:5,
            errorMessage:"El numero maximo de acompañantes es de 5"
        }
    ])
    .addField("#fecha-inicio",[
        {
            rule:"required",
            errorMessage:"Introduce la fecha de inicio del viaje"
        },
    ])
    .addField("#fecha-fin",[
        {
            rule:"required",
            errorMessage:"Introduce la fecha de fin del viaje"
        },
    ])
    .onSuccess((event) => {
        event.preventDefault(); // Evita el envío estándar del formulario
        // Obtener datos del formulario
        const formData = new FormData(event.target);
        
        // Guardar los datos del día actual nuevamente antes de enviar
        guardarDatosDelDiaActual();
        // Verificar si el usuario seleccionó "Sí" en la opción de "¿Sabes a dónde ir?"
        const ubicacionConocida = $('input[name="UbiConocida"]:checked').val();
        if (ubicacionConocida === "Si") {
            Object.keys(datosPorDia).forEach((dia) => {
                const diaData = datosPorDia[dia];
                const diaFormateado = convertirFecha(dia); // Convertir el formato aquí
            
                // Agregar datos de origen
                formData.append(`dias[${diaFormateado}][origen]`, JSON.stringify(diaData.origen));
            
                // Agregar datos de destinos
                if (Array.isArray(diaData.destinos)) {
                    diaData.destinos.forEach((destino, index) => {
                        formData.append(`dias[${diaFormateado}][destinos][${index}]`, JSON.stringify(destino));
                    });
                }
            });
        }
        
        //Verificar que haya un formulario previamente creado para que 
        //con base a su id se inserten todos los datos asociados a este
        consultarIdFormulario().then((idFormularioS) => {
            console.log('EL ID DEL FORMULARIO EN VIAJE ES:'+idFormularioS);
            // Agregar datos adicionales
            formData.append('idFormulario', idFormularioS); // Dato adicional
            
            
            const UbicacionCono = $('input[name="UbiConocida"]:checked').val();
            console.log("SABE A DONDE IR: "+UbicacionCono);
            formData.append('UbicacionConocida', UbicacionCono); // Dato adicional para la seleccion si sabe a donde quiere ir
            formData.forEach((value, key) => {
                console.log(key, value);
            });
            //Guardo en la sesion el valor de la respuesta si sabe a odnde ir
            localStorage.setItem("Ubicacion_Conocida",UbicacionCono);
            $.ajax({
                url:"../php/viajeActualizado.php",
                //url: "../php/viaje.php",
                type: "POST",
                data: formData,
                processData: false,  // Evita que jQuery procese los datos
                contentType: false,  // Permite que el navegador establezca el encabezado correcto
                cache: false,
                success: (respAX) => {
                    //convertimos la respuesta del servidor a un objeto JSON
                    console.log(respAX);
                    let respAjax = JSON.parse(respAX);
                    idFormularioS=respAjax.idFormulario;
                    // Aquí puedes verificar la respuesta del servidor y realizar acciones en consecuencia
                    if (respAjax.status === "success") {
                        // Si la respuesta indica éxito, muestra SweetAlert
                        //localStorage.setItem('usuario', JSON.stringify(respAjax.datos));
                        //sessionStorage.removeItem('carritoSesion');
                        if (respAjax.statusDias === "success") {
                            //aqui se puede verificar el status, statusDias y statusDestinos
                            showSuccesModal();
                        }else{
                            showErrorModal("No se pudieron guardar tus dias. Intenta de nuevo.")
                            //Swal.fire({
                                //title: "Respuestas No registradas",
                                //text: `Sus respuestas no han sido registradas, intentelo más tarde`,
                                //icon: "error"
                            //});
                        }
                        
                        //Swal.fire({
                            //title: "Respuestas registradas",
                            //text: `Sus respuestas han sido registradas`,
                            //icon: "success"
                        //});
                    }else{
                        showErrorModal("No se pudieron guardar tus respuestas. Intenta de nuevo.")
                        //Swal.fire({
                            //title: "Respuestas No registradas",
                            //text: `Sus respuestas no han sido registradas, intentelo más tarde`,
                            //icon: "error"
                        //});
                    }
                },
                error: function () {
                    //Pueden usar la funcion de Swal.fire para probar sus errores solo no olviden volver a comentar jaja
                    //Swal.fire({
                    //    icon: "error",
                    //    title: "Error",
                    //    text: "Ocurrió un error inesperado. Inténtelo de nuevo más tarde.",
                    //});
                    showErrorModal("Ocurrió un error inesperado. Inténtelo de nuevo más tarde."); //envia el mensaje de error al modal por defecto
                },
            });
        }).catch((error) => {
            console.error("Error:", error);
        });
        

        
    });

    //validar los datos del formulario de transporte:
    const ValidarTransporte= new JustValidate('#transporteForm');
    ValidarTransporte
    .addField("#prioridad-transporte",[
        {
            rule: 'required',
            errorMessage: "Selecciona la prioridad"
        },
        {
            rule:"number",
            errorMessage:"Solo números"
        },
    ])
    .addRequiredGroup('#tipoTransporteRadio', 'Selecciona un transporte')

   // .addRequiredGroup('#tipoCarreteraRadio', 'Selecciona una opción') 
    /*.addField("#Pres-Transporte",[

    .addField("#Pres-Transporte",[

        {
            rule:"required",
            errorMessage:"Introduce el presupuesto aproximado"
        },
        {
            rule:"number",
            errorMessage:"Solo numeros"
        },
        {
            rule:"minNumber",
            value:1,
            errorMessage:"Ingresa un presupuesto mayor a 0"
        },
        {
            rule:"maxNumber",
            value:1000,
            errorMessage:"Ingresa un presupuesto menor a 1000"
        }
    ])*/
    .onSuccess((event) => {
        /*event.preventDefault(); // Evita el envío estándar del formulario
        // Serializar todos los campos del formulario
        const datosSerializados = $(event.target).serialize();
        console.log(datosSerializados);*/
        event.preventDefault();  // Evita el envío estándar del formulario
        // Crear FormData a partir del formulario
        const formDataTransporte = new FormData(event.target);
        //Verificar que haya un formulario previamente creado para que 
        //con base a su id se inserten todos los datos asociados a este
        consultarIdFormulario().then((idFormularioS) => {
            // Agregar datos adicionales
            formDataTransporte.append('idFormulario', idFormularioS); // Dato adicional
            console.log('EL ID DEL FORMULARIO EN TRANSPORTE ES:'+idFormularioS);
            
            // Obtiene los datos del formulario
            const  PrioridadTransporte= $("#prioridad-transporte").val();
            const tipoTransporteRadio =  $('input[name="tipoTransporte"]:checked').val();
            console.log(PrioridadTransporte);
            console.log(tipoTransporteRadio);
            formDataTransporte.append('tipoTransporteRadio', tipoTransporteRadio); // Dato adicional
            console.log(idFormularioS);
            $.ajax({
                url: "../php/transporte.php",
                type: "POST",
                data: formDataTransporte,
                processData: false,  // Evita que jQuery procese los datos
                contentType: false,  // Permite que el navegador establezca el encabezado correcto
                cache: false,
                success: (respAX) => {
                    //convertimos la respuesta del servidor a un objeto JSON
                    let respAjax = JSON.parse(respAX);
                    console.log(respAjax);
                    // Aquí puedes verificar la respuesta del servidor y realizar acciones en consecuencia
                    if (respAjax.status === "success") {
                        // Si la respuesta indica éxito, muestra SweetAlert
                        //localStorage.setItem('usuario', JSON.stringify(respAjax.datos));
                        //sessionStorage.removeItem('carritoSesion');
                        showSuccesModal();
                        //Swal.fire({
                            //title: "Respuestas registradas",
                            //text: `Sus respuestas han sido registradas`,
                            //icon: "success"
                        //});
                    }else{
                        showErrorModal(`Ocurrió un error inesperado. Inténtelo de nuevo más tarde. Error: ${respAjax.message}`);
                        //Swal.fire({
                            //title: "Respuestas No registradas",
                            //text: `Sus respuestas no han sido registradas, intentelo más tarde`,
                            //icon: "error"
                        //});
                    }
                },
                error: function () {
                    //Pueden usar la funcion de Swal.fire para probar sus errores solo no olviden volver a comentar jaja
                    //Swal.fire({
                    //    icon: "error",
                    //    title: "Error",
                    //    text: "Ocurrió un error inesperado. Inténtelo de nuevo más tarde.",
                    //});
                    showErrorModal("Ocurrió un error inesperado. Inténtelo de nuevo más tarde."); //envia el mensaje de error al modal por defecto
                },
            });
        }).catch((error) => {
            console.error("Error:", error);
        });
        
    });
    /*Colocar una bandera que indique si el usuario por lo menos ha hecho click
    una vez en el boton de guardar respuestas parciales, esto con el fin
    de sabes si vamos a insertar o a actualizar un registro*/
   

    //validar los datos del formulario de comida:
    const ValidarComida= new JustValidate('#comidaForm');
    ValidarComida
    .addField("#prioridad-comida",[
        {
            rule: 'required',
            errorMessage: "Selecciona la prioridad"
        },
        {
            rule:"number",
            errorMessage:"Solo números"
        },
    ])
    .addRequiredGroup('#comidaCheckbox', 'Selecciona al menos una opción')
    /*.addField("#Pres-Comida",[
        {
            rule:"required",
            errorMessage:"Introduce el presupuesto aproximado"
        },
        {
            rule:"number",
            errorMessage:"Solo numeros"
        },
        {
            rule:"minNumber",
            value:1,
            errorMessage:"Ingresa un presupuesto mayor a 0"
        },
        {
            rule:"maxNumber",
            value:1000,
            errorMessage:"Ingresa un presupuesto menor a 1000"
        }
    ])*/
    .onSuccess((event) => {
        event.preventDefault(); // Evita el envío estándar del formulario
        // Crear FormData a partir del formulario
        const formDataComida = new FormData(event.target);
        //Verificar que haya un formulario previamente creado para que 
        //con base a su id se inserten todos los datos asociados a este
        consultarIdFormulario().then((idFormularioS) => {
            console.log('EL ID DEL FORMULARIO EN COMIDA ES:'+idFormularioS);
            // Agregar datos adicionales
            formDataComida.append('idFormulario', idFormularioS); // Dato adicional
            // Obtener el valor seleccionado del prioridad
            const prioridadComida= $('#prioridad-comida').val();
            console.log("La prioridad: " + prioridadComida);

            // Obtener los valores seleccionados de los checkboxes "establecimientoComida[]"
            const establecimientoSeleccionado = []; 
            $('input[name="establecimientoComida[]"]:checked').each(function () {
                establecimientoSeleccionado.push($(this).val());
            });
            console.log("establecimiento seleccionado: " + establecimientoSeleccionado);
            // Añadir al FormData
            establecimientoSeleccionado.forEach((valor) => {
                formDataComida.append('establecimientoComida[]', valor); // Enviar cada valor como elemento separado
            });
            $.ajax({
                url: "../php/api_prueba.php",
                type: "POST",
                data: formDataComida,
                processData: false,  // Evita que jQuery procese los datos
                contentType: false,  // Permite que el navegador establezca el encabezado correcto
                cache: false,
                success: (respAX) => {
                    //convertimos la respuesta del servidor a un objeto JSON
                    console.log(respAX);
                    let respAjax = JSON.parse(respAX);
                    // Aquí puedes verificar la respuesta del servidor y realizar acciones en consecuencia
                    if (respAjax.status === "success") {
                    // Si la respuesta indica éxito, muestra SweetAlert
                    //localStorage.setItem('usuario', JSON.stringify(respAjax.datos));
                    //sessionStorage.removeItem('carritoSesion');
                    showSuccesModal();
                    }else{
                        showErrorModal("Ocurrió un error inesperado. Inténtelo de nuevo más tarde.");
                    }
                },
                error: function (xhr, status, error) {
                    //Pueden usar la funcion de Swal.fire para probar sus errores solo no olviden volver a comentar jaja
                    //Swal.fire({
                    //    icon: "error",
                    //    title: "Error",
                    //    text: "Ocurrió un error inesperado. Inténtelo de nuevo más tarde.",
                    //});
                    showErrorModal("Ocurrió un error inesperado. Inténtelo de nuevo más tarde."); //envia el mensaje de error al modal por defecto
                    console.error("Estado:", status);
                    console.error("Error:", error);
                    console.error("Respuesta del servidor:", xhr.responseText);
                },
            });
        }).catch((error) => {
            console.error("Error:", error);
        });

    });

    //validar los datos del formulario de actividades:
    const ValidarActividades= new JustValidate('#ActividadesForm');
    ValidarActividades
    .addField("#prioridad-act",[
        {
            rule: 'required',
            errorMessage: "Selecciona la prioridad"
        },
        {
            rule:"number",
            errorMessage:"Solo números"
        },
    ])
    .addRequiredGroup('#CostoActCheckbox', 'Selecciona al menos una opción')
    .addRequiredGroup('#DistanciaActividadesRadio', 'Selecciona una opción')
    .addRequiredGroup('#PrioridadActividadesRadio', 'Selecciona al menos una opción')
    /*.addField("#Pres-Act",[
        {
            rule:"required",
            errorMessage:"Introduce el presupuesto aproximado"
        },
        {
            rule:"number",
            errorMessage:"Solo numeros"
        },
        {
            rule:"minNumber",
            value:1,
            errorMessage:"Ingresa un presupuesto mayor a 0"
        },
        {
            rule:"maxNumber",
            value:1000,
            errorMessage:"Ingresa un presupuesto menor a 1000"
        }
    ])*/
    .onSuccess((event) => {
        event.preventDefault(); // Evita el envío estándar del formulario
        
        // Crear FormData a partir del formulario
        const formDataActividades = new FormData(event.target);
        //Verificar que haya un formulario previamente creado para que 
        //con base a su id se inserten todos los datos asociados a este
        consultarIdFormulario().then((idFormularioS) => {
            console.log('EL ID DEL FORMULARIO EN ACTIVIDADES ES:'+idFormularioS);
            // Agregar datos adicionales
            formDataActividades.append('idFormulario', idFormularioS); // Dato adicional
            // Obtener el valor seleccionado del prioridad
            const prioridadActividades= $('#prioridad-act').val();
            console.log("La prioridad actividades: " + prioridadActividades);

            $.ajax({
                url: "../php/actividades.php",
                type: "POST",
                data: formDataActividades,
                processData: false,  // Evita que jQuery procese los datos
                contentType: false,  // Permite que el navegador establezca el encabezado correcto
                cache: false,
                success: (respAX) => {
                    console.log(respAX)
                    //convertimos la respuesta del servidor a un objeto JSON
                    let respAjax = JSON.parse(respAX);
                    // Aquí puedes verificar la respuesta del servidor y realizar acciones en consecuencia
                    if (respAjax.status === "success") {
                    // Si la respuesta indica éxito, muestra SweetAlert
                    //localStorage.setItem('usuario', JSON.stringify(respAjax.datos));
                    //sessionStorage.removeItem('carritoSesion');
                    //Guardar en una sesion el id del formulario que se acaba de responder;
                    localStorage.setItem('idFormularioFinal', JSON.stringify(idFormularioS));
                    showSuccesModal();
                    }else{
                        showErrorModal("Ocurrió un error inesperado. Respuestas No registradas. Inténtelo de nuevo más tarde.");
                    }
                },
                error: function () {
                    //Pueden usar la funcion de Swal.fire para probar sus errores solo no olviden volver a comentar jaja
                    //Swal.fire({
                    //    icon: "error",
                    //    title: "Error",
                    //    text: "Ocurrió un error inesperado. Inténtelo de nuevo más tarde.",
                    //});
                    showErrorModal("Ocurrió un error inesperado. Inténtelo de nuevo más tarde."); //envia el mensaje de error al modal por defecto
                },
            });
        }).catch((error) => {
            console.error("Error:", error);
        });
        

    });

    // Actualizar lo visible del formulario
    function showStep(step) {
        // Mostrar solo el paso actual
        steps.forEach((section) => {
            section.classList.add('hidden');
        });
        document.querySelector(`.Paso${step}`).classList.remove('hidden');
    
        // Actualizar indicadores de pasos
        stepIndicators.forEach((element, index) => {
            element.classList.remove('active');
            if (index < step - 1) {
                element.classList.add('completed');
            }
        });
        stepIndicators[step - 1].classList.add('active');
    
        // Habilitar botones según el paso
        btnPrev.style.display = step === 1 ? 'none' : 'inline-block';
        btnNext.style.display = step === totalSteps ? 'none' : 'inline-block';
        btnSave.style.display = step === totalSteps ? 'inline-block' : 'none';
    }
    

    // Siguiente paso si las entradas son correctas
    function validateStep() {
        switch (currentStep) {
            case 1:
                // Se valida el formulario de viaje para poder pasar al siguiente paso
                ValidarPresuppuesto.revalidate().then(isValid => {
                    if (isValid) {
                        if (currentStep < totalSteps) {
                            currentStep++;
                            showStep(currentStep);
                        }
                    }
                });
                break;
            case 2:
                // Se valida el formulario de transporte para poder pasar al siguiente paso
                ValidarTransporte.revalidate().then(isValid => {
                    if (isValid) {
                        if (currentStep < totalSteps) {
                            currentStep++;
                            showStep(currentStep);
                        }
                    }
                });
                break;
            
            case 3:
                // Se valida el formulario de comida para poder pasar al siguiente paso
                ValidarComida.revalidate().then(isValid => {
                    if (isValid) {
                        if (currentStep < totalSteps) {
                            currentStep++;
                            showStep(currentStep);
                        }
                    }
                });
                break;
            case 4:
                // Se valida el formulario de categorias para poder pasar al siguiente paso
                ValidarActividades.revalidate().then(isValid => {
                    if (isValid) {
                        if (currentStep < totalSteps) {
                            currentStep++;
                            showStep(currentStep);
                        }
                    }
                });
                break;
        }
    }
    // Paso siguiente
    function nextStep() {
        //Valida los datos para seguir
        validateStep();
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }   

    // Paso anterior
    function previousStep() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    }

    function goToStep(step) {
        console.log("ESTOY EN EL PASO "+step);
        if (step >= 1 && step <= totalSteps) {
            currentStep = step;
            showStep(currentStep);
        }
    }
    



    //Verifica que al guardar las respuestas parciales esten validados todos los inputs para pasar al siguiente formulario
    btnRespParciales.forEach(btn => {
        btn.addEventListener("click", validateStep);
    });

    // Función para botón "siguiente"
    btnNext.addEventListener("click", nextStep);
    // Función para botón "Anterior"
    btnPrev.addEventListener("click", previousStep);

    // Para los numeros
    stepIndicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => {
            goToStep(index + 1); 
        });
    });

    //Actualizar el valor seleccionado en la barra de prioridad del transporte
    inputPrioridadTransporte.addEventListener('input', function() {
        spanValorTransporte.textContent = inputPrioridadTransporte.value;
    });
    //Actualizar el valor seleccionado en la barra de prioridad de comida
    inputPrioridadComida.addEventListener('input', function() {
        spanValorComida.textContent = inputPrioridadComida.value;
    });
    //Actualizar el valor seleccionado en la barra de prioridad de actividades
    inputPrioridadActividades.addEventListener('input', function() {
        spanValorActividades.textContent = inputPrioridadActividades.value;
    });
    showStep(currentStep);


    //avisos emergentes
    function showErrorModal(message) {
        $("#errorModalBody").text(message); // Inserta el mensaje de error en el cuerpo del modal
        $("#exampleModal").modal("show"); // Muestra el modal
    }
    
    function showSuccesModal(){
        $("#confirmationModal").modal("show");
    }

    function showWarningModal(){
        $("#WarningModal").modal("show");
    }
    
    // Cuando este en el ultimo paso del formulario y de click en confirmar dirigir a cierta pantalla
    $('#confirmationModal').on('hidden.bs.modal', function () {
    
        /*if(currentStep==5){
            // Redirigir al usuario o ejecutar otra lógica
            window.location.href = "../actividadesPrueba/index.html"; // Cambia por la URL deseada
        }*/
        
    });

    function consultarIdFormulario() {
        let idFormularioS = JSON.parse(localStorage.getItem('idFormularioActual')); // Verifica si ya hay una sesión creada del idForm
        if (idFormularioS !== null) {
            // Formulario previamente creado
            return Promise.resolve(idFormularioS);
        } else {
            // Formulario no creado, realiza la consulta AJAX
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: "../php/insertForm.php",
                    type: "POST",
                    data: {},
                    processData: false, // Evita que jQuery procese los datos
                    contentType: false, // Permite que el navegador establezca el encabezado correcto
                    cache: false,
                    success: (respAX) => {
                        let respAjax = JSON.parse(respAX);
                        //console.log(respAjax);
                        if (respAjax.statusForm === "success") {
                            // Establece el id del formulario creado en una sesión local
                            localStorage.setItem('idFormularioActual', JSON.stringify(respAjax.idFormulario));
                            //Establece el id del usuario que esta llenando el formulario:
                            localStorage.setItem('idUser', JSON.stringify(respAjax.idUser));
                            //sessionStorage.setItem('idUsuario',JSON.stringify(respAjax.idUser));
                            resolve(respAjax.idFormulario);
                        } else {
                            localStorage.setItem('idFormularioActual', JSON.stringify(-1));
                            resolve(-1);
                        }
                    },
                    error: () => {
                        showErrorModal("Ocurrió un error inesperado. Inténtelo de nuevo más tarde.");
                        reject("Error en la creación del formulario.");
                    },
                });
            });
        }
    }

    //para checkear las preferencias (categorias y subcategorias)
    function toggleSubcategories(idCategoria){
        const subcategoryContainer = document.getElementById(idCategoria);
        const mainCheckbox = document.getElementById(`checkbox-${idCategoria}`);

        mainCheckbox.checked = true;
        subcategoryContainer.classList.remove('hidden');
        // Marca solo ciertos checkboxes (por ejemplo, con un atributo específico)
        const checkboxes = subcategoryContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.dataset.id === "ok") {
                checkbox.checked = true;
            }
        });

        
        /*subcategoryContainer.classList.add('hidden');
        const checkboxes2 = subcategoryContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes2.forEach(checkbox => checkbox.checked = false);*/
    }
    

    //Obtener las categorías y subcategorías desde la base de datos
    //Solicitud AJAX para mostrar las preferencias existentes para el usuario
    $.ajax({
        //configurar 5 propiedades
        //url: sustituye al atributo action
        url:"../../formulario/php/categorias.php",
        //tipo de envio GET O POST
        type:"POST",
        //los datos
        data:{},
        //tomar los utlimos cambios sin tomar a la memoria cache
        cache:false,
        success:(respCategorias)=>{
            let respAjaxCategorias = JSON.parse(respCategorias);
            //console.log(respAjaxCategorias);
            let preferencias="";

            //hacer una cosnulta con la BD para ver que preferencias estan ya almacenadas:
            //preferenciasCategorias se trata de un arreglo de objetos que a su vez cada objeto tiene asociado
            //otro arreglo que son las subcategorias asociadas a una categoria
            //De esta forma logramos crear el formulario al acceder a la pagina de formulario
            consultarPreferenciasActividades().then((preferenciasCategorias) => {
                //console.log(preferenciasCategorias);
                //se filtran las respuestas de respAjaxCategorias de a cuerdo a las preferencias 
                //obtenidas en preferenciasCategorias
                /*const respAjaxCategorias2 = respAjaxCategorias.filter(obj1 => 
                    preferenciasCategorias.some(obj2 => obj1.categorias.idCategorias === obj2.categorias.idCategorias)
                );*/
                let falgCategoria=0;
                let falgSubCategoria=0;
                respAjaxCategorias.categorias.forEach((categoria, indicei)=>{
                    
                    
                    preferencias+=`
                        <div class="category">
                            <h4><img src="${categoria.Imagen}" alt="Cultura Icon" class="category-icon">${categoria.Nombre}
                                <input type="checkbox" id="checkbox-${categoria.idCategorias}" name="Categorias[]" value="${categoria.idCategorias}" onclick="toggleSubcategories('${categoria.idCategorias}')">
                            </h4>
                            <div id="${categoria.idCategorias}" class="subcategory hidden">`;
                                //imprimir subcategorias
                                categoria.subCategorias.forEach((subcategoria, i)=>{
                                    falgSubCategoria=0;
                                    //verificar si el checkbox actual es una preferencia del usuario
                                    for (const subCategoriaPreferencia of preferenciasCategorias.subcategorias) {
                                        if (subCategoriaPreferencia.idSubCategoria === subcategoria.idSubCategoria) {
                                            falgSubCategoria=1;
                                            console.log(subCategoriaPreferencia.idSubCategoria);
                                            break; // Rompe el ciclo
                                        }
                                    }
                                    //en caso que la subcategoria resulte una preferencia del usuario, marcarla con un id distinto
                                    if(falgSubCategoria===1){
                                        preferencias+=
                                        `
                                        <label><input type="checkbox" data-id="ok" name="subCategorias[]" value="${subcategoria.idSubCategoria}">${subcategoria.nombre}</label> `;
                                    }else{
                                        preferencias+=
                                        `
                                        <label><input type="checkbox" data-id="${subcategoria.idValor}" name="subCategorias[]" value="${subcategoria.idSubCategoria}">${subcategoria.nombre}</label> `;
                                    }
                                    
                                });
                           preferencias+=
                            `
                            </div>
                        </div>
                    `;
                    //En caso de que sea una categoria seleccionada por el usuario
                    
                });
                $("div#preferenciasActividades").html(preferencias);
                //marcar todos los checkboxes que son las preferencias del turista
                respAjaxCategorias.categorias.forEach((categoria, indicei)=>{
                    //se recorre el arreglo preferenciasCategorias buscando si se encuentra cierta categoria para marcarla
                    //en el checkbox
                    falgCategoria=0;
                    for (const categoriaPreferencia of preferenciasCategorias.categorias) {
                        if (categoriaPreferencia.idCategorias === categoria.idCategorias) {
                            falgCategoria=1;
                            console.log(categoriaPreferencia.idCategorias);
                            break; // Rompe el ciclo
                        }
                    }
                    if(falgCategoria===1){
                        toggleSubcategories(categoria.idCategorias);
                    }
                });
                
            }).catch((error) => {
                console.error("Error:", error);
            });

        }
    });

    //funcion que elimina las preferencias guardadas de cierto
    //formulario para despues en otro flujo se inserten las nuevas preferencias
    function eliminarPreferenciasFormulario(idForm) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "../../formulario/php/eliminarPreferenciasForm.php",
                type: "POST",
                data: {idFormulario:idForm},
                success: (respAX) => {
                    let respAjax = JSON.parse(respAX);
                    console.log(respAjax);

                    if (respAjax.status === "success") {
                        resolve(respAjax);
                    } else {
                        resolve(null);
                    }
                },
                error: () => {
                    showErrorModal("Ocurrió un error inesperado. Inténtelo de nuevo más tarde.");
                    reject("Error en la creación del formulario.");
                },
            });
        });
    }

    function consultarPreferenciasActividades(){
        //se crea el formulario y así obtenemos el id del usuario que lo creo:
        return consultarIdFormulario().then(() => {
            //se obtiene el id del usuario actual
            let idUsuario=JSON.parse(localStorage.getItem('idUser'));
            if(idUsuario !== null){
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url:"../php/preferenciasActividades.php",
                        type:"POST",
                        //los datos
                        data: { idUser: idUsuario},
                        success:(respCategorias)=>{
                            let respAjaxCategorias = JSON.parse(respCategorias);
                            //console.log(respAjaxCategorias);
                            resolve(respAjaxCategorias);
                        },
                        error: () => {
                            showErrorModal("Ocurrió un error inesperado. Inténtelo de nuevo más tarde.");
                            reject("Error en la creación del formulario.");
                        },
                    });
                });   
            }else{
                return Promise.resolve(null);
            }

        }).catch((error) => {
            console.error("Error:", error);
            throw error;
        });
    }
    const categoriasInfo = {
        "Deportes": {
            imagen: "../../img-categorias/deporte.jpg",
            descripcion: "Espacios para actividades deportivas, desde estadios hasta rutas de aventura."
        },
        "Compras": {
            imagen: "../../img-categorias/compras.jpg",
            descripcion: "Descubre mercados, centros comerciales y tiendas únicas."
        },
        "Lugares de Culto": {
            imagen: "../../img-categorias/culto.jpg",
            descripcion: "Lugares para reflexionar, conocer templos históricos y vivir tradiciones espirituales."
        },
        "Cultura": {
            imagen: "../../img-categorias/cultura.jpg",
            descripcion: "Sumérgete en la historia y el arte a través de sitios culturales y monumentos."
        },
        "Educación": {
            imagen: "../../img-categorias/educacion.jpg",
            descripcion: "Explora museos, bibliotecas y centros de aprendizaje locales."
        },
        "Elementos naturales": {
            imagen: "../../img-categorias/naturales.jpg",
            descripcion: "Disfruta de paisajes naturales, parques, playas y reservas ecológicas."
        },
        "Ocio y Entretenimiento": {
            imagen: "../../img-categorias/ocioyentretenimiento.jpg",
            descripcion: "Diviértete con opciones de vida nocturna, parques temáticos y eventos."
        }
    };
    
    // Función para formatear IDs
    const formatId = (name) => name.replace(/\s+/g, '_');
    //Guardar las preferencias particulares para un formulario en especifico
    document.getElementById("save-button2").addEventListener("click", function () {
        
        
        //obtener idusuario
        let userId=JSON.parse(localStorage.getItem('idUser'));
        consultarIdFormulario().then((idForm) => {
            
            //se eliminan las preferencias del usuario para el formulario actual
            //y posteriormente insertar las nuevas preferencias
            eliminarPreferenciasFormulario(idForm).then((resp) => {
                if(resp.status === "success"){
                    // Seleccionamos todos los checkboxes dentro del div con ID 'miDiv'
                    const checkboxesCategorias = $('#preferenciasActividades input[type="checkbox"][name="Categorias[]"]:checked');

                    const checkboxesSubCategorias = $('#preferenciasActividades input[type="checkbox"][name="subCategorias[]"]:checked');
                    // Creamos un arreglo para almacenar los datos
                    const datosCategorias = [];
                    const datosSubCategorias = [];
                    // Recorremos los checkboxes y almacenamos el name y value
                    checkboxesCategorias.each(function () {
                        datosCategorias.push({
                            name: $(this).attr('name'),
                            value: $(this).val()
                        });
                    });

                    checkboxesSubCategorias.each(function () {
                        datosSubCategorias.push({
                            name: $(this).attr('name'),
                            value: $(this).val()
                        });
                    });
                    console.log(datosCategorias);
                    console.log(datosSubCategorias);
                    console.log(userId);
                    // se guardan las nuevas preferencias para un formulario en especifico
                    $.ajax({
                        url: "../php/guardarPreferenciasForm.php", // Ruta de tu archivo PHP
                        type: "POST",
                        data: { categorias: datosCategorias, subcategorias: datosSubCategorias, user_id: userId, formulario: idForm},
                        success: (response) => {
                            let cardCategoria = "";
                            console.log(response);
                            let data = JSON.parse(response);
                            console.log(data);
                            if (data.status === "success") {
                                showSuccesModal();
                                //Recorremos la respuesta de Ajax para que los mostremos en las cards
                                //Limpiamos los datos 
                                $("#ContenedorActividades").html(cardCategoria);
                                data.categorias.categorias.forEach((categoria,index)=>{
                                    console.log(index);
                                    let info = categoriasInfo[categoria.Nombre] || {
                                        imagen: "../../img-categorias/default.jpg",
                                        descripcion: "Descripción no disponible."
                                    };
                                    cardCategoria += `
                                            <div class="activity-card" id="Card${formatId(categoria.Nombre)}">
                                                <img class="img-categoria" src="${info.imagen}" alt="${categoria.Nombre}">
                                                <h3>${categoria.Nombre}</h3>
                                                <p>${info.descripcion}</p>
                                                <!-- <button class="btn-menos" id="Btn_Quitar${index}" data-nombre="${categoria.Nombre}">Quitar</button> -->
                                            </div>
                                    `;
                                    
                                });
                                $("#ContenedorActividades").html(cardCategoria);
                            } else {
                                showErrorModal("Ocurrió un error inesperado. Respuestas No registradas. Inténtelo de nuevo más tarde.");
                            }
                        },
                        error: function () {
                            showErrorModal("Ocurrió un error inesperado. Hubo un error al guardar tus preferencias");
                            console.error('Error en la petición:'. data.message);
                        }
                    });
                }
            }).catch((error) => {
                console.error("Error:", error);
                throw error;
            });

        }).catch((error) => {
            console.error("Error:", error);
            throw error;
        });
        
    });

    

    //Logica para guardar el itinerario y comenzar a generarlo, aqui solo vamos a mandar a la pantalla de Seleccionar Itinerario que hizo bolillo
    $('#btn-guardar').on('click', ()=> {
        window.location.href = "../../itinerario/html/seleccionitinerario.html"; // Redirige si no hay error
        
    });

    //Solicitud AJAX para las cards de las preferencias de categorias
    //se obtiene el id del usuario actual
    let idUsuario=JSON.parse(localStorage.getItem('idUser'));
    consultarIdFormulario().then((idForm) => {
        $.ajax({
            url: "../../formulario/php/PreferenciaCategoriasUsuario.php",
            type: "POST",
            data: {idUsuario : idUsuario, idFormulario : idForm},
            success: (respAX) => {
                let respAjax = JSON.parse(respAX);
                let cardCategoria = "";
                console.log(respAjax);
                //Recorremos el Ajax para que los mostremos en las cards
                respAjax.categorias.forEach((categoria,index)=>{
                    //console.log(index);
                    let info = categoriasInfo[categoria.Nombre] || {
                        imagen: "../../img-categorias/default.jpg",
                        descripcion: "Descripción no disponible."
                    };
                    cardCategoria += `
                            <div class="activity-card" id="Card${formatId(categoria.Nombre)}">
                                <img class="img-categoria" src="${info.imagen}" alt="${categoria.Nombre}">
                                <h3>${categoria.Nombre}</h3>
                                <p>${info.descripcion}</p>
                                <!-- <button class="btn-menos" id="Btn_Quitar${index}" data-nombre="${categoria.Nombre}">Quitar</button> -->
                            </div>
                        `;
                    /**
                            <img src="../../img-categorias/compras.jpg">
                            <p>Descubre mercados, centros comerciales y tiendas únicas.</p>
    
                            <img src="../../img-categorias/culto.jpg">
                            <p>Lugares para reflexionar, conocer templos históricos y vivir tradiciones espirituales.</p>
    
                            <img src="../../img-categorias/cultura.jpg">
                            <p>Sumérgete en la historia y el arte a través de sitios culturales y monumentos.</p>
    
                            <img src="../../img-categorias/educacion.jpg">
                            <p>Explora museos, bibliotecas y centros de aprendizaje locales.</p>
    
                            <img src="../../img-categorias/naturales.jpg">
                            <p>Disfruta de paisajes naturales, parques, playas y reservas ecológicas.</p>
    
                            <img src="../../img-categorias/ocioyentretenimiento.jpg">
                            <p>Diviértete con opciones de vida nocturna, parques temáticos y eventos.</p>
    
    
                    **/
                });
                $("#ContenedorActividades").html(cardCategoria);
                
            },
            error: () => {
                showErrorModal("Error al obtener la seleccion de preferencias")
            },
        });

    }).catch((error) => {
        console.error("Error:", error);
        throw error;
    });
    

    $("#ContenedorActividades").on("click", ".btn-menos", function () {
        let categoria = $(this).attr("data-nombre"); // Alternativa a .data()
        console.log("Categoría seleccionada:", categoria);
        showWarningModal();
        //Verificamos que presiomna el boton de elimnar
        $("#ElimnarCategoria").on("click",function(){
            //Solicitud Ajax
            let idUsuario = JSON.parse(localStorage.getItem("idUser"));

            // Función para consultar el id del formulario
            consultarIdFormulario()
                .then((idForm) => {
                    // Realizar la solicitud para eliminar la categoría
                    $.ajax({
                        url: "../../formulario/php/EliminarCategoriasForm.php",
                        type: "POST",
                        data: { idUsuario: idUsuario, categoria: categoria, idFormulario: idForm },
                        success: (respAX) => {
                            let respAjax = JSON.parse(respAX);
                            console.log(respAjax);

                            if (respAjax.status === "success") {
                                showSuccesModal("Categoría eliminada correctamente.");

                                // Actualización directa: elimina la card sin recargar todas las categorías
                                $(`#Card${formatId(categoria)}`).remove();

                                
                            } else {
                                showErrorModal("No se pudo eliminar la categoría: " + respAjax.message);
                            }
                        },
                        error: () => {
                            showErrorModal("Error al intentar eliminar la categoría.");
                        }
                    });
                })
                .catch((error) => {
                    console.error("Error al obtener el ID del formulario:", error);
                    showErrorModal("Error al procesar la solicitud.");
                });

        });
        //Verificamos si presiona el boton de Aceptar
        $("#CancelarCategoria").on("click",function(){
             // Cerrar el modal
            $("#WarnigModal").hide();
        });

    });
    


});
