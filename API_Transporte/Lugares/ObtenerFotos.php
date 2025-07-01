<?php 
// Incluir la conexión a la base de datos
include "../../BasedeDatos/php/Conexion_base_datos.php";

// Iniciar sesión
session_start();

// Verificar si el usuario está autenticado
if (!isset($_SESSION['email'])) {
    http_response_code(401); // No autorizado
    echo json_encode(["error" => "Usuario no autenticado"]);
    exit();
}

// Configurar encabezados para respuesta JSON
header("Content-Type: application/json");

// Realizar la consulta SQL
$sql = 'SELECT lugares.id FROM lugares';

// Preparar la consulta
$stmt = $conn->prepare($sql);

if ($stmt) {
    // Ejecutar la consulta
    if ($stmt->execute()) {
        // Obtener los resultados
        $result = $stmt->get_result();
        $datos = [];

        while ($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }

        if (count($datos) > 0) {
            // Respuesta con datos encontrados
            echo json_encode([
                "status" => "success",
                "datos" => $datos
            ]);
        } else {
            // No hay lugares disponibles
            echo json_encode([
                "status" => "error",
                "message" => "No hay lugares disponibles."
            ]);
        }
    } else {
        // Error al ejecutar la consulta
        echo json_encode([
            "status" => "error",
            "message" => "Error al ejecutar la consulta."
        ]);
    }

    // Cerrar la consulta
    $stmt->close();
} else {
    // Error al preparar la consulta
    echo json_encode([
        "status" => "error",
        "message" => "Error al preparar la consulta."
    ]);
}

// Cerrar la conexión
$conn->close();
?>
