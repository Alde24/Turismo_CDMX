<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

header("Content-Type: application/json"); // Configura el encabezado para JSON

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (empty($_POST['Consulta']) || empty($_POST['idFormulario'])) {
        http_response_code(400); // Solicitud incorrecta
        echo json_encode(["error" => "Parámetros incompletos"]);
        exit();
    }

    $consulta = $_POST['Consulta'];
    $idFormulario = intval($_POST['idFormulario']);
    $response = []; // Estructura para almacenar los resultados

    switch ($consulta) {
        case 'Comida':
            $stmt = $conn->prepare("SELECT nombre, direccion, valoracion, fechaDestino, precio_aprox, idResultado FROM resultados_comida WHERE idFormulario = ?");
            if (!$stmt) {
                http_response_code(500); // Error interno del servidor
                echo json_encode(["error" => "Error en la preparación de la consulta SQL"]);
                exit();
            }

            $stmt->bind_param("i", $idFormulario);

            if (!$stmt->execute()) {
                http_response_code(500); // Error interno del servidor
                echo json_encode(["error" => "Error al ejecutar la consulta de Comida"]);
                exit();
            }

            $stmt->bind_result($nombre, $direccion, $valoracion, $fechaDestino, $precio_aprox, $idResultado);

            // Arreglo para almacenar todos los resultados
            $comidas = [];

            // Iterar sobre todos los resultados
            while ($stmt->fetch()) {
                $comidas[] = [
                    "nombre" => $nombre,
                    "direccion" => $direccion,
                    "valoracion" => $valoracion,
                    "fecha" => $fechaDestino,
                    "precio_aprox" => $precio_aprox ?? 'No disponible',
                    "idResultado" => $idResultado
                ];
            }

            // Si se encontraron resultados, devolverlos; si no, un mensaje de error
            if (!empty($comidas)) {
                $response['Comida'] = $comidas;
            } else {
                $response['Comida'] = ["error" => "No se encontraron resultados para la Comida"];
            }

            $stmt->close();
            break;

        default:
            $response['error'] = "Tipo de consulta no válido";
    }

    // Enviar respuesta JSON
    echo json_encode($response);
} else {
    http_response_code(405); // Método no permitido
    echo json_encode(["error" => "Método no permitido"]);
}
?>
