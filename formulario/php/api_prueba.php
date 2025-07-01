<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
include "../../BasedeDatos/php/Conexion_base_datos.php";

// Comprobar si el usuario ha iniciado sesión
if (!isset($_SESSION['email'])) {
    header("Location: ../../inicio_sesion/html/login.html");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recibir los datos del formulario
    $prioridadComida = $_POST['prioridadComida'] ?? 0.0;
    $idFormulario = $_POST['idFormulario'] ?? 0;
    $distanciaComida = $_POST['distanciaComida'] ?? 0.0;
    $establecimientoComida = $_POST['establecimientoComida'] ?? [];

    // Cast y cálculo
    $prioridadComida = intval($prioridadComida);
    $idFormulario = intval($idFormulario);
    $distanciaComida = intval($distanciaComida * 1000);
    $numComp = 0;
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
            if ($stmt2->execute()) {
                $numComp++;
            }
        }
    }

    // Actualizar la tabla formulario
    $sql_update = "UPDATE formulario SET prioridadComida = ?, distanciaComida = ? WHERE idFormulario = ?";
    $stmt = $conn->prepare($sql_update);
    $stmt->bind_param("idi", $prioridadComida, $distanciaComida, $idFormulario);

    if ($stmt->execute()) {
        $respAX = ["status" => "success"];
    } else {
        $respAX = ["status" => "error", "message" => $stmt->error];
    }
    $stmt->close();

    /*
        // Obtener presupuesto entre número de viajeros
            $sql_presupuesto = "SELECT presupuesto / NoViajeros AS presupuesto_por_viajero FROM formulario WHERE idFormulario = ?";
            $stmt_presupuesto = $conn->prepare($sql_presupuesto);
            $stmt_presupuesto->bind_param("i", $idFormulario);
            $stmt_presupuesto->execute();
            $result_presupuesto = $stmt_presupuesto->get_result();

            if ($result_presupuesto->num_rows > 0) {
                $row = $result_presupuesto->fetch_assoc();
                $presupuesto_por_viajero = $row['presupuesto_por_viajero'];
            } else {
                $presupuesto_por_viajero = 0; // Manejar el caso en que no haya resultados
            }

            $stmt_presupuesto->close();

            
    // Procesar cada destino marcado como EsDestino
    $sql_destinos = "SELECT idFechaDestino, Fecha, latDestino, longDestino FROM fechasdestinos WHERE idFormulario = ? AND EsDestino = 1";
    $stmt1 = $conn->prepare($sql_destinos);
    $stmt1->bind_param("i", $idFormulario);
    $stmt1->execute();
    $result_destinos = $stmt1->get_result();
    $stmt1->close();

    $apiKey = 'AIzaSyA53o3gm2kiJtge5N4U_tc0scEoNLfvIk0';

    while ($destino = $result_destinos->fetch_assoc()) {
        $latitud = $destino['latDestino'];
        $longitud = $destino['longDestino'];
        $fechaDestino = $destino['Fecha'];
        $coordDestino = "$latitud,$longitud";
    
        $url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=$coordDestino&radius=$distanciaComida&type=restaurant&key=$apiKey";
        
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
    
        if (isset($data['results']) && !empty($data['results'])) {
            $contador = 0;
            foreach ($data['results'] as $resultado) {
                // Verificar si el presupuesto por viajero ha terminado
                if ($presupuesto_por_viajero <= 0) {
                    break;  // Rompe el ciclo si el presupuesto ya se agotó
                }
    
                if ($contador >= 5) break;
    
                $nombre = $resultado['name'];
                $direccion = $resultado['vicinity'] ?? null;
                $precio = $resultado['price_level'] ?? null;
                $valoracion = $resultado['rating'] ?? null;
                $descripcion = implode(", ", $resultado['types'] ?? []);
    
                $sql_check_resultado = "SELECT COUNT(*) FROM resultados_comida WHERE idFormulario = ? AND nombre = ? AND direccion = ?";
                $stmt_check = $conn->prepare($sql_check_resultado);
                $stmt_check->bind_param("iss", $idFormulario, $nombre, $direccion);
                $stmt_check->execute();
                $stmt_check->bind_result($count_resultado);
                $stmt_check->fetch();
                $stmt_check->close();
    
                if ($count_resultado == 0 && ($precio === null || $precio <= $prioridadComida / 2)) {
                    // Ajustar a presupuesto
                    switch($precio){
                        case 1:
                            $precio_aprox = 100;
                            $presupuesto_por_viajero -= 100;
                            break;
                        case 2:
                            $precio_aprox = 225;
                            $presupuesto_por_viajero -= 225;
                            break;
                        case 3:
                            $precio_aprox = 500;
                            $presupuesto_por_viajero -= 500;
                            break;
                        case 4:
                            $precio_aprox = 750;
                            $presupuesto_por_viajero -= 750;
                            break;
                    }
    
                    // Asegurarse de que no se exceda el presupuesto antes de insertar
                    if ($presupuesto_por_viajero < 0) {
                        break;  // Romper el ciclo si el presupuesto es insuficiente
                    }
    
                    $sql_insert_result = "INSERT INTO resultados_comida (idFormulario, nombre, direccion, precio, valoracion, descripcion, fechaDestino, precio_aprox) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    $stmt_result = $conn->prepare($sql_insert_result);
                    $stmt_result->bind_param("isssdssi", $idFormulario, $nombre, $direccion, $precio, $valoracion, $descripcion, $fechaDestino, $precio_aprox);
                    
                    if ($stmt_result->execute()) {
                        $contador++;
                    }
    
                    // Cerrar el statement después de usarlo
                    $stmt_result->close();
                }
            }
        }
    }
    */
    echo json_encode(["status" => "success", "message" => "Datos procesados correctamente."]);
    $conn->close();
    
}
?>
