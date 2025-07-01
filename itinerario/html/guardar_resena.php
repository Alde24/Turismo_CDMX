<?php
// Conexión a la base de datos
$host = 'localhost';
$dbname = 'turismo404';
$username = 'root';
$password = 'root';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500); // Error en el servidor
    echo "Error al conectar con la base de datos: " . $e->getMessage();
    exit();
}

// Validar y obtener datos del formulario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titulo = filter_input(INPUT_POST, 'titulo', FILTER_SANITIZE_STRING);
    $comentario = filter_input(INPUT_POST, 'comentario', FILTER_SANITIZE_STRING);
    $calificacion = filter_input(INPUT_POST, 'rating', FILTER_VALIDATE_INT);

    if ($titulo && $comentario && $calificacion) {
        $sql = "INSERT INTO reseñas (titulo, comentario, calificacion) VALUES (:titulo, :comentario, :calificacion)";
        $stmt = $pdo->prepare($sql);

        try {
            $stmt->execute([
                ':titulo' => $titulo,
                ':comentario' => $comentario,
                ':calificacion' => $calificacion,
            ]);
            http_response_code(200); // Respuesta exitosa
            echo "Reseña guardada exitosamente.";
        } catch (PDOException $e) {
            http_response_code(500); // Error en el servidor
            echo "Error al guardar la reseña: " . $e->getMessage();
        }
    } else {
        http_response_code(400); // Datos inválidos
        echo "Datos inválidos. Por favor, verifica los campos del formulario.";
    }
} else {
    http_response_code(405); // Método no permitido
    echo "Método no permitido.";
}
