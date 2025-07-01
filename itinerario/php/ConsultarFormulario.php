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
            
                error_reporting(E_ALL);
                ini_set('display_errors', 1);
            
                // Obtener Fechas
                $stmt = $conn->prepare("SELECT FechaIni, FechaFin FROM formulario WHERE idFormulario = ?");
                $stmt->bind_param("i", $idFormulario);
                if ($stmt->execute()) {
                    $stmt->bind_result($fechaIni, $fechaFin);
                    if ($stmt->fetch()) {
                        $response['Fechas'] = ["FechaInicio" => $fechaIni, "FechaFin" => $fechaFin];
                    } else {
                        $response['Fechas'] = ["error" => "No se encontraron resultados para las fechas"];
                    }
                } else {
                    $response['Fechas'] = ["error" => "Error al ejecutar la consulta de fechas: " . $stmt->error];
                }
                $stmt->close();
            
                // Obtener Lugares
                $sql_lugares = 'SELECT * FROM lugares';
                $stmt = $conn->prepare($sql_lugares);
                if ($stmt->execute()) {
                    $result = $stmt->get_result();
                    $lugares = [];
                    while ($row = $result->fetch_assoc()) {
                        $lugares[] = $row;
                    }
                    $response['LugaresBaseDatos'] = $lugares;
                } else {
                    $response['LugaresBaseDatos'] = ["error" => "Error al obtener los lugares: " . $stmt->error];
                }
                $stmt->free_result();
                $stmt->close();
            
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

        case 'Destinos':
            $stmt = $conn->prepare("SELECT IdLugarDestino, Fecha, nombre, LatDestino, LongDestino, EsDestino FROM fechasdestinos WHERE idFormulario = ?");
            $stmt->bind_param("i", $idFormulario);
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                $destinos = [];
                while ($row = $result->fetch_assoc()) {
                    $destinos[] = $row;
                }
                $response['Destinos'] = $destinos;
            } else {
                $response['Destinos'] = ["error" => "Error al ejecutar la consulta de lugares"];
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
        
        case 'Transporte':
            $stmt = $conn->prepare("SELECT prioridadTransporte,  tipoTransporte FROM formulario WHERE idFormulario = ?");
            $stmt->bind_param("i", $idFormulario);
            if($stmt ->execute()){
                $stmt->bind_result($prioridadTransporte, $tipoTransporte);
                if ($stmt->fetch()) {
                    $response['Transporte'] = [
                        "Prioridad" => $prioridadTransporte,
                        "Tipo" => $tipoTransporte,
                    ];
                } else {
                    $response['Transporte'] = ["error" => "No se encontraron resultados para el transporte"];
                }
            }else{
                $response['Transporte'] = ["error" => "Error al ejecutar la consulta de transporte"];
            }
            $stmt->close();
            break;
        case 'parametrosActividades':
            $stmt = $conn->prepare("SELECT idFormulario, prioridadActividades, preferenciaDistancia, parametroActividades FROM formulario WHERE idFormulario = ?");
            $stmt->bind_param("i", $idFormulario);
            if($stmt ->execute()){
                // Obtener el resultado de la consulta
                $result = $stmt->get_result();
                // Convertir el resultado en un arreglo asociativo
                $resForm = $result->fetch_all(MYSQLI_ASSOC);
                if ($resForm){
                    $response['respForm'] = $resForm;
                    //asociar las preferencias (categorias y subcategorias)
                    $stmtcategorias = $conn->prepare("
                        SELECT p.idCategorias, c.Nombre 
                        FROM preferenciascategoriasformulario p
                        INNER JOIN categorias c ON p.idCategorias = c.idCategorias
                        WHERE p.idFormulario = ?
                    ");
                    $stmtcategorias->bind_param("i", $idFormulario);
                    if($stmtcategorias ->execute()){
                        // Obtener el resultado de la consulta
                        $resultCategorias = $stmtcategorias->get_result();
                        // Convertir el resultado en un arreglo asociativo
                        $respCategorias = $resultCategorias->fetch_all(MYSQLI_ASSOC);
                        if($respCategorias){
                            //$response['Categorias'] = $respCategorias;
                            //asociar las subcategorias con su valor buscandolo en la tabla subcategorias
                            $stmtsubcategorias = $conn->prepare("
                            SELECT 
                                ps.idSubCategoria, 
                                s.idValor, 
                                s.idCategorias
                            FROM 
                                preferenciassubCategoriasFormulario ps
                            JOIN 
                                subcategorias s 
                            ON 
                                ps.idSubCategoria = s.idSubCategoria
                            WHERE 
                                ps.idFormulario = ?
                            ");
                            $stmtsubcategorias->bind_param("i", $idFormulario);
                            if ($stmtsubcategorias->execute()) {
                                // Obtener el resultado de la consulta
                                $resultsubCategorias = $stmtsubcategorias->get_result();
                                // Convertir el resultado en un arreglo asociativo
                                $respSubCategorias = $resultsubCategorias->fetch_all(MYSQLI_ASSOC);

                                if ($respSubCategorias) {
                                    // iterar sobre las categorias y añadir las subcategorias correspondientes
                                    //$response['SubCategorias'] = $respSubCategorias;
                                    //se itera sobre cada subcategoria
                                    // Agrupar las subcategorías por idCategorias
                                    $subcategoriasAgrupadas = [];
                                    foreach ($respSubCategorias as $subcategoria) {
                                        $subcategoriasAgrupadas[$subcategoria['idCategorias']][] = $subcategoria;
                                    }

                                    // Asociar las subcategorías agrupadas con las categorías
                                    foreach ($respCategorias as $index => $categoria) {
                                        // Verificar si hay subcategorías para la categoría actual
                                        if (isset($subcategoriasAgrupadas[$categoria['idCategorias']])) {
                                            $respCategorias[$index]['subcategorias'] = $subcategoriasAgrupadas[$categoria['idCategorias']];
                                        } else {
                                            $respCategorias[$index]['subcategorias'] = []; // Inicializar como un array vacío si no hay subcategorías
                                        }
                                    }
                                    $response['Categorias'] = $respCategorias;
                                } else {
                                    $response['SubCategorias'] = ["error" => "No se encontraron subcategorías"];
                                }
                            } else {
                                $response['preferencias'] = ["error" => "Error al ejecutar la consulta de subcategorías"];
                            }
                        }else{
                            $response['Categorias'] = ["error" => "Error al cargar las preferencias de categorias"];
                        }
                    }else{
                        $response['Categorias'] = ["error" => "Error al ejecutar la consulta de categorias"];
                    }

                } else {
                    $response['respForm'] = ["error" => "Error al cargar los parametros de actividades"];
                }
            }else{
                $response['respForm'] = ["error" => "Error al ejecutar la consulta de transporte"];
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
