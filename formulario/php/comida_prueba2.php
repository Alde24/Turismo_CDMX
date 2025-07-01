<?php
// Incluir el archivo de conexión a la base de datos
include "../../BasedeDatos/php/Conexion_base_datos.php";

// Inicia la sesión
session_start();

// Comprobar si el usuario ha iniciado sesión
if (!isset($_SESSION['email'])) {
    header("Location: ../../inicio_sesion/html/login.html");
    exit();
}

// Recibir los datos del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Obtener datos del formulario
    $prioridadComida = $_POST['prioridadComida'] ?? 0.0;
    $idFormulario = $_POST['idFormulario'] ?? 0;
    $distanciaComida = $_POST['distanciaComida'] ?? 0.0;
    $establecimientoComida = $_POST['establecimientoComida'] ?? [];

    // Convertir valores
    $prioridadComida = intval($prioridadComida);
    $idFormulario = intval($idFormulario);
    $distanciaComida = floatval($distanciaComida);

    // Convertir a categorías de establecimientos (mapping a los tipos de Google Places)
    $tipos_establecimiento = [];
    foreach ($establecimientoComida as $key => $value) {
        switch ($value) {
            case 1:
                $tipos_establecimiento[] = "cafe";  // tipo café
                break;
            case 2:
                $tipos_establecimiento[] = "fast_food_restaurant";  // tipo fast food
                break;
            case 3:
                $tipos_establecimiento[] = "mexican_restaurant";  // tipo restaurante mexicano
                break;
            case 4:
                $tipos_establecimiento[] = "restaurant";  // tipo restaurante
                break;
            case 5:
                $tipos_establecimiento[] = "vegan_restaurant";  // tipo restaurante vegano
                break;
            default:
                // Si se selecciona una opción no válida, no agregar ningún tipo
                break;
        }
    }

    // Insertar en la tabla preferenciaComida
    foreach ($tipos_establecimiento as $tipo) {
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

    // Actualizar la tabla formulario con prioridad y distancia
    $sql_update = "UPDATE formulario SET prioridadComida=?, distanciaComida=? WHERE idFormulario=?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("idi", $prioridadComida, $distanciaComida, $idFormulario);
    if ($stmt_update->execute()) {
        $respAX = array("status" => "success");
    } else {
        $respAX = array("status" => "error", "message" => $stmt_update->error);
    }
    $stmt_update->close();

    // Aquí comenzamos la lógica para calcular el presupuesto restante y almacenar los resultados de Google Places

    // API Key de Google (asegurate de que esté correcta)
    $apiKey = 'AIzaSyA53o3gm2kiJtge5N4U_tc0scEoNLfvIk0';

    // Obtener las coordenadas del destino desde la base de datos
    $sql_coords = "SELECT CoordDestino FROM formulario WHERE idFormulario = ?";
    $stmt_coords = $conn->prepare($sql_coords);
    $stmt_coords->bind_param("i", $idFormulario);
    $stmt_coords->execute();
    $stmt_coords->bind_result($CoordDestino);
    $stmt_coords->fetch();
    $stmt_coords->close();

    // Limpiar las coordenadas de paréntesis y espacios
    $CoordDestino = str_replace(['(', ')', ' '], '', $CoordDestino);
    
    // Obtener el radio de búsqueda (distanciaComida)
    $radio = intval($distanciaComida * 1000); // Convertir km a metros

    // Recorrer las categorías de establecimientos y hacer la búsqueda
    $tipos_establecimiento_str = implode("|", $tipos_establecimiento); // Usar "|" para separar las categorías
    $url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=$CoordDestino&radius=$radio&type=$tipos_establecimiento_str&key=$apiKey";

    // Realizar la consulta cURL a la API de Google Places
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    // Decodificar la respuesta de la API
    $data = json_decode($response, true);

    if (isset($data['results']) && !empty($data['results'])) {
        foreach ($data['results'] as $establecimiento) {
            // Obtener los detalles de cada establecimiento
            $nombre = $establecimiento['name'];
            $direccion = $establecimiento['vicinity'];
            $precio = isset($establecimiento['price_level']) ? $establecimiento['price_level'] : 0;
            $valoracion = isset($establecimiento['rating']) ? $establecimiento['rating'] : 0;
            $descripcion = isset($establecimiento['types']) ? implode(", ", $establecimiento['types']) : 'Descripción no disponible';

            // Determinar el descuento del presupuesto según el precio
            switch ($precio) {
                case 1:
                    $descuento = 100;
                    break;
                case 2:
                    $descuento = 225;
                    break;
                case 3:
                    $descuento = 450;
                    break;
                case 4:
                    $descuento = 800;
                    break;
                default:
                    $descuento = 0;
                    break;
            }

            // Actualizar el presupuesto en la tabla formulario
            $sql_presupuesto = "UPDATE formulario SET presupuesto = presupuesto - ? WHERE idFormulario = ?";
            $stmt_presupuesto = $conn->prepare($sql_presupuesto);
            $stmt_presupuesto->bind_param("di", $descuento, $idFormulario);
            $stmt_presupuesto->execute();
            $stmt_presupuesto->close();

            // Insertar el resultado en la tabla resultados_comida
            $sql_insert_resultado = "INSERT INTO resultados_comida (idFormulario, nombre, direccion, precio, valoracion, descripcion) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt_insert = $conn->prepare($sql_insert_resultado);
            $stmt_insert->bind_param("issdss", $idFormulario, $nombre, $direccion, $precio, $valoracion, $descripcion);
            $stmt_insert->execute();
            $stmt_insert->close();
        }
    }

    // Devolver respuesta
    echo json_encode($respAX);
    $conn->close();
}
?>
