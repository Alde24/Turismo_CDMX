$(document).ready(() => {
    
    // Obtener el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        $.ajax({
            url: `../php/verificartoken.php?token=${token}`,
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.error) {
                    showErrorModal(response.error); // Envía el mensaje de error al modal
                } else if (response.message) {
                    window.location.href = "../html/nuevaContraseña.html"; // Redirige si no hay error
                }
            },
            error: function () {
                showErrorModalToken("Ocurrió un error inesperado. Inténtelo de nuevo más tarde."); // Muestra un mensaje de error por defecto
            },
        });
    } else {
        showErrorModalToken("Token no proporcionado."); // Reemplazar por modal
        // Redirigir a login
        // window.location.href = "localhost/ADS/inicio_sesion/html/login.html";
    }
    $('#BotonError').on('click', function (){
        window.location.href = '../html/recuperar.html'
    });
    
});
