<?php
include "../../BasedeDatos/php/Conexion_base_datos.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $CATEGORIAS = $_POST['categorias'] ?? [];
    $SUBCATEGORIAS = $_POST['subcategorias'] ?? [];
    $userId = $_POST['user_id'] ?? -1;
    $idForm = $_POST['formulario'] ?? -1;
    $userId = intval($userId);
    $idForm = intval($idForm);
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
        echo json_encode([
            "status" => "error",
            "message" => "ID de usuario no válido."
        ]);
        exit;
    }

    $conn->begin_transaction(); // Iniciar transacción
    try {
        // INSERTAR CATEGORÍAS
        foreach ($valCategorias as $categoria) {
            $sql_insert = "INSERT INTO preferenciascategoriasformulario (idFormulario, idUsuario, idCategorias) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($sql_insert);
            if (!$stmt) {
                throw new Exception("Error en la preparación de la consulta: " . $conn->error);
            }
            $stmt->bind_param("iii", $idForm, $userId, $categoria);
            if ($stmt->execute()) {
                $respAX = array(
                    "Ingresados" =>"Xorrectamente",
                );
            }
            else{
                throw new Exception("Error al insertar categoría: " . $stmt->error);
            }
            $stmt->close();
        }

        // INSERTAR SUBCATEGORÍAS
        foreach ($valSubCategorias as $subcategoria) {
            $sql_insert = "INSERT INTO preferenciassubcategoriasformulario (idFormulario, idUsuario, idsubcategoria) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($sql_insert);
            if (!$stmt) {
                throw new Exception("Error en la preparación de la consulta: " . $conn->error);
            }
            $stmt->bind_param("iii", $idForm, $userId, $subcategoria);
            if (!$stmt->execute()) {
                throw new Exception("Error al insertar subcategoría: " . $stmt->error);
            }
            $stmt->close();
        }
        //Mandar los valores 
        //preparar la consulta para devolver todas las categorias
        $sql_select = "SELECT categorias.Nombre  FROM categorias  INNER JOIN preferenciascategoriasformulario ON preferenciascategoriasformulario.idCategorias = categorias.idCategorias WHERE idUsuario = ? AND idFormulario= ?";
        $stmt = $conn->prepare($sql_select);
            if (!$stmt) {
                throw new Exception("Error en la preparación de la consulta: " . $conn->error);
            }
        $stmt->bind_param("ii",  $userId,$idForm);
        if ($stmt->execute()) {
            // Obtener el resultado de la consulta
            $result = $stmt->get_result();
            // Convertir el resultado en un arreglo asociativo
            $categorias = $result->fetch_all(MYSQLI_ASSOC);
            $respAX = array(
                "categorias" => $categorias
            );
        } else {
            $respAX = array(
                "message" => $stmt->error
            );
        }

        $conn->commit(); // Confirmar transacción
        echo json_encode([
            "status" => "success",
            "message" => "Preferencias actualizadas correctamente.",
            "categorias" =>$respAX
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
