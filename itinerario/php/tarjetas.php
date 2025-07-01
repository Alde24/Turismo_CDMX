<?php
include "../../BasedeDatos/php/Conexion_base_datos.php";

// Consulta para obtener las tarjetas
$query = "SELECT * FROM cards";
$result = $conn->query($query);

$cards = [];

// Procesar resultados
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $cards[] = $row; // Agregar cada fila al array
    }
}

// Devolver los datos en formato JSON
header('Content-Type: application/json');
echo json_encode($cards);

// Cerrar conexión
$conn->close();
?>
