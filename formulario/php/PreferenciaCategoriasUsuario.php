<?php
# Incluimos el archivo de conexión a la base de datos
include "../../BasedeDatos/php/Conexion_base_datos.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $idUsuario = intval($_POST['idUsuario'] ?? 0);
    $idFormulario = intval($_POST['idFormulario'] ?? 0);

    // Seleccionar las preferencias del usuario
    $sql_preferencias = "SELECT idCategorias FROM preferencias WHERE idUsuario = ?";
    $stmt = $conn->prepare($sql_preferencias);
    $stmt->bind_param("i", $idUsuario);

    if ($stmt->execute()) {
        $result = $stmt->get_result();

        // Verificamos si hay resultados
        if ($result->num_rows > 0) {
            $idCategorias = [];
            while ($row = $result->fetch_assoc()) {
                $idCategorias[] = intval($row['idCategorias']);
            }

            // Insertar todas las categorías en preferenciasCategoriasFormulario
            $sql_insert = "INSERT INTO preferenciascategoriasformulario (idFormulario, idUsuario, idCategorias) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($sql_insert);

            foreach ($idCategorias as $idCategoria) {
                $stmt->bind_param("iii", $idFormulario, $idUsuario, $idCategoria);
                if ($stmt->execute()) {
                    $respAX['insertions'][] = [
                        "status_Insert" => "success",
                        "idCategoria" => $idCategoria
                    ];
                } else {
                    $respAX['insertions'][] = [
                        "status_Insert" => "error",
                        "idCategoria" => $idCategoria,
                        "message_Insert" => $stmt->error
                    ];
                }
            }
        } else {
            $respAX['status_Select'] = "error";
            $respAX['message_Select'] = "No se encontraron categorías para el usuario.";
            echo json_encode($respAX);
            exit();
        }
    } else {
        $respAX['status_Select'] = "error";
        $respAX['message_Select'] = $stmt->error;
        echo json_encode($respAX);
        exit();
    }

    // Preparar la consulta para devolver todas las categorías
    $sql_select = "SELECT categorias.Nombre 
                   FROM categorias 
                   INNER JOIN preferenciascategoriasformulario 
                   ON preferenciascategoriasformulario.idCategorias = categorias.idCategorias 
                   WHERE idUsuario = ? AND idFormulario = ?";
    $stmt = $conn->prepare($sql_select);
    $stmt->bind_param("ii", $idUsuario,$idFormulario);

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
}
$respAX['IDs'][] = [
    "Id Formulario" => $idFormulario,
    "Id usuario" => $idUsuario
];
echo json_encode($respAX);
$conn->close();
?>
