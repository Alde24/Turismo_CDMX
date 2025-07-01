<?php
// Iniciar la sesión
session_start();

// Destruir todas las variables de sesión
$_SESSION = [];

// Si se desea, también se puede destruir la sesión
session_destroy();

// Redirigir a la página de inicio de sesión
header("Location: ../inicio_sesion/html/login.php");
exit();
?>