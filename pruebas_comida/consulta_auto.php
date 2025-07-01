<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recoger datos del formulario
    $inicio = $_POST['inicio'];
    $fin = $_POST['fin'];
    $destino = $_POST['destino'];
    $prioridad_comida = $_POST['prioridad_comida'];
    $distancia_comida = $_POST['distancia_comida'];
    $presupuesto_comida = $_POST['presupuesto_comida'];
    $establecimientos = isset($_POST['establecimiento_comida']) ? $_POST['establecimiento_comida'] : [];

    // Calcular el presupuesto total para la comida
    $fecha_inicio = new DateTime($inicio);
    $fecha_fin = new DateTime($fin);
    $interval = $fecha_inicio->diff($fecha_fin);
    $numero_dias = $interval->days;
    $presupuesto_total = $presupuesto_comida * $numero_dias;

    // Convertir las preferencias de establecimiento a una cadena para la consulta
    $tipos_establecimiento = implode(",", $establecimientos); 

    // API Key de Google (sustituir con la clave real)
    $apiKey = 'AIzaSyA53o3gm2kiJtge5N4U_tc0scEoNLfvIk0'; 

    // Codificar el destino y los tipos de establecimiento
    $destino_encoded = urlencode($destino);
    $tipos_establecimiento_encoded = implode("+", array_map('urlencode', $establecimientos)); 

    // Construir la URL para la consulta en la API de Google Places
    $url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" . $tipos_establecimiento_encoded . "+en+" . $destino_encoded . "&key=$apiKey";

    // Realizar la consulta cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo 'Error de cURL: ' . curl_error($ch);
    }
    curl_close($ch);

    $data = json_decode($response, true);

    // Verificar si la respuesta contiene resultados
    if (isset($data['results']) && !empty($data['results'])) {
        echo '<h2>Propuestas de Comida</h2>';
        echo '<div class="results">';
        foreach ($data['results'] as $establecimiento) {
            $nombre = $establecimiento['name'];
            $direccion = isset($establecimiento['formatted_address']) ? $establecimiento['formatted_address'] : 'Sin dirección disponible';
            $precio = isset($establecimiento['price_level']) ? $establecimiento['price_level'] : 'No disponible';
            $valoracion = isset($establecimiento['rating']) ? $establecimiento['rating'] : 'No disponible';
            $descripcion = isset($establecimiento['types']) ? implode(", ", $establecimiento['types']) : 'Descripción no disponible';

            // Mostrar los resultados
            echo "<div class='result-item'>
                    <h3>$nombre</h3>
                    <p><strong>Dirección:</strong> $direccion</p>
                    <p><strong>Precio:</strong> $precio</p>
                    <p><strong>Valoración:</strong> $valoracion</p>
                    <p><strong>Descripción:</strong> $descripcion</p>
                  </div><hr>";
        }
        echo '</div>';
    } else {
        echo '<p>No se encontraron resultados para tu búsqueda.</p>';
    }
}
?>
