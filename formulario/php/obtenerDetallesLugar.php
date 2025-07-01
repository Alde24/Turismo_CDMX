<?php
//se hace la petición a la API para obtener los parametros
$placeId = $_POST['place_id']; // Recoge el place_id desde el cliente
$apiKey = "AIzaSyBlBfvcJxLHgYnFMJBbgLmdzIS_mI2QZZQ";

// Hacer la solicitud a la API de Google Places desde el servidor
$url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=$placeId&fields=geometry&key=$apiKey";
$response = file_get_contents($url);

// Devolver la respuesta al cliente
header('Content-Type: application/json');
echo $response;
?>
