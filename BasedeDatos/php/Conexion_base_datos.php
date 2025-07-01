<?php

// Conectar a la base de datos
$servername = 'localhost'; 
$username = 'root'; 


$password = '12345678';  //cambie la contraseña para conectarme a mi xampp



$dbname = 'turismo404';
// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);
//$conn = mysqli_connect("localhost", "root", "root", "turismo404");
// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

?>

