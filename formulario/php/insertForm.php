<?php
#Incluimos el archivo de conexion a la base deatos
include "../../BasedeDatos/php/Conexion_base_datos.php";

// Inicia la sesión
session_start();
// Comprobar si el usuario ha iniciado sesión
if (!isset($_SESSION['email'])) {
    // Si no está iniciada la sesión, redirige a la página de inicio de sesión
    header("Location: ../../inicio_sesion/html/login.html");
    exit();
}

//recibir los datos del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
   
    //obtener el id del usuario que esta llenando el formulario
    $email=$_SESSION['email'];
    $sql_insert = "SELECT idUsuario FROM usuario WHERE email = ?";
    $stmtUser = $conn->prepare($sql_insert);
    $stmtUser->bind_param("s", $email);
    $stmtUser->execute();
    $stmtUser->store_result();
    if($stmtUser->num_rows > 0){
        $stmtUser->bind_result($idUsuario);
        $stmtUser->fetch();
        //preparar la consulta para insertar los datos
        $sql_insert = "INSERT INTO formulario (idUsuario) VALUES (?)";
        $stmt = $conn->prepare($sql_insert);
        $stmt->bind_param("i", $idUsuario);
        if ($stmt->execute()) {
            $idFormulario = $conn->insert_id;
            $respAX= array("statusForm" => "success", "idFormulario" => $idFormulario, "idUser" => $idUsuario);
        } else {
            $respAX= array("statusForm" => "Error", "idFormulario" => null);
        }
    }else{
        $respAX = array(
            "status" => "error",
            "message" => $stmt->error
        );
    }
    $stmt->close();
}   
echo json_encode($respAX);
$conn->close();
?>
