<?php
// Conexión a la base de datos
include "../../BasedeDatos/php/Conexion_base_datos.php";
set_time_limit(600);  // Aumenta el límite de tiempo de ejecución a 300 segundos (5 minutos)

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

// Comprobar si se recibieron los datos
if (!isset($_POST['lugares'])) {
    echo json_encode(["error" => "No se recibieron datos"]);
    exit();
}

// Decodificar el JSON recibido
$lugares = json_decode($_POST['lugares'], true);

// Verificar si el JSON es válido
if (!is_array($lugares)) {
    echo json_encode(["error" => "Formato de datos incorrecto"]);
    exit();
}

// Preparar la consulta para insertar los lugares
$query = "INSERT IGNORE INTO lugares (id, nombre, latitud, longitud, categoria_nombre, categoria_id, sub_categoria_nombre, sub_categoria_id, valor_sub_categoria, direccion, rating, precio) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(["error" => "Error en la preparación de la consulta: " . $conn->error]);
    exit();
}

// Preparar consulta para insertar las fotos
$photoQuery = "INSERT INTO fotos_lugar (lugar_id, foto_url) VALUES (?, ?)";
$photoStmt = $conn->prepare($photoQuery);
if (!$photoStmt) {
    echo json_encode(["error" => "Error en la preparación de la consulta de fotos: " . $conn->error]);
    exit();
}

// Iniciar transacción para optimizar inserciones
$conn->begin_transaction();

try {
    foreach ($lugares as $lugar) {
        
        // Insertar el lugar en la base de datos, incluyendo la descripción generada
        $stmt->bind_param("ssddssssssdd", 
            $lugar['id'], 
            $lugar['nombre'], 
            $lugar['latitud'], 
            $lugar['longitud'], 
            $lugar['Nombrecategoria'], 
            $lugar['idCategoria'], 
            $lugar['NombreSub'], 
            $lugar['idSub'], 
            $lugar['idValorSub'], 
            $lugar['direccion'],
            $lugar['rating'],
            $lugar['precio']
            
        );
        $stmt->execute();
        
        // Aquí puedes agregar lógica para insertar las fotos si es necesario
        // foreach ($lugar['fotos'] as $foto) {
        //     $photoStmt->bind_param("ss", $lugar['id'], $foto);
        //     $photoStmt->execute();
        // }
    }

    // Confirmar transacción
    $conn->commit();
    echo json_encode(["success" => "Lugares y fotos guardados con éxito"]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["error" => "Error en la transacción: " . $e->getMessage()]);
}

// Cerrar la conexión
$stmt->close();
$photoStmt->close();
$conn->close();
?>
