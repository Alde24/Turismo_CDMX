<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Conexión a la base de datos
include "../../BasedeDatos/php/Conexion_base_datos.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verificar si se ha enviado el parámetro 'idResultado'
    if (!isset($_POST['idResultado']) || empty($_POST['idResultado'])) {
        http_response_code(400);
        echo json_encode(["error" => "Parámetro 'idResultado' requerido"]);
        exit();
    }

    // Recuperar el valor del parámetro 'idResultado'
    $id = $_POST['idResultado'];

    // Preparar y ejecutar la eliminación
    $stmt = $conn->prepare("DELETE FROM resultados_comida WHERE idResultado = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => "Tarjeta eliminada correctamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error al eliminar la tarjeta"]);
    }

    $stmt->close();
    $conn->close();
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}
?>
