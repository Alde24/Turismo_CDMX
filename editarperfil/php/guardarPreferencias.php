<?php
include "../../BasedeDatos/php/Conexion_base_datos.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $CATEGORIAS = $_POST['categorias'] ?? [];
    $SUBCATEGORIAS = $_POST['subcategorias'] ?? [];
    $userId = $_POST['user_id'] ?? -1;

    $userId = intval($userId);
    $valCategorias = [];
    $valSubCategorias = [];

    // Convertir categorías y subcategorías a enteros
    foreach ($CATEGORIAS as $cate) {
        $valCategorias[] = intval($cate["value"]);
    }
    foreach ($SUBCATEGORIAS as $subCate) {
        $valSubCategorias[] = intval($subCate["value"]);
    }
    // Imprime todo el contenido del arreglo $_POST
    //var_dump($valCategorias);
    // Verificar si el usuario es válido
    if ($userId <= 0) {
        echo json_encode(["error" => "ID de usuario no válido."]);
        exit;
    }

    $conn->begin_transaction(); // Iniciar transacción
    try {
        // INSERTAR CATEGORÍAS
        foreach ($valCategorias as $categoria) {
            $sql_insert = "INSERT INTO preferencias (idUsuario, idCategorias) VALUES (?, ?)";
            $stmt = $conn->prepare($sql_insert);
            if (!$stmt) {
                throw new Exception("Error en la preparación de la consulta: " . $conn->error);
            }
            $stmt->bind_param("ii", $userId, $categoria);
            if (!$stmt->execute()) {
                throw new Exception("Error al insertar categoría: " . $stmt->error);
            }
            $stmt->close();
        }

        // INSERTAR SUBCATEGORÍAS
        foreach ($valSubCategorias as $subcategoria) {
            $sql_insert = "INSERT INTO preferenciassubcategorias (idUsuario, idsubcategoria) VALUES (?, ?)";
            $stmt = $conn->prepare($sql_insert);
            if (!$stmt) {
                throw new Exception("Error en la preparación de la consulta: " . $conn->error);
            }
            $stmt->bind_param("ii", $userId, $subcategoria);
            if (!$stmt->execute()) {
                throw new Exception("Error al insertar subcategoría: " . $stmt->error);
            }
            $stmt->close();
        }

        $conn->commit(); // Confirmar transacción
        echo json_encode([
            "status" => "success",
            "message" => "Preferencias actualizadas correctamente."
        ]);
    } catch (Exception $e) {
        $conn->rollback(); // Revertir transacción en caso de error
        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);
    }
}
$conn->close();
?>
