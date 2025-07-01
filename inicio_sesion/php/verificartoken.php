<?php
date_default_timezone_set('America/Mexico_City'); // Ajustar la zona horaria
// Configuración de la base de datos
include "../../BasedeDatos/php/Conexion_base_datos.php";
session_start();

header("Content-Type: application/json"); // Configura el encabezado para JSON
// Verificación del token en la solicitud GET
if (isset($_GET['token'])) {
    $token = $_GET['token'];
    $sql = "SELECT idUsuario, token_password_expiracion FROM usuario WHERE token_password = ?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        echo json_encode(["error" => "Error en la preparación de la consulta: " . $conn->error]);
        exit;
        
    }
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $current_time = date('Y-m-d H:i:s');
        if ($current_time < $row['token_password_expiracion']) {
            $_SESSION['user_id'] = $row['idUsuario'];
            echo json_encode(["message" => "Token válido. Procede a restablecer la contraseña."]);
        } else {
            echo json_encode(["error" => "El enlace de recuperación ha expirado. Solicita uno nuevo."]);
        }
    } else {
        echo json_encode(["error" => "El enlace de recuperación ha expirado. Solicita uno nuevo."]);
    }
}
?>