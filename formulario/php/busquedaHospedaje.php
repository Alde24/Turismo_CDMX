<?php
header('Content-Type: application/json');

try {
    // Conexión a la base de datos
    $pdo = new PDO('mysql:host=localhost;dbname=turismo404', 'root', '');

    // Consulta las preferencias
    $query = $pdo->query("SELECT distanciaHospedaje, prioridadHospedaje, tipoHospedaje FROM formulario LIMIT 1");
    $resultado = $query->fetch(PDO::FETCH_ASSOC);

    if ($resultado) {
        // Devuelve las preferencias como JSON
        echo json_encode([
            'distancia' => $resultado['distancia'],
            'prioridad' => (int)$resultado['prioridad'],
            'tipoAlojamiento' => explode(',', $resultado['tipoAlojamiento']),
        ]);
    } else {
        echo json_encode(['error' => 'No se encontraron preferencias']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
