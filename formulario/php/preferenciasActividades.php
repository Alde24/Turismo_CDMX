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
//recibir los datos del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $idUser=$_POST['idUser'] ?? -1;
    //convertir a un valor entero:
    $idUser=intval($idUser);
    //preparar la consulta para devolver todas las categorias
    $sql_select = "SELECT * FROM preferencias WHERE idUsuario=?";
    $stmt = $conn->prepare($sql_select);
    $stmt->bind_param("i", $idUser);
    if ($stmt->execute()) {
        // Obtener el resultado de la consulta
        $result = $stmt->get_result();
        // Convertir el resultado en un arreglo asociativo
        $categorias = $result->fetch_all(MYSQLI_ASSOC);
        $respAX = array(
            "status" => "success",
            "categorias" => $categorias
        );
        //hacer un join para insertar en cada categoria las preferencias de categorias correspondientes
        //preparar la consulta para devolver todas las subcategorias y asociarlas a su respectiva categoria
        $sql_Subcategorias="SELECT * FROM preferenciassubcategorias WHERE idUsuario=?";
        $stmtSub = $conn->prepare($sql_Subcategorias);
        $stmtSub->bind_param("i", $idUser);
        if ($stmtSub->execute()) {
            // Obtener el resultado de la consulta
            $resultSub = $stmtSub->get_result();
            // Convertir el resultado en un arreglo asociativo
            $subCategorias = $resultSub->fetch_all(MYSQLI_ASSOC);
            //se almacenan las preferencias de subcategorias
            $respAX["subcategorias"]=$subCategorias;
        }
    } else {
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
