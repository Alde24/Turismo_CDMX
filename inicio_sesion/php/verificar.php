<?php
// Incluir la conexión a la base de datos
date_default_timezone_set('America/Mexico_City'); // Ajustar la zona horaria
include '../../BasedeDatos/php/Conexion_base_datos.php';  

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    // Buscar al usuario en la base de datos con el token proporcionado
    $sql = "SELECT idUsuario, email, verificado, token_verificacion_exp FROM usuario WHERE token = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param('s', $token);  // Vincular el token
        $stmt->execute();
        $stmt->store_result();
        $current_time = date('Y-m-d H:i:s'); // Hora actual

        // Verificar si el token existe
        if ($stmt->num_rows > 0) {
            $stmt->bind_result($idUsuario, $email, $verificado, $token_exp);
            $stmt->fetch();
            
            // Comprobar si el token ha expirado
            if ($current_time > $token_exp) {
                header("Location: /ADS_Turismo404/inicio_sesion/html/expirado.html");
                exit;
            } else {
                //echo "El enlace de verificación ha expirado. Solicita uno nuevo.";
                if ($verificado == 0) {
                    // Si el usuario no está verificado, marcarlo como verificado
                    $update_sql = "UPDATE usuario SET verificado = 1 WHERE idUsuario = ?";
                    if ($update_stmt = $conn->prepare($update_sql)) {
                        $update_stmt->bind_param('i', $idUsuario);
                        if ($update_stmt->execute()) {
                            echo json_encode(["message" => "¡Cuenta verificada con éxito! Puedes iniciar sesión ahora."]);
                            //echo "¡Cuenta verificada con éxito! Puedes iniciar sesión ahora.";
                        } else {
                            echo json_encode(["error" => "Error al verificar la cuenta. Inténtalo nuevamente."]);
                            //echo "Error al verificar la cuenta. Inténtalo nuevamente.";
                        }
                        $update_stmt->close();
                    }
                } else {
                    echo json_encode(["message" => "Esta cuenta ya ha sido verificada."]);
                    //echo "Esta cuenta ya ha sido verificada.";
                }
            }
        } else {
            header("Location: /ADS_Turismo404/inicio_sesion/html/expirado.html");
            exit;
        }
        $stmt->close();
    } else {
        echo json_encode(["error" => "Error en la consulta de verificación."]);
        //echo "Error en la consulta de verificación.";
    }
} else {
    echo json_encode(["error" => "No se recibió el token."]);
    //echo "No se recibió el token.";
}

$conn->close();
?>
