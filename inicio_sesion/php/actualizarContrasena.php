<?php
// Configuración de la base de datos
include "../../BasedeDatos/php/Conexion_base_datos.php";
session_start();
header("Content-Type: application/json"); // Configura el encabezado para JSON


// Verificar si se ha enviado el formulario para actualizar la contraseña
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];
        $password = $_POST['password'];

        // Cifrar la nueva contraseña antes de almacenarla
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Actualizar la contraseña en la base de datos
        $sql = "UPDATE usuario SET password = ?, token_password = NULL, token_password_expiracion = NULL WHERE idUsuario = ?";
        $stmt = $conn->prepare($sql);
        
        if ($stmt === false) {
            echo json_encode(["error" => "Error en la preparación de la consulta para actualizar: " . $conn->error]);
            exit;
        }

        $stmt->bind_param("si", $hashed_password, $user_id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Contraseña actualizada correctamente."]);
            unset($_SESSION['user_id']);
        } else {
            echo json_encode(["error" => "Error al actualizar la contraseña."]);
        }
    } else {
        echo json_encode(["error" => "Sesión expirada o no válida. Vuelve a solicitar el enlace de recuperación."]);
    }
}

// Cerrar la conexión
$conn->close();

?>

