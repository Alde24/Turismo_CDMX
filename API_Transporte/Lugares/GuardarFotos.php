<?php 
// Incluir la conexión a la base de datos
include "../../BasedeDatos/php/Conexion_base_datos.php";
// Aumentar el tiempo de ejecución máximo
set_time_limit(300); // 5 minutos (ajusta según sea necesario)

// Iniciar sesión
session_start();

// Verificar si el usuario está autenticado
if (!isset($_SESSION['email'])) {
    http_response_code(401); // No autorizado
    echo json_encode(["error" => "Usuario no autenticado"]);
    exit();
}

// Configurar encabezados para respuesta JSON
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Verificar que los datos no vengan vacíos
    if (!isset($_POST['lugares'])) {
        http_response_code(400); // Solicitud incorrecta
        echo json_encode(["status" => "error", "message" => "Parámetros incompletos"]);
        exit();
    }
    // Decodificar el JSON recibido
    $lugares = json_decode($_POST['lugares'], true);

    // Verificar si el JSON es válido
    if (!is_array($lugares)) {
        echo json_encode(["error" => "Formato de datos incorrecto"]);
        exit();
    }

    // Carpeta principal donde se guardarán las fotos
    $carpetaFotosPrincipal = './fotos_lugares/';
    if (!file_exists($carpetaFotosPrincipal)) {
        mkdir($carpetaFotosPrincipal, 0777, true); // Crear carpeta principal si no existe
    }

    // Preparar consulta para insertar la foto
    $photoQuery = "INSERT INTO fotos_lugar (lugar_id, foto_url) VALUES (?, ?)";
    $photoStmt = $conn->prepare($photoQuery);
    if (!$photoStmt) {
        echo json_encode(["error" => "Error en la preparación de la consulta de fotos: " . $conn->error]);
        exit();
    }

    // Función para obtener la extensión de la imagen
    function obtenerExtensionImagen($contenidoImagen) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_buffer($finfo, $contenidoImagen);
        finfo_close($finfo);

        $extensiones = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/gif'  => 'gif',
            'image/webp' => 'webp'
        ];

        return isset($extensiones[$mimeType]) ? $extensiones[$mimeType] : 'jpg'; // Por defecto .jpg
    }

    try {
        // Recorrer los lugares
        foreach ($lugares as $lugar) {
            // Si hay fotos para este lugar, descargamos solo la primera
            if (!empty($lugar['fotos'])) {
                // Crear una subcarpeta para el lugar basado en su ID
                $carpetaLugar = $carpetaFotosPrincipal . $lugar['id'] . '/';
                if (!file_exists($carpetaLugar)) {
                    mkdir($carpetaLugar, 0777, true); // Crear subcarpeta del lugar si no existe
                }

                // Descargar la primera foto
                $fotoURL = $lugar['fotos'][0]; // Tomamos solo la primera foto
                $fotoContenido = file_get_contents($fotoURL); // Obtener el contenido de la imagen

                // Obtener la extensión de la imagen
                $extension = obtenerExtensionImagen($fotoContenido);

                // Crear un nombre único para la foto
                $nombreArchivo = uniqid('foto_') . '.' . $extension;

                // Ruta completa donde se guardará la foto
                $rutaArchivo = $carpetaLugar . $nombreArchivo;

                // Guardar la imagen en el servidor
                file_put_contents($rutaArchivo, $fotoContenido);

                // Insertar la ruta de la foto en la base de datos
                $photoStmt->bind_param("ss", $lugar['id'], $rutaArchivo);
                $photoStmt->execute(); // Insertar la ruta en la base de datos
            }
        }

        echo json_encode(["success" => "Foto guardada con éxito"]);
    } catch (Exception $e) {
        // Si ocurre algún error, revertir la transacción
        echo json_encode(["error" => "Error en la transacción: " . $e->getMessage()]);
    }
}

// Cerrar la conexión
$conn->close();
?>
