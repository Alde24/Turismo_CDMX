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

header("Content-Type: application/json"); // Configura el encabezado para JSON

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['Consulta']) || !isset($_POST['idFormulario'])) {
        http_response_code(400); // Solicitud incorrecta
        echo json_encode(["error" => "Parámetros incompletos"]);
        exit();
    }

    $consulta = $_POST['Consulta'];
    $idFormulario = intval($_POST['idFormulario']);
    $response = []; // Estructura para almacenar los resultados
    switch ($consulta) {
        case 'Fechas':
            $stmt = $conn->prepare("SELECT FechaIni, FechaFin FROM formulario WHERE idFormulario = ?");
            $stmt->bind_param("i", $idFormulario);
            if ($stmt->execute()) {
                $stmt->bind_result($fechaIni, $fechaFin);
                if ($stmt->fetch()) {
                    $response['Fechas'] = [
                        "FechaInicio" => $fechaIni,
                        "FechaFin" => $fechaFin,
                    ];
                } else {
                    $response['Fechas'] = ["error" => "No se encontraron resultados para las fechas"];
                }
            } else {
                $response['Fechas'] = ["error" => "Error al ejecutar la consulta de fechas"];
            }
            $stmt->close();
            break;

        case 'Lugares':
            $stmt = $conn->prepare("SELECT idLugar, nombre FROM lugares WHERE idFormulario = ?");
            $stmt->bind_param("i", $idFormulario);
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                $lugares = [];
                while ($row = $result->fetch_assoc()) {
                    $lugares[] = $row;
                }
                $response['Lugares'] = $lugares;
            } else {
                $response['Lugares'] = ["error" => "Error al ejecutar la consulta de lugares"];
            }
            $stmt->close();
            break;

        case 'Hospedaje':
            $stmt = $conn->prepare("SELECT nombre, direccion FROM hospedaje WHERE idFormulario = ?");
            $stmt->bind_param("i", $idFormulario);
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                $hospedajes = [];
                while ($row = $result->fetch_assoc()) {
                    $hospedajes[] = $row;
                }
                $response['Hospedaje'] = $hospedajes;
            } else {
                $response['Hospedaje'] = ["error" => "Error al ejecutar la consulta de hospedaje"];
            }
            $stmt->close();
            break;
        
        case 'ActualizarTransporte':
            //Verificamos si no vienen vacios los campos
            if (!isset($_POST['tipoTransporte'])) {
                http_response_code(400); // Solicitud incorrecta
                echo json_encode(["error" => "Parámetros incompletos"]);
                exit();
            }
            $tipoTransporte = $_POST['tipoTransporte'];
            //Preparamos la consulta
            $stmt = $conn->prepare("UPDATE formulario SET tipoTransporte = ?  WHERE idFormulario = ?");
            $stmt->bind_param("si", $tipoTransporte,$idFormulario);
            if($stmt ->execute()){
            
                $response = ["success" => "Actualizacion de transporte correcta"];
            }else{
                $response = ["error" => "Error al ejecutar la actualizacion de transporte"];
            }
            $stmt->close();
            break;
        case 'ActualizarPrioridadTransporte':
                //Verificamos si no vienen vacios los campos
                if (!isset($_POST['prioridadTransporte'])) {
                    http_response_code(400); // Solicitud incorrecta
                    echo json_encode(["error" => "Parámetros incompletos"]);
                    exit();
                }
                $prioridadTransporte = $_POST['prioridadTransporte'];
                //Preparamos la consulta
                $stmt = $conn->prepare("UPDATE formulario SET prioridadTransporte = ?  WHERE idFormulario = ?");
                $stmt->bind_param("ii", $prioridadTransporte,$idFormulario);
                if($stmt ->execute()){
                
                    $response = ["success" => "Actualizacion de transporte correcta"];
                }else{
                    $response = ["error" => "Error al ejecutar la actualizacion de transporte"];
                }
                $stmt->close();
                break;
        default:
            $response['error'] = "Tipo de consulta no válido";
    }
    // Enviar respuesta JSON
    echo json_encode($response);
    // Cerrar la conexión
    $conn->close();


} else {
    http_response_code(405); // Método no permitido
    echo json_encode(["error" => "Método no permitido"]);
    // Cerrar la conexión
    $conn->close();

}
?>
