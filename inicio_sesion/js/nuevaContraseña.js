// Función para mostrar el modal con un mensaje personalizado de error
function showErrorModal(message) {
    $("#errorModalBody").text(message); // Inserta el mensaje de error en el cuerpo del modal
    $("#exampleModal").modal("show"); // Muestra el modal de error
}

// Función para mostrar el modal con un mensaje personalizado de éxito
function showSuccesModalToken(message) {
    $("#modalMessageToken").text(message); // Inserta el mensaje en el párrafo específico
    $("#succesModalToken").modal("show"); // Muestra el modal de éxito
}

// Función para mostrar el modal con un mensaje personalizado de éxito
function showSuccesModal(message) {
    $("#modalMessage").text(message); // Inserta el mensaje en el párrafo específico
    $("#succesModal").modal("show"); // Muestra el modal de éxito
}

$(document).ready(() => {
    // Mostrar y ocultar las contraseñas con el ícono de "ojo"
    $('.toggle-password').on('click', function () {
        const input = $(this).prev();
        const isPassword = input.attr('type') === 'password';
        input.attr('type', isPassword ? 'text' : 'password');
        $(this).toggleClass('bi-eye bi-eye-slash-fill');
    });

   
    // Inicializar la validación de JustValidate
    const validation = new JustValidate('#PasswordForm');

    validation
        .addField('#password', [
            {
                rule: 'minLength',
                value: 8,
                errorMessage: 'La contraseña debe tener al menos 8 caracteres.'
            },
            {
                rule: 'required',
                errorMessage: 'Este campo es obligatorio.'
            },
            {
                rule: 'customRegexp',
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                errorMessage: 'La contraseña debe incluir al menos una letra minúscula, una mayúscula y un carácter especial.'
            }
        ])
        .addField('#confirm_password',[
            {
                rule: 'required',
                errorMessage: 'Este campo es obligatorio.'
            },
            {
                validator: (value, fields) => {
                    const password = fields['#password'].elem.value.trim();
                    return value.trim() === password;
                },
                errorMessage: 'Las contraseñas no coinciden.'
            }
            
        ])
        
        
        // Validación de formulario antes de enviarlo
        .onSuccess((event) => {
            event.preventDefault(); // Evita el envío estándar del formulario

            // Realiza una petición AJAX para enviar el formulario a 'editarperfil.php'
            $.ajax({
                url: '../php/actualizarContrasena.php',
                type: 'POST',
                data: $('#PasswordForm').serialize(), // Envía los datos del formulario serializados
                success: function (response) {
                    if (response.error) {
                        showErrorModal(response.error); // Envía el mensaje de error al modal
                    } else if (response.message) {
                        showSuccesModal(response.message); // Envía el mensaje de éxito al modal
                    }
                },
                error: function () {
                    showErrorModal("Ocurrió un error inesperado. Inténtelo de nuevo más tarde."); // Muestra un mensaje de error por defecto
                },
            });
        });

    
    $('#btn_conf').on('click', function (){
        window.location.href = '../html/login.php'
    });
});
