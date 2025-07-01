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

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_POST['Consulta'], $_POST['idFormulario'], $_POST['idUsuario'], $_POST['Fechas'])) {
        http_response_code(400); // Solicitud incorrecta
        echo json_encode(["error" => "Parámetros incompletos"]);
        exit();
    }

    $consulta = $_POST['Consulta'];
    $idFormulario = intval($_POST['idFormulario']);
    $idUsuario = intval($_POST['idUsuario']);
    // Separar las fechas por comas y eliminar espacios adicionales
    $fechas = array_map('trim', explode(',', $_POST['Fechas'])); 

    if (empty($fechas) || !is_array($fechas)) {
        http_response_code(400); // Solicitud incorrecta
        echo json_encode(["error" => "Formato de Fechas inválido", "data" => $_POST['Fechas']]);
        exit();
    }
    $response = ["status" => "success", "data" => []]; // Estructura para los resultados

    switch($consulta){
        case 'Comida':
            foreach ($fechas as $dia) {
                // Convertir la fecha de dd-mm-yyyy a yyyy-mm-dd
                $fechaObject = DateTime::createFromFormat('d-m-Y', $dia);
                if (!$fechaObject) {
                    $response["data"][$dia] = [
                        "error" => "Formato de fecha no válido para $dia"
                    ];
                    continue; // Saltar al siguiente día
                }
                $fecha = $fechaObject->format('Y-m-d');

                // Consulta para obtener lugares de comida por día
                $stmt = $conn->prepare(
                    "SELECT Nombre, idLugar, Latitud, Longitud
                    FROM comidasguardados
                    WHERE idFormulario = ? AND Fecha = ?"
                );
                $stmt->bind_param("is", $idFormulario, $fecha);

                if ($stmt->execute()) {
                    $result = $stmt->get_result();
                    $lugaresComida = [];
                    while ($row = $result->fetch_assoc()) {
                        $lugaresComida[] = [
                            "Nombre" => $row['Nombre'],
                            "idLugar" => $row['idLugar'],
                            "Latitud" => $row['Latitud'],
                            "Longitud" => $row['Longitud']
                        ];
                    }
                    $response["data"][$dia] = $lugaresComida;
                } else {
                    $response["data"][$dia] = [
                        "error" => "Error al ejecutar la consulta: " . $stmt->error
                    ];
                }
                $stmt->close();
            }
            break;
        case 'Lugares':
            foreach ($fechas as $dia) {
                // Convertir la fecha de dd-mm-yyyy a yyyy-mm-dd
                $fechaObject = DateTime::createFromFormat('d-m-Y', $dia);
                if (!$fechaObject) {
                    $response["data"][$dia] = [
                        "error" => "Formato de fecha no válido para $dia"
                    ];
                    continue; // Saltar al siguiente día
                }
                $fecha = $fechaObject->format('Y-m-d');

                // Consulta para obtener lugares de comida por día
                $stmt = $conn->prepare(
                    "SELECT Nombre, idLugar, Latitud, Longitud
                    FROM lugaresguardados
                    WHERE idFormulario = ? AND Fecha = ?"
                );
                $stmt->bind_param("is", $idFormulario, $fecha);

                if ($stmt->execute()) {
                    $result = $stmt->get_result();
                    $lugares = [];
                    while ($row = $result->fetch_assoc()) {
                        $lugares[] = [
                            "Nombre" => $row['Nombre'],
                            "idLugar" => $row['idLugar'],
                            "Latitud" => $row['Latitud'],
                            "Longitud" => $row['Longitud']
                        ];
                    }
                    $response["data"][$dia] = $lugares;
                } else {
                    $response["data"][$dia] = [
                        "error" => "Error al ejecutar la consulta: " . $stmt->error
                    ];
                }
                $stmt->close();

            }
           
            // Obtener Fotos
            $sql_fotos = 'SELECT * FROM fotos_lugar';  // 🚀 Seleccionamos solo las columnas necesarias
            $stmt = $conn->prepare($sql_fotos);
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                if ($result) {
                    $fotos = [];
                    while ($row = $result->fetch_assoc()) {
                        $fotos[] = $row;
                    }
                    $response['Fotos'] = $fotos;
                } else {
                    $response['Fotos'] = ["error" => "No se encontraron fotos"];
                }
            } else {
                $response['Fotos'] = ["error" => "Error al obtener las fotos: " . $stmt->error];
            }
            $stmt->free_result();
            $stmt->close();
            break;
            case 'Transporte':
                // Consulta para obtener el tipo de transporte asociado al formulario
                $stmt = $conn->prepare(
                    "SELECT tipoTransporte
                    FROM formulario
                    WHERE idFormulario = ?"
                );
            
                $stmt->bind_param("i", $idFormulario);
            
                if ($stmt->execute()) {
                    $result = $stmt->get_result();
            
                    if ($row = $result->fetch_assoc()) {
                        $transporte = $row['tipoTransporte']; // Asignar el tipo de transporte
                    } else {
                        $response["data"][$dia] = [
                            "error" => "No se encontraron datos para el formulario con ID $idFormulario."
                        ];
                    }
            
                    // Agregar transporte a la respuesta del día correspondiente
                    $response["data"]["transporte"] = $transporte ?? "No disponible";
                } else {
                    $response["data"]["transporte"] = [
                        "error" => "Error al ejecutar la consulta: " . $stmt->error
                    ];
                }
                $stmt->close();
            
                break;
            
        
        default:
            http_response_code(400); // Solicitud incorrecta
            $response = ["status" => "error", "message" => "Tipo de consulta no válido"];
            break;
    }

   
    // Enviar respuesta JSON
    echo json_encode($response);
} else {
    http_response_code(405); // Método no permitido
    echo json_encode(["error" => "Método no permitido"]);
}
?>
