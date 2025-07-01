<?php
header('Content-Type: application/json');

// Verifica si se recibe un parámetro `lugar`
if (!isset($_GET['lugar']) || empty($_GET['lugar'])) {
    echo json_encode(['error' => 'No se proporcionó un lugar']);
    exit;
}

$lugar = urlencode($_GET['lugar']);
$url = "https://es.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=$lugar&format=json";

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_USERAGENT, 'TuAplicacion/1.0'); // Evita bloqueos por parte de Wikipedia
$respuesta = curl_exec($curl);

// Verifica si ocurrió un error con la solicitud cURL
if(curl_errno($curl)) {
    echo json_encode(['error' => 'Error en la solicitud cURL: ' . curl_error($curl)]);
    curl_close($curl);
    exit;
}

curl_close($curl);

// Decodificar la respuesta JSON
$datos = json_decode($respuesta, true);

// Verifica si la estructura de la respuesta es válida
if (isset($datos['query']['pages'])) {
    $pages = $datos['query']['pages'];
    $pageId = array_key_first($pages);

    if ($pageId != "-1") {
        $descripcionLarga = $pages[$pageId]['extract'];

        // Limitar la descripción a 200 caracteres
        $descripcionCorta = substr($descripcionLarga, 0, 200);
        
        // Añadir "..." al final si la descripción fue truncada
        if (strlen($descripcionLarga) > 200) {
            $descripcionCorta .= '...';
        }

        echo json_encode([
            'descripcion_corta' => $descripcionCorta,
            'descripcion_larga' => $descripcionLarga
        ]);
    } else {
        echo json_encode(['error' => 'No se encontró una descripción para este lugar.']);
    }
} else {
    echo json_encode(['error' => 'No se pudo obtener la descripción, la respuesta de Wikipedia es incorrecta.']);
}

?>
