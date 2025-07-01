// Función para el Modal para mensaje emergente
function showErrorModal(message) {
    $("#errorModalBody").text(message); // Inserta el mensaje de error en el cuerpo del modal
    $("#exampleModal").modal("show"); // Muestra el modal
}
// Mostrar y ocultar las contraseñas con el ícono de "ojo"
$('.toggle-password').on('click', function () {
    const input = $(this).prev();
    const isPassword = input.attr('type') === 'password';
    input.attr('type', isPassword ? 'text' : 'password');
    $(this).toggleClass('bi-eye bi-eye-slash-fill');
});
/*  const apiURL = "https://restcountries.com/v3.1/all";
    const selectPais = $('#selectPais');
    const flagIcon = $('#flagIcon');
    const ladaInput = $('#lada');

async function cargarPaises() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        selectPais.empty();
        selectPais.append('<option value="">Selecciona un país</option>');

        const paisesOrdenados = data.sort((a, b) => a.name.common.localeCompare(b.name.common));

        paisesOrdenados.forEach(pais => {
            const option = $('<option></option>');
            const lada = pais.idd.root ? ${pais.idd.root}${pais.idd.suffixes ? pais.idd.suffixes[0] : ''} : 'N/A';
            const banderaURL = pais.flags.png;
            option.val(lada); // Establece el código de marcación como valor
            option.data('flag', banderaURL); // Guarda la URL de la bandera en los datos de la opción
            option.text(${pais.name.common}); // Texto de la opción
            selectPais.append(option);
        });
    } catch (error) {
        console.error("Error al cargar los países:", error);
        selectPais.empty();
        selectPais.append('<option value="">Error al cargar países</option>');
    }
}*/

$(document).ready(function() {
    // Función para redirigir después de mostrar la confirmación
    function redirectToLogin() {
        window.location.href = "../html/login.php";
    }

    // Función para mostrar el modal de confirmación
    function showConfirmationModal() {
        $("#confirmationModal").modal("show");
    }
    function showLoadingModal() {
        $("#loadingMessage").removeClass("d-none").addClass("d-flex");
    }
    function unshowLoadingModal() {
        $("#loadingMessage").addClass("d-none").removeClass("d-flex");
    }
/*  cargarPaises();

    // Muestra el código de marcación y la bandera cuando cambia el país
    selectPais.on("change", function() {
        const selectedOption = $(this).find("option:selected");
        const lada = selectedOption.val();
        const banderaURL = selectedOption.data('flag');
        
        // Actualiza el campo de lada y muestra la bandera
        ladaInput.val(lada);
        if (banderaURL) {
            flagIcon.attr("src", banderaURL).show();
        } else {
            flagIcon.hide(); // Oculta la bandera si no hay URL
        }
    });*/

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
            errors.push("Debe tener entre 8 y 16 caracteres.");
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
            }
        } else {
            $("#confirmPasswordError").show().text("Las contraseñas deben coincidir."); // Oculta el error mientras se escribe
        }
    });

    /*// Validación en tiempo real para el campo de teléfono
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
    });*/

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

    // Validación general al enviar el formulario
    $("form").on("submit", function(e) {
        e.preventDefault(); // Evita el envío predeterminado del formulario
        showLoadingModal();

        if ($(".text-danger:visible").length > 0) {
            showErrorModal("Ocurrió un error inesperado. Corrige los errores en el formulario.");
            return;
        }

        const password = $("#password").val();
        const confirmPassword = $("#confirm_password").val();
        if (password !== confirmPassword) {
            $("#confirmPasswordError").show().text("Las contraseñas deben coincidir.");
            return;
        }
        

        $.ajax({
            type: "POST",
            url: "../../inicio_sesion/php/signup.php", // Cambia esta ruta a la URL correcta de tu archivo PHP
            data: $(this).serialize(),
            dataType: "json",
            success: function(response) {
                if (response.success) {
                    localStorage.setItem('idUser', JSON.stringify(response.idUser));
                    // Oculta el mensaje de carga
                    unshowLoadingModal();
                    showConfirmationModal();
                    setTimeout(redirectToLogin, 3500); // Redirige después de 3 segundos
                } else if (response.error) {
                    unshowLoadingModal();
                    showErrorModal(response.error);
                }
            },
            error: function(xhr, status, error) {
                unshowLoadingModal();
                showErrorModal("Ocurrió un error al enviar el formulario. Intente de nuevo.");
                console.error("Estado:", status);
                console.error("Error:", error);
                console.error("Respuesta del servidor:", xhr.responseText);
                showErrorModal("Ocurrió un error al enviar el formulario. Intente de nuevo.");
            }
        });
    });
});