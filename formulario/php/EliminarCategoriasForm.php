<?php
// Incluimos el archivo de conexión a la base de datos
include "../../BasedeDatos/php/Conexion_base_datos.php";

// Recibir los datos del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Variables con valores predeterminados para evitar errores si no llegan
    $idForm = intval($_POST['idFormulario'] ?? -1);
    $categoria = strval($_POST['categoria'] ?? '');
    $idUsuario = intval($_POST['idUsuario'] ?? -1);

    try {
        // Consulta para obtener el ID de la categoría
        $sql_select = "SELECT idCategorias FROM categorias WHERE Nombre = ?";
        $stmt = $conn->prepare($sql_select);

        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $conn->error);
        }

        $stmt->bind_param("s", $categoria);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();

            if (!$row) {
                throw new Exception("Categoría no encontrada.");
            }

            $idCategoria = $row['idCategorias'];
        } else {
            throw new Exception("Error al ejecutar la consulta de categoría: " . $stmt->error);
        }

        // Consulta para eliminar de la tabla preferenciasCategoriasFormulario
        $sql_delete = "DELETE FROM preferenciasCategoriasFormulario  WHERE idFormulario = ? AND idUsuario = ? AND idCategorias = ?";
        $stmt = $conn->prepare($sql_delete);

        if (!$stmt) {
            throw new Exception("Error al preparar la consulta DELETE: " . $conn->error);
        }

        $stmt->bind_param("iii", $idForm, $idUsuario, $idCategoria);

        if ($stmt->execute()) {
            

                $respAX = array(
                    "status" => "success",
                    "message" => "Eliminados correctamente.",
                    
                );
                
        } else {
            throw new Exception("Error al eliminar la categoría: " . $stmt->error);
        }

        // Eliminar preferencias de subcategorías
        $sql_delete_subcategorias = "DELETE FROM preferenciasSubCategoriasFormulario WHERE idFormulario = ?";
        $stmt = $conn->prepare($sql_delete_subcategorias);

        if (!$stmt) {
            throw new Exception("Error al preparar la consulta DELETE para subcategorías: " . $conn->error);
        }

        $stmt->bind_param("i", $idForm);

        if (!$stmt->execute()) {
            throw new Exception("Error al eliminar subcategorías: " . $stmt->error);
        }
    } catch (Exception $e) {
        $respAX = array(
            "status" => "error",
            "message" => $e->getMessage()
        );
    }

    // Enviar la respuesta como JSON
    echo json_encode($respAX);
}

// Cerrar la conexión
$conn->close();
?>
