<?php
# Incluimos el archivo de conexión a la base de datos
include "../../BasedeDatos/php/Conexion_base_datos.php";

// Inicia la sesión
session_start();
// Comprobar si el usuario ha iniciado sesión
if (!isset($_SESSION['email'])) {
    // Si no está iniciada la sesión, redirige a la página de inicio de sesión
    header("Location: ../../inicio_sesion/html/login.html");
    exit();
}

// Recibir los datos del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener datos del formulario
    $prioridadComida = $_POST['prioridadComida'] ?? 0.0;
    $idFormulario = $_POST['idFormulario'] ?? 0;
    $distanciaComida = $_POST['distanciaComida'] ?? 0;
    $establecimientoComida = $_POST['establecimientoComida'] ?? [];
    
    // Cast de los datos
    $prioridadComida = intval($prioridadComida);
    $idFormulario = intval($idFormulario);
    $distanciaComida = intval(floatval($distanciaComida) * 1000); // Convertir a metros
    
    // Insertar en tabla preferenciaComida
    foreach ($establecimientoComida as $tipo) {
        $sql_check = "SELECT COUNT(*) FROM preferenciacomida WHERE idFormulario = ? AND idEstablecimiento = ?";
        $stmt_check = $conn->prepare($sql_check);
        $stmt_check->bind_param("ii", $idFormulario, $tipo);
        $stmt_check->execute();
        $stmt_check->bind_result($count);
        $stmt_check->fetch();
        $stmt_check->close();

        if ($count == 0) {
            $sql_insert = "INSERT INTO preferenciacomida (idFormulario, idEstablecimiento) VALUES (?, ?)";
            $stmt2 = $conn->prepare($sql_insert);
            $stmt2->bind_param("ii", $idFormulario, $tipo);
            $stmt2->execute();
            $stmt2->close();
        }
    }

    // Actualizar la tabla formulario
    $sql_update = "UPDATE formulario SET prioridadComida=?, distanciaComida=? WHERE idFormulario=?";
    $stmt = $conn->prepare($sql_update);
    $stmt->bind_param("idi", $prioridadComida, $distanciaComida, $idFormulario);
    $stmt->execute();
    $stmt->close();

    // Obtener la coordenada del destino
    $sql_select = "SELECT CoordDestino FROM formulario WHERE idFormulario=?";
    $stmt = $conn->prepare($sql_select);
    $stmt->bind_param("i", $idFormulario);
    $stmt->execute();
    $stmt->bind_result($coordDestino);
    $stmt->fetch();
    $stmt->close();

    $coordDestino = str_replace(["(", ")", " "], "", $coordDestino);

    // Filtrar resultados según la prioridad (ranking)
    $rankingMax = $prioridadComida / 2;

    // API Key de Google (reemplazar con la clave real)
    $apiKey = 'AIzaSyA53o3gm2kiJtge5N4U_tc0scEoNLfvIk0';

    // Construir la URL para la consulta
    $tipoEstablecimiento = implode("+", array_map('urlencode', $establecimientoComida));
    $url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=$coordDestino&radius=$distanciaComida&type=restaurant&key=$apiKey";

    // Realizar la consulta cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo json_encode(["status" => "error", "message" => curl_error($ch)]);
        curl_close($ch);
        exit();
    }
    curl_close($ch);

    $data = json_decode($response, true);

    // Verificar si hay resultados y procesarlos
    if (isset($data['results']) && !empty($data['results'])) {
        foreach ($data['results'] as $resultado) {
            $nombre = $resultado['name'];
            $direccion = $resultado['vicinity'] ?? null;
            $precio = $resultado['price_level'] ?? null;
            $valoracion = $resultado['rating'] ?? null;
            $descripcion = implode(", ", $resultado['types'] ?? []);

            if ($valoracion <= $rankingMax) {
                $sql_insert_result = "INSERT INTO resultados_comida (idFormulario, nombre, direccion, precio, valoracion, descripcion) VALUES (?, ?, ?, ?, ?, ?)";
                $stmt_result = $conn->prepare($sql_insert_result);
                $stmt_result->bind_param("isssds", $idFormulario, $nombre, $direccion, $precio, $valoracion, $descripcion);
                $stmt_result->execute();
                $stmt_result->close();
            }
        }
    }

    echo json_encode(["status" => "success", "message" => "Datos procesados correctamente."]);
}
$conn->close();
?>
