// Función para actualizar el contador de notificaciones no leídas
function updateUnreadCount() {
    const unreadNotifications = document.querySelectorAll('.notification:not(.read)').length;
    document.getElementById('unread-count').innerText = `No leídas: (${unreadNotifications})`;
}

// Al cargar la página, configura el evento de clic en cada notificación
document.querySelectorAll('.notification').forEach(notification => {
    notification.addEventListener('click', function () {
        // Solo realiza cambios si la notificación no ha sido leída
        if (!notification.classList.contains('read')) {
            notification.classList.add('read'); // Añade la clase 'read'
            notification.querySelector('.status-indicator').style.backgroundColor = 'rgb(184, 184, 184)'; // Cambia el color del indicador
            notification.style.backgroundColor = '#f0f0f0'; // Cambia el fondo de la notificación
            updateUnreadCount(); // Actualiza el contador de no leídas
        }
    });
});

// Llama a la función de actualización del contador al cargar la página
updateUnreadCount();

function goBack() {
    window.history.back();
}