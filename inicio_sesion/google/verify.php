<?php
require_once '../../BasedeDatos/php/Conexion_base_datos.php'; // Archivo de conexión a la base de datos

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    // Verificar el token en la base de datos
    $query = "SELECT id FROM usuario WHERE token = ? AND verificado = 0";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Si el token es válido, actualizar el estado de verificado
        $query = "UPDATE usuario SET verificado = 1, token = NULL WHERE token = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $token);
        $stmt->execute();

        echo "Cuenta verificada con éxito.";
    } else {
        echo "Enlace de verificación no válido o ya utilizado.";
    }
    $stmt->close();
} else {
    echo "Token no proporcionado.";
}
?>
