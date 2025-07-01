<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// Configura  API key de Google
$apiKey = 'AIzaSyBlBfvcJxLHgYnFMJBbgLmdzIS_mI2QZZQ';

// Obtener los parámetros enviados desde el cliente
$placeId = isset($_GET['place_id']) ? $_GET['place_id'] : '';
$fields = isset($_GET['fields']) ? $_GET['fields'] : '';

if (!$placeId || !$fields) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan parámetros requeridos."]);
    exit;
}

// Construir la URL para la API de Google Places
$url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=$placeId&fields=$fields&language=es&key=$apiKey";

// Realizar la solicitud a la API
$options = [
    "http" => [
        "header" => "User-Agent: PHP\r\n"
    ]
];
$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

if ($response === FALSE) {
    http_response_code(500);
    echo json_encode(["error" => "Error al comunicarse con la API de Google."]);
    exit;
}

// Decodificar la respuesta y verificar
$data = json_decode($response, true);
if (isset($data['status']) && $data['status'] !== 'OK') {
    echo json_encode(["error" => "Error en la respuesta de la API: " . $data['status']]);
    exit;
}

// Enviar la respuesta de vuelta al cliente
header('Content-Type: application/json');
echo json_encode($data);

?>