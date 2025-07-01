<?php 
// Incluir la conexión a la base de datos
include "../../BasedeDatos/php/Conexion_base_datos.php";

// Iniciar sesión
session_start();

header("Content-Type: application/json"); // Configura el encabezado para JSON

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verificar que los parámetros necesarios estén presentes
    if (!isset($_POST['idUsuario']) || !isset($_POST['idFormulario']) || !isset($_POST['fecha']) || !isset($_POST['lugares'])) {
        http_response_code(400); // Solicitud incorrecta
        echo json_encode(["status" => "error", "message" => "Parámetros incompletos"]);
        exit();
    }

    $idFormulario = intval($_POST['idFormulario']);
    $idUsuario = intval($_POST['idUsuario']);
    $fechaOriginal = strval($_POST['fecha']);
    $categoria = strval($_POST['Categoria']);

    // Convertir la fecha de dd-mm-yyyy a yyyy-mm-dd
    $fechaObject = DateTime::createFromFormat('d-m-Y', $fechaOriginal);
    if (!$fechaObject) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Formato de fecha no válido"]);
        exit();
    }
    $fecha = $fechaObject->format('Y-m-d');

    // Decodificar el JSON de lugares enviado desde el cliente, si existe
    $lugares = isset($_POST['lugares']) ? json_decode($_POST['lugares'], true) : [];

    // Decodificar el JSON de comida enviado desde el cliente, si existe
    $comidas = isset($_POST['comida']) ? json_decode($_POST['comida'], true) : [];

    // Verificar si $lugares y $comidas están vacíos y actuar en consecuencia
    if (empty($lugares)) {
        $lugares = []; // Inicializar como un array vacío si está vacío o no definido
    }

    if (empty($comidas)) {
        $comidas = []; // Inicializar como un array vacío si está vacío o no definido
    }

    switch ($categoria) {
        case 'Lugares':
            // Preparar la consulta SQL
            $stmt = $conn->prepare("INSERT INTO lugaresguardados (idFormulario, Fecha, idLugar, Latitud, Longitud, Nombre) VALUES (?, ?, ?, ?, ?, ?)");
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Error al preparar la consulta"]);
                exit();
            }

            // Inicializar un array para capturar errores
            $errores = [];
            foreach ($lugares as $lugar) {
                // Validar los campos obligatorios de cada lugar
                if (!isset($lugar['id'], $lugar['nombre'], $lugar['latitud'], $lugar['longitud'])) {
                    $errores[] = "Faltan datos para el lugar: " . json_encode($lugar);
                    continue;
                }

                $idLugar = strval($lugar['id']);
                $nombre = strval($lugar['nombre']);
                $latitud = strval($lugar['latitud']);
                $longitud = strval($lugar['longitud']);

                // Enlazar parámetros y ejecutar la consulta
                $stmt->bind_param("isssss", $idFormulario, $fecha, $idLugar, $latitud, $longitud, $nombre);

                if (!$stmt->execute()) {
                    $errores[] = "Error al insertar el lugar: $nombre. Error: " . $stmt->error;
                }
            }
            break;
        case 'Comida':
            // Preparar la consulta SQL
            $stmt = $conn->prepare("INSERT INTO comidasguardados (idFormulario, Fecha, idLugar, Latitud, Longitud, Nombre) VALUES (?, ?, ?, ?, ?, ?)");
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Error al preparar la consulta"]);
                exit();
            }

            // Inicializar un array para capturar errores
            $errores = [];
            foreach ($comidas as $comida) {
                // Validar los campos obligatorios de cada lugar
                if (!isset($comida['id'], $comida['nombre'], $comida['latitud'], $comida['longitud'])) {
                    $errores[] = "Faltan datos para el lugar: " . json_encode($comida);
                    continue;
                }

                $idLugar = strval($comida['id']);
                $nombre = strval($comida['nombre']);
                $latitud = strval($comida['latitud']);
                $longitud = strval($comida['longitud']);

                // Enlazar parámetros y ejecutar la consulta
                $stmt->bind_param("isssss", $idFormulario, $fecha, $idLugar, $latitud, $longitud, $nombre);

                if (!$stmt->execute()) {
                    $errores[] = "Error al insertar el lugar: $nombre. Error: " . $stmt->error;
                }
            }
            break;

        default:
            http_response_code(400); // Solicitud incorrecta
            $response['error'] = "Tipo de consulta no válido";
    }  

    $stmt->close();
    $conn->close();

    // Respuesta al cliente
    if (empty($errores)) {
        echo json_encode(["status" => "success", "message" => "Itinerario guardado correctamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Se encontraron errores al guardar el itinerario", "detalles" => $errores]);
    }
} else {
    http_response_code(405); // Método no permitido
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
}
?>
