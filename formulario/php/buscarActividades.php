<?php
#Incluimos el archivo de conexion a la base deatos
include "../../BasedeDatos/php/Conexion_base_datos.php";
/*
// Inicia la sesión
session_start();
// Comprobar si el usuario ha iniciado sesión
if (!isset($_SESSION['email'])) {
    // Si no está iniciada la sesión, redirige a la página de inicio de sesión
    header("Location: ../../inicio_sesion/html/login.html");
    exit();
}
*/
//recibir el id del formulario con el que se desea trabajar
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $idFormulario = $_POST['idFormulario'] ?? 0;
    
    // Convertir a los tipos correctos para evitar errores de bind_param
    $idFormulario = intval($idFormulario);
   
    //preparar la consulta para traer los datos del registro de formulario correspondiente
    $sql_insert = "SELECT IdLugarDestino FROM formulario WHERE idFormulario=?";

    $stmt = $conn->prepare($sql_insert);
    $stmt->bind_param("i", $idFormulario);
    if ($stmt->execute()) {
         // Asociar el resultado de la consulta
         $stmt->bind_result($idlugarDestino);
         if ($stmt->fetch()) {
            // Si hay resultados, construir el objeto con el dato
            $respAX = array("status" => "success", "idlugarDestino" => $idlugarDestino);
        } else {
            // Si no se encuentra el registro
            $respAX = array("status" => "error", "message" => "Registro no encontrado");
        }
    } else {
        $respAX= array("status" => "error".$stmt->error);
    }
    $stmt->close();
}   
echo json_encode($respAX);
$conn->close();
?>
