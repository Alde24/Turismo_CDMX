<?php
// Datos de conexión a la base de datos
$host = "localhost";
$dbname = "turismo404";
$username = "tu_usuario";
$password = "tu_contraseña";

// Crear conexión
$conn = new mysqli($host, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Error en la conexión: " . $conn->connect_error);
}

// Verificar que se haya enviado el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los datos del formulario HTML
    $idUsuario = $_POST['idUsuario'];
    $NoViajeros = $_POST['NoViajeros'];
    $lugarOrigen = $_POST['lugarOrigen'];
    $lugarDestino = $_POST['lugarDestino'];

    // Preparar la consulta SQL para insertar datos
    $sql = "INSERT INTO formulario (idUsuario, NoViajeros, lugarOrigen, lugarDestino) 
            VALUES (?, ?, ?, ?)";

    // Preparar la declaración
    $stmt = $conn->prepare($sql);

    // Vincular los parámetros a la declaración preparada
    $stmt->bind_param("iiss", $idUsuario, $NoViajeros, $lugarOrigen, $lugarDestino);

    // Ejecutar la declaración
    if ($stmt->execute()) {
        echo "Datos guardados correctamente.";
    } else {
        echo "Error al guardar los datos: " . $stmt->error;
    }

    // Cerrar la declaración
    $stmt->close();
}

// Cerrar la conexión
$conn->close();
?>