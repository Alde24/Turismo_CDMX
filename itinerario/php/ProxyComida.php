<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $placeId = $_GET['place_id'] ?? '';
    $radius = $_GET['radius'] ?? '';
    $type = $_GET['type'] ?? '';
    $keyword = $_GET['keyword'] ?? '';
    $API_KEY = "AIzaSyBlBfvcJxLHgYnFMJBbgLmdzIS_mI2QZZQ";

    $urlPlaceDetails = "https://maps.googleapis.com/maps/api/place/details/json?place_id=$placeId&key=$API_KEY";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $urlPlaceDetails);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo json_encode([
            "status" => "error",
            "message" => "Error en cURL: " . curl_error($ch),
        ]);
        exit;

    }

    $placeData = json_decode($response, true);

    if ($placeData['status'] === "OK") {
        $lat = $placeData['result']['geometry']['location']['lat'];
        $lng = $placeData['result']['geometry']['location']['lng'];

        $urlNearbySearch = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=$lat,$lng&radius=$radius&type=$type&keyword=$keyword&key=$API_KEY";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $urlNearbySearch);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $responseNearby = curl_exec($ch);

        if (curl_errno($ch)) {
            echo json_encode([
                "status" => "error",
                "message" => "Error en cURL: " . curl_error($ch),
            ]);
            exit;
        }

        $nearbyData = json_decode($responseNearby, true);

        if ($nearbyData['status'] === "OK") {
            $lugares = array_map(function ($lugar) use ($API_KEY) {
                return [
                    'nombre' => $lugar['name'] ?? 'No disponible',
                    'direccion' => $lugar['vicinity'] ?? 'No disponible',
                    'fotos' => isset($lugar['photos']) ? array_map(function ($foto) use ($API_KEY) {
                        return "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference={$foto['photo_reference']}&key={$API_KEY}";
                    }, $lugar['photos']) : ['https://via.placeholder.com/400x300?text=No+Imagen'],
                    'id' => $lugar['place_id'] ?? '',
                    'coordenadas' => [
                        'lat' => $lugar['geometry']['location']['lat'] ?? null,
                        'lng' => $lugar['geometry']['location']['lng'] ?? null,
                    ],
                    'categorias' => $lugar['types'] ?? [],
                    'horarios' => $lugar['opening_hours']['weekday_text'] ?? 'No disponible',
                    'nivel_precio' => $lugar['price_level'] ?? 'No disponible',
                    'rating' => $lugar['rating'] ?? 'No disponible',
                ];
            }, $nearbyData['results']);

            echo json_encode([
                "status" => "success",
                "lugares" => $lugares,
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => $nearbyData['error_message'] ?? 'No se encontraron resultados.',
            ]);
        }
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "No se pudo obtener la ubicación del lugar.",
        ]);
    }

    curl_close($ch);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Método no permitido",
    ]);
}
?>