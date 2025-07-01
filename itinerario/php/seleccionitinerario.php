<?php
// Incluir conexión a la base de datos
include "../../BasedeDatos/php/Conexion_base_datos.php";
session_start();

// Verificar autenticación del usuario
if (!isset($_SESSION['email'])) {
    http_response_code(401); // No autorizado
    echo json_encode(["error" => "Usuario no autenticado"]);
    exit();
}

// Obtener el tipo de datos solicitado
$tipo = isset($_GET['tipo']) ? $_GET['tipo'] : null;
if (!$tipo) {
    http_response_code(400);
    echo json_encode(["error" => "Tipo de datos no especificado"]);
    exit();
}

try {
    // Email del usuario autenticado
    $email = $_SESSION['email'];

    // Obtener el idUsuario
    $stmt = $pdo->prepare("SELECT idUsuario FROM usuario WHERE email = :email LIMIT 1");
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        throw new Exception("Usuario no encontrado.");
    }

    $idUsuario = $usuario['idUsuario'];

    // Obtener el formulario más reciente
    $stmt = $pdo->prepare("
        SELECT * FROM formulario 
        WHERE idUsuario = :idUsuario 
        ORDER BY idFormulario DESC 
        LIMIT 1
    ");
    $stmt->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
    $stmt->execute();
    $formulario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$formulario) {
        throw new Exception("Formulario no encontrado.");
    }

    // Consulta basada en tipo
    $query = "";
    $params = [];

    switch ($tipo) {
        case 'hospedaje':
            $query = "
                SELECT nombre, direccion, calificacion, precio 
                FROM resultados_hospedaje 
                WHERE idFormulario = :idFormulario 
                AND precio <= :presupuestoHospedaje
                LIMIT 10
            ";
            $params = [
                ':idFormulario' => $formulario['idFormulario'],
                ':presupuestoHospedaje' => $formulario['presupuestoHospedaje'],
            ];
            break;

        case 'comida':
            $query = "
                SELECT nombre, direccion, valoracion AS calificacion, precio 
                FROM resultados_comida 
                WHERE idFormulario = :idFormulario 
                AND CAST(precio AS DECIMAL(10, 2)) <= :presupuestoComida
                LIMIT 10
            ";
            $params = [
                ':idFormulario' => $formulario['idFormulario'],
                ':presupuestoComida' => $formulario['presupuestoComida'],
            ];
            break;

        // Agregar casos para transporte y actividades...

        default:
            throw new Exception("Tipo no válido.");
    }

    // Ejecutar consulta
    $stmt = $pdo->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Respuesta JSON
    header('Content-Type: application/json');
    echo json_encode($resultados);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error: " . $e->getMessage()]);
}
?>
