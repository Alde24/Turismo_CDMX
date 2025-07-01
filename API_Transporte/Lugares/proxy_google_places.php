<?php
header("Access-Control-Allow-Origin: *"); // Permite acceso desde cualquier dominio
header("Content-Type: application/json"); // Indica que la respuesta será JSON

$apiKey = "AIzaSyBlBfvcJxLHgYnFMJBbgLmdzIS_mI2QZZQ"; 
$placeId = isset($_GET['placeid']) ? $_GET['placeid'] : '';

if ($placeId) {
    $url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=$placeId&key=$apiKey";
    
    // Realizar la solicitud a Google Places API
    $response = file_get_contents($url);
    
    // Devolver la respuesta JSON
    echo $response;
} else {
    echo json_encode(["error" => "No se proporcionó un Place ID"]);
}
?>
