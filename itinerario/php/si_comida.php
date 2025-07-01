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
                // Consulta para obtener múltiples `IdLugarDestino`, `Fecha`, `prioridadComida` y `distanciaComida`
                $stmt = $conn->prepare("
                    SELECT fechasdestinos.IdLugarDestino, 
                           fechasdestinos.Fecha, 
                           formulario.prioridadComida, 
                           formulario.distanciaComida
                    FROM fechasdestinos
                    INNER JOIN formulario ON formulario.idFormulario = fechasdestinos.IdFormulario
                    WHERE fechasdestinos.IdFormulario = ? AND fechasdestinos.EsDestino = 1
                ");
                $stmt->bind_param("i", $idFormulario);
            
                if ($stmt->execute()) {
                    $result = $stmt->get_result();
                    $destinos = []; // Lista para almacenar todos los destinos
            
                    while ($row = $result->fetch_assoc()) {
                        // Convertir la fecha al formato dd/mm/aaaa
                        $fechaFormato = date("d/m/Y", strtotime($row['Fecha']));
                        
                        $destinos[] = [
                            "idLugarDestino" => $row['IdLugarDestino'],
                            "fecha" => $fechaFormato,
                            "prioridadComida" => $row['prioridadComida'],
                            "distanciaComida" => $row['distanciaComida']
                        ];
                    }
            
                    if (!empty($destinos)) {
                        $respAX['status'] = "success";
                        $respAX['destinos'] = $destinos;
            
                        // Consulta adicional para los establecimientos
                        $stmt_establecimientos = $conn->prepare("
                            SELECT establecimientoscomida.Tipo 
                            FROM establecimientoscomida 
                            INNER JOIN preferenciacomida ON preferenciacomida.idEstablecimiento = establecimientoscomida.idEstablecimiento 
                            WHERE preferenciacomida.idFormulario = ?
                        ");
                        $stmt_establecimientos->bind_param("i", $idFormulario);
            
                        if ($stmt_establecimientos->execute()) {
                            $result_establecimiento = $stmt_establecimientos->get_result();
                            $establecimientos = [];
            
                            while ($row = $result_establecimiento->fetch_assoc()) {
                                $establecimientos[] = $row['Tipo'];
                            }
            
                            $respAX['establecimientos'] = $establecimientos;
                        } else {
                            $respAX['status'] = "error";
                            $respAX['message'] = $stmt_establecimientos->error;
                        }
            
                        $stmt_establecimientos->close();
                    } else {
                        $respAX['status'] = "error";
                        $respAX['message'] = "No se encontraron destinos asociados a este formulario.";
                    }
                } else {
                    $respAX['status'] = "error";
                    $respAX['message'] = $stmt->error;
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
