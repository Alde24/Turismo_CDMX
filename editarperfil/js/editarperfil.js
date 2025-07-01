// Función para el Modal para mensaje emergente
function showErrorModal(message) {
    $("#errorModalBody").text(message); // Inserta el mensaje de error en el cuerpo del modal
    $("#exampleModal").modal("show"); // Muestra el modal
}
// Función para el Modal para mensaje emergente
function showSuccesModal(message) {
    return new Promise((resolve) => {
        $("#confirmModalBody").text(message);
        $("#confirmationModal").modal("show");

        // Limpiar eventos anteriores
        $("#confirmationModal .btn-close, #confirmationModal .btn").off("click");

        // Capturar el cierre del modal
        $("#confirmationModal .btn-close, #confirmationModal .btn").on("click", function () {
            resolve(); // Resolver la promesa cuando se cierra el modal
            $("#confirmationModal").modal("hide");
        });
    });
}
function showPreguntaModal() {
    return new Promise((resolve) => {
        // Mostrar el modal
        $("#preguntaModal").modal("show");
        
        // Capturar clic en el botón "Aceptar"
        $("#preguntaModal .btn-primary").on("click", function () {
            resolve(true); // El usuario confirmó
            $("#preguntaModal").modal("hide"); // Ocultar el modal
        });

        // Capturar clic en el botón "Cancelar"
        $("#preguntaModal .btn-secondary").on("click", function () {
            resolve(false); // El usuario canceló
            $("#preguntaModal").modal("hide"); // Ocultar el modal
        });
    });
}
$(document).ready(() => {
    $("#deactivateAccountButton").on("click", () => {
        showPreguntaModal().then((isConfirmed) => {
            if (isConfirmed) {
                // Realiza la solicitud al servidor
                $.post("../php/eliminarCuenta.php", { action: "delete" })
                    .done((response) => {
                        if (response.includes("Cuenta eliminada exitosamente")) {
                            showSuccesModal("Tu cuenta ha sido desactivada correctamente. Esperamos volver a verte.").then(() => {
                                    window.location.href = "../../index.php"; // Redirige al inicio
                                });
                        } else {
                            showErrorModal("Hubo un problema al eliminar la cuenta");
                        }
                    })
                    .fail(() => {
                        showErrorModal("No se pudo procesar la solicitud");
                    });
            } else {
                console.log("El usuario canceló la acción.");
            }
        });
    });

    // Validación del nombre
    $("#nombre").on("input", function() {
        if (/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test($(this).val())) {
            $("#nombreError").hide();
        } else {
            $("#nombreError").show().text("Solo puede contener letras.");
        }
    });

    // Validación del apellido
    $("#apellido").on("input", function() {
        if (/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test($(this).val())) {
            $("#apellidoError").hide();
        } else {
            $("#apellidoError").show().text("Solo puede contener letras.");
        }
    });

    // Validación del correo electrónico
    $("#email").on("blur", function() {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($(this).val())) {
            $("#emailError").hide();
        } else {
            $("#emailError").show().text("Por favor, ingresa un correo electrónico válido.");
        }
    });

        // Validación en tiempo real de la contraseña
        $("#password").on("input", function() {
            const password = $(this).val();
            const errors = [];
    
            if (!/[A-Z]/.test(password)) {
                errors.push("Debe contener al menos una letra mayúscula.");
            }
            if (!/\d/.test(password)) {
                errors.push("Debe contener al menos un número.");
            }
            if (!/[@$!%*?&#&-]/.test(password)) {
                errors.push("Debe contener al menos un carácter especial.");
            }
            if (password.length < 8 || password.length > 16) {
                errors.push("Debe tener entre 8 y 16 carácteres.");
            }
    
            if (errors.length === 0) {
                $("#passwordError").hide();
            } else {
                $("#passwordError").show().html(errors.join("<br>"));
            }
        });
    
        // Confirmación de la contraseña
        $("#confirm_password").on("input", function() {
            const password = $("#password").val();
            const confirmPassword = $(this).val();
    
            // Solo valida cuando el campo de confirmación tiene la misma longitud que el campo de contraseña
            if (confirmPassword.length >= password.length) {
                if (confirmPassword === password) {
                    $("#confirmPasswordError").hide();
                } else {
                    $("#confirmPasswordError").show().text("Las contraseñas deben coincidir.");
                    //showErrorModal("Corrige el siguiente error: Las contraseñas deben coincidir.");
                }
            } else {
                $("#confirmPasswordError").hide(); // Oculta el error mientras se escribe
            }
        });

        // Validación en tiempo real para el campo de teléfono
    $("#phone").on("input", function() {
        this.value = this.value.replace(/\D/g, ''); // Eliminar letras
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10); // Limitar a diez dígitos
        }
    }).on("blur", function(){
        if (iti.isValidNumber() && this.value.length === 10) {
            $("#phoneError").hide();
        } else {
            $("#phoneError").show().text("Número invalido, debe contener 10 dígitos.");
        }
    });

    // Validación de la fecha de nacimiento (entre 18 y 85 años)
    $("#fecha_nacimiento").on("blur", function() {
        const birthdate = new Date($(this).val());
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        if (today < new Date(birthdate.setFullYear(birthdate.getFullYear() + age))) age--;
        if (age >= 18 && age < 85) {
            $("#birthdateError").hide();
        } else {
            $("#birthdateError").show().text("La edad debe ser mayor a 18 y menor a 85 años.");
        }
    });

    // Validación del género
    $("#genero").on("change", function() {
        if ($(this).val() !== "") {
            $("#generoError").hide();
        } else {
            $("#generoError").show().text("Por favor, selecciona tu género.");
        }
    });

    // Validación en tiempo real para el campo de teléfono
    $("#phone").on("input", function() {
        this.value = this.value.replace(/\D/g, ''); // Eliminar letras
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10); // Limitar a diez dígitos
        }
    }).on("blur", function(){
        if (this.value.length === 10 && iti.isValidNumber()) {
            $("#phoneError").hide();
        } else {
            $("#phoneError").show().text("Número inválido, debe contener 10 dígitos.");
        }
    }).on("focus", function() {
        $("#phoneError").hide(); // Oculta el error mientras el usuario está ingresando el número
    });

    // Validación de la fecha de nacimiento (entre 18 y 85 años)
    $("#birthdate").on("blur", function() {
        const birthdate = new Date($(this).val());
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        if (today < new Date(birthdate.setFullYear(birthdate.getFullYear() + age))) age--;
        if (age >= 18 && age < 85) {
            $("#birthdateError").hide();
        } else {
            $("#birthdateError").show().text("La edad debe ser mayor a 18 y menor a 85 años.");
        }
    });

    // Validación del género
    $("#gender").on("change", function() {
        if ($(this).val() !== "") {
            $("#genderError").hide();
        } else {
            $("#genderError").show().text("Por favor, selecciona tu género.");
        }
    });

    // Validación de la biografía con jQuery
    $("#biografia").on("input", function () {
        const bio = $(this).val();
        const minLength = 10; // Longitud mínima
        const maxLength = 250; // Longitud máxima
        const $errorContainer = $("#biografiaError");

        // Si el texto excede el máximo, recorta a 250 caracteres
        if (bio.length > maxLength) {
            $(this).val(bio.substring(0, maxLength)); // Limita el texto a 250 caracteres
            $errorContainer.text(`La biografía no debe exceder los ${maxLength} caracteres.`).show();
        }
        // Si el texto es más corto que el mínimo, muestra el mensaje de error
        else if (bio.length < minLength) {
            $errorContainer.text(`La biografía debe tener al menos ${minLength} caracteres.`).show();
        }
        // Si la longitud es válida, oculta el mensaje de error
        else {
            $errorContainer.text("").hide();
        }
    });

    
    // Cambiar a sección de preferencias
    $('#editPreferencesButton').on('click', function () {
        $('#formSection').hide(); 
        $('#preferencesSection').show(); 
    });

    // Cambiar a sección de edición de perfil
    $('#editProfileButton').on('click', function () {
        $('#preferencesSection').hide(); 
        $('#formSection').show(); 
    });

    // Cambiar el color de fondo en los botones de preferencia al hacer clic
    $('.preference-button').on('click', function () {
        const selected = $(this).data('selected') === true;
        $(this).css('background-color', selected ? '' : 'lightgreen');
        $(this).data('selected', !selected);
    });

    // Abrir el selector de archivos para editar foto
    $('#editPhotoButton').on('click', function () {
        const input = $('<input type="file" accept="image/*">');
        input.on('change', function () {
            // Aquí puedes manejar la imagen seleccionada
        });
        input.click();
    });

    // Configura la validación de JustValidate
    const validacion = new JustValidate('#Editar_Usuario');

    validacion
        
        .onSuccess((event) => {
            event.preventDefault(); // Evita el envío estándar del formulario

            // Realiza una petición AJAX para enviar el formulario a 'editarperfil.php'
            $.ajax({
                url: 'editarperfil.php',
                type: 'POST',
                data: $('#Editar_Usuario').serialize(), // Envía los datos del formulario serializados
                success: function() {
                    // Muestra un SweetAlert si el cambio fue exitoso
                    showSuccesModal("Cambios guardados exitosamente. Recarga la página para notar tus cambios.");
                    //Swal.fire({
                        //icon: 'success',
                        //title: 'Cambios guardados exitosamente',
                        //showConfirmButton: true,
                        //confirmButtonText: 'OK'
                    //});
                },
                error: function() {
                    // Muestra un SweetAlert de error si algo falla
                    showErrorModal("Hubo un problema al guardar los cambios.");
                    //Swal.fire({
                        //icon: 'error',
                        //title: 'Error',
                        //text: 'Hubo un problema al guardar los cambios.',
                        //showConfirmButton: true,
                        //confirmButtonText: 'OK'
                    //});
                }
            });
        });

        const apiURL = "https://restcountries.com/v3.1/all";
    const selectPais = $('#pais');

    async function cargarPaises() {
        try {
            const response = await fetch(apiURL);
            const data = await response.json();
            selectPais.empty();
            selectPais.append('<option value="">Selecciona un país</option>');
            const paisesOrdenados = data.sort((a, b) => {
                if (a.name.common < b.name.common) {
                    return -1;
                }
                if (a.name.common > b.name.common) {
                    return 1;
                }
                return 0;
            });
            paisesOrdenados.forEach(pais => {
                const option = $('<option></option>'); 
                option.val(pais.name.common);
                option.text(pais.name.common);
                selectPais.append(option); 
            });
        } catch (error) {
            console.error("Error al cargar los países:", error);
            selectPais.empty();
            selectPais.append('<option value="">Error al cargar países</option>');
        }
    }
    //mostrar las preferencias del usuario:
    function consultarPreferencias(){
        //se crea el formulario y así obtenemos el id del usuario que lo creo:
        
            //se obtiene el id del usuario actual
            let idUsuario=JSON.parse(localStorage.getItem('idUser'));
            if(idUsuario !== null){
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url:"../../formulario/php/preferenciasActividades.php",
                        type:"POST",
                        //los datos
                        data: { idUser: idUsuario},
                        success:(respCategorias)=>{
                            let respAjaxCategorias = JSON.parse(respCategorias);
                            console.log(respAjaxCategorias);
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
    }



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
    //funcion que elimina las preferencias guardadas de cierto
    //formulario para despues en otro flujo se inserten las nuevas preferencias
    function eliminarPreferencias(idUsuario) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "../php/eliminarPreferencias.php",
                type: "POST",
                data: {idUser:idUsuario},
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

    cargarPaises();
    //Guardar las preferencias particulares para un formulario en especifico
    document.getElementById("savePreferencesButton").addEventListener("click", function () {
        
        
        //obtener idusuario
        let userId=JSON.parse(localStorage.getItem('idUser'));
           
        //se eliminan las preferencias del usuario para el formulario actual
        //y posteriormente insertar las nuevas preferencias
        eliminarPreferencias(userId).then((resp) => {
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
                    url: "../php/guardarPreferencias.php", // Ruta de tu archivo PHP
                    type: "POST",
                    data: { categorias: datosCategorias, subcategorias: datosSubCategorias, user_id: userId},
                    success: (response) => {
                        //console.log(response);
                        let data = JSON.parse(response);
                        console.log(data);
                        if (data.status === "success") {
                            showSuccesModal("Cambios guardados exitosamente. Recarga la página para notar tus cambios.");
                        } else {
                            showErrorModal("Hubo un problema al guardar tus preferencias.");
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
        
    });

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
            console.log(respAjaxCategorias);
            let preferencias="";

            //hacer una cosnulta con la BD para ver que preferencias estan ya almacenadas:
            //preferenciasCategorias se trata de un arreglo de objetos que a su vez cada objeto tiene asociado
            //otro arreglo que son las subcategorias asociadas a una categoria
            //De esta forma logramos crear el formulario al acceder a la pagina de formulario
            consultarPreferencias().then((preferenciasCategorias) => {
                console.log(preferenciasCategorias);
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

    

});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("preferencesModal");
    const editPreferencesButton = document.getElementById("editPreferencesButton");
    const closeButton = document.querySelector(".close-button");

    // Mostrar el modal
    editPreferencesButton.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    // Ocultar el modal al hacer clic en la "X"
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Ocultar el modal al hacer clic fuera del contenido
    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});

// Función para alternar la visibilidad de subcategorías
function toggleSubcategories(id) {
    const element = document.getElementById(id);
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
    }
}
const selectedCategories = [];
document.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
    selectedCategories.push(checkbox.dataset.id);
});
console.log(selectedCategories); 


