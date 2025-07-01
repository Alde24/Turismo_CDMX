$(document).ready(() => {
    function showSuccesModal(message) {
        $("#modalMessage").text(message); // Inserta el mensaje de error en el cuerpo del modal
        $("#succesModal").modal("show"); // Muestra el modal
    }
    // Obtener el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        $.ajax({
            url: `../php/verificar.php?token=${token}`,
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.error) {
                    showErrorModal(response.error); // Envía el mensaje de error al modal
                } else if (response.message) {
                    showSuccesModal(response.message);
                }
            },
            error: function () {
                showErrorModal("Ocurrió un error inesperado. Inténtelo de nuevo más tarde."); // Muestra un mensaje de error por defecto
            },
        });
    } else {
        showErrorModal("Token no proporcionado."); // Reemplazar por modal
        // Redirigir a login
        // window.location.href = "localhost/ADS/inicio_sesion/html/login.html";
    }
    $('#BotonError').on('click', function (){
        window.location.href = '../html/login.php'
    });
    $('#btn_conf').on('click', function (){
        window.location.href = '../html/login.php'
    });
    
});
