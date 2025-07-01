<?php
include "../../BasedeDatos/php/Conexion_base_datos.php";

// Definir el idFormulario (reemplázalo con el valor adecuado)
$idFormulario = 48; // Ejemplo

// Consultas SQL
$sql_formulario = "SELECT CoordDestino, distanciaComida FROM formulario WHERE idFormulario = ?";
$sql_preferencias = "SELECT idEstablecimiento FROM preferenciacomida WHERE idFormulario = ?";

// Preparar y ejecutar consulta para formulario
$stmt_formulario = $conn->prepare($sql_formulario);
$stmt_formulario->bind_param("i", $idFormulario);
$stmt_formulario->execute();
$result_formulario = $stmt_formulario->get_result();

if ($row_formulario = $result_formulario->fetch_assoc()) {
    // Limpiar CoordDestino
    $CoordDestino = str_replace(['(', ')', ' '], '', $row_formulario['CoordDestino']);

    // Quitar los decimales de distancia comida
    $distanciaComida = intval($row_formulario['distanciaComida']*1000);

    // Preparar y ejecutar consulta para preferencias
    $stmt_preferencias = $conn->prepare($sql_preferencias);
    $stmt_preferencias->bind_param("i", $idFormulario);
    $stmt_preferencias->execute();
    $result_preferencias = $stmt_preferencias->get_result();

    // Recorrer cada idEstablecimiento
    $apiKey = 'AIzaSyA53o3gm2kiJtge5N4U_tc0scEoNLfvIk0';
    while ($row_preferencia = $result_preferencias->fetch_assoc()) {
        $idEstablecimiento = $row_preferencia['idEstablecimiento'];

        // Asignar tipo según idEstablecimiento
        $tipo = '';
        switch ($idEstablecimiento) {
            case 1:
                $tipo = "cafe";
                break;
            case 2:
                $tipo = "fast_food_restaurant";
                break;
            case 3:
                $tipo = "mexican_restaurant";
                break;
            case 4:
                $tipo = "restaurant";
                break;
            case 5:
                $tipo = "vegan_restaurant";
                break;
            default:
                $tipo = "restaurant";
                break;
        }

        // Construir URL de la API de Google
        $url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=$CoordDestino&radius=$distanciaComida&type=$tipo&key=$apiKey";

        // Mostrar URL generada en el navegador
        echo "<p><strong>Consulta para $tipo:</strong> <a href='$url' target='_blank'>$url</a></p>";
    }
} else {
    echo "No se encontraron resultados para el formulario con id $idFormulario.<br>";
}

// Cerrar conexiones
$stmt_formulario->close();
$stmt_preferencias->close();
$conn->close();
?>
