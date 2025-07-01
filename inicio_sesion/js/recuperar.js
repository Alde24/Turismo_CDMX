// Función para mostrar el modal con un mensaje personalizado de error
function showErrorModal(message) {
    $("#errorModalBody").text(message); // Inserta el mensaje de error en el cuerpo del modal
    $("#exampleModal").modal("show"); // Muestra el modal de error
}

// Función para mostrar el modal con un mensaje personalizado de éxito
function showSuccesModal(message) {
    $("#modalMessage").text(message); // Inserta el mensaje en el párrafo específico
    $("#succesModal").modal("show"); // Muestra el modal de éxito
}

function showLoadingModal() {
    $("#loadingMessage").removeClass("d-none").addClass("d-flex");
}
function unshowLoadingModal() {
    $("#loadingMessage").addClass("d-none").removeClass("d-flex");
}

$(document).ready(() => {
    $("#recoveryForm").on("submit", function (e) {
        e.preventDefault(); // Evita el envío normal del formulario
        showLoadingModal();
        
        // Obtiene los datos del formulario
        const email = $("#email").val();

        // Realiza la solicitud AJAX
        $.ajax({
            type: "POST",
            url: "../php/recuperar_contrasena.php",
            data: { email: email },
            dataType: "json",
            success: function (response) {
                if (response.error) {
                    unshowLoadingModal();
                    showErrorModal(response.error); // Envía el mensaje de error al modal
                } else if (response.message) {
                    unshowLoadingModal();
                    showSuccesModal(response.message); // Envía el mensaje de éxito al modal
                }
            },
            error: function () {
                unshowLoadingModal();
                showErrorModal("Ocurrió un error inesperado. Inténtelo de nuevo más tarde."); // Muestra un mensaje de error por defecto
            },
        });
    });
});

//if (isRegistered) {
//    showSuccesModal("Un código de verificación ha sido enviado a tu correo. Por favor ingresa a tu correo para recuperar tu cuenta.");
//} else {
    // Mostrar mensaje de error si el correo no está registrado
    //showErrorModal("El correo ingresado no está en el sistema")
//}