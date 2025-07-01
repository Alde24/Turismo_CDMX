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
    $idUsuario = intval($_POST['idUsuario']);
    $subcategorias = isset($_POST['subcategorias']) ? $_POST['subcategorias'] : null;
    $response = []; // Estructura para almacenar los resultados

    switch ($consulta) {
        case 'Subcategorias':
            // Obtener las subcategorías para un formulario de un usuario específico
            $stmt = $conn->prepare("SELECT subcategorias.idValor FROM subcategorias 
                                    INNER JOIN preferenciassubcategoriasformulario ON preferenciassubcategoriasformulario.idSubCategoria = subcategorias.idSubCategoria 
                                    WHERE idUsuario = ? AND idFormulario = ?");
            $stmt->bind_param("ii", $idUsuario, $idFormulario);
            
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                $subcategorias = $result->fetch_all(MYSQLI_ASSOC);

                $respAX['status'] = "success";
                $respAX['subcategorias'] = $subcategorias;
            } else {
                $respAX['status'] = "error";
                $respAX['message'] = $stmt->error;
            }
            $stmt->close();
            break;

        case 'Categorias':
            // Si 'subcategorias' es un array, procesar cada valor
            if (is_array($subcategorias) && count($subcategorias) > 0) {
                $placeholders = implode(",", array_fill(0, count($subcategorias), "?"));
                $stmt = $conn->prepare("SELECT categorias.Nombre 
                                        FROM categorias 
                                        INNER JOIN subcategorias ON subcategorias.idCategorias = categorias.idCategorias 
                                        WHERE subcategorias.idValor IN ($placeholders)");
                
                // Crear una lista de tipos de datos para el bind_param
                $types = str_repeat("s", count($subcategorias));
                $stmt->bind_param($types, ...$subcategorias);
            } else {
                // Si no se pasa un array de subcategorias, solo tomar una subcategoria
                $stmt = $conn->prepare("SELECT categorias.Nombre 
                                        FROM categorias 
                                        INNER JOIN subcategorias ON subcategorias.idCategorias = categorias.idCategorias 
                                        WHERE subcategorias.idValor = ?");
                $stmt->bind_param("s", $subcategorias);
            }

            if ($stmt->execute()) {
                $result = $stmt->get_result();
                $categorias = $result->fetch_all(MYSQLI_ASSOC);

                $respAX['status'] = "success";
                $respAX['categorias'] = $categorias;
            } else {
                $respAX['status'] = "error";
                $respAX['message'] = $stmt->error;
            }

            $stmt->close();
            break;

            case 'Comida':
                // Consulta para obtener `prioridadComida` y `distanciaComida`
                $stmt = $conn->prepare("SELECT prioridadComida, distanciaComida FROM formulario WHERE idUsuario = ? AND idFormulario = ?");
                $stmt->bind_param("ii", $idUsuario, $idFormulario);
            
                if ($stmt->execute()) {
                    // Procesar resultados de la primera consulta
                    $result = $stmt->get_result();
                    $comidaData = $result->fetch_assoc(); // Obtener los datos
            
                    if ($comidaData) {
                        // Si se encontró el formulario, guardar los resultados iniciales en `$respAX`
                        $respAX['status'] = "success";
                        $respAX['prioridadComida'] = $comidaData['prioridadComida'];
                        $respAX['distanciaComida'] = $comidaData['distanciaComida'];
            
                        // Ahora realizar la consulta para obtener `establecimientoscomida.Tipo`
                        $stmt_establecimientos = $conn->prepare("
                            SELECT establecimientoscomida.Tipo 
                            FROM establecimientoscomida 
                            INNER JOIN preferenciacomida ON preferenciacomida.idEstablecimiento = establecimientoscomida.idEstablecimiento 
                            WHERE preferenciacomida.idFormulario = ?
                        ");
                        $stmt_establecimientos->bind_param("i", $idFormulario);
            
                        if ($stmt_establecimientos->execute()) {
                            // Procesar resultados de la segunda consulta
                            $result_establecimiento = $stmt_establecimientos->get_result();
                            $establecimientos = [];
                            while ($row = $result_establecimiento->fetch_assoc()) {
                                $establecimientos[] = $row['Tipo']; // Agregar cada tipo al array
                            }
            
                            // Agregar los establecimientos al arreglo de respuesta
                            $respAX['establecimientos'] = $establecimientos;
                        } else {
                            // Error en la consulta de establecimientos
                            $respAX['status'] = "error";
                            $respAX['message'] = "Error al ejecutar la consulta de establecimientos: " . $stmt_establecimientos->error;
                        }
            
                        $stmt_establecimientos->close();
                    } else {
                        // Si no se encontraron resultados para el formulario
                        $respAX['status'] = "error";
                        $respAX['message'] = "No se encontraron resultados para este formulario de comida.";
                    }
                } else {
                    // Error al ejecutar la consulta inicial
                    $respAX['status'] = "error";
                    $respAX['message'] = "Error al ejecutar la consulta del formulario: " . $stmt->error;
                }
            
                $stmt->close();
                break;
            
            
            

        default:
            $respAX['error'] = "Tipo de consulta no válido";
    }

    // Enviar respuesta JSON
    echo json_encode($respAX);
} else {
    http_response_code(405); // Método no permitido
    echo json_encode(["error" => "Método no permitido"]);
}
?>
