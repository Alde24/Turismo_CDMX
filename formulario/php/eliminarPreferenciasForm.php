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
    $idForm=$_POST['idFormulario'] ?? -1;
    //convertir a un valor entero:
    $idForm=intval($idForm);
    //preparar la consulta para devolver todas las categorias
    $sql_select = "DELETE FROM preferenciascategoriasformulario WHERE idFormulario=?";
    $stmt = $conn->prepare($sql_select);
    $stmt->bind_param("i", $idForm);
    if ($stmt->execute()) {
        
        //ELIMINAR LAS PREFERENCIAS DE SUBCATEGORIAS
        $sql_Subcategorias="DELETE FROM preferenciassubcategoriasformulario WHERE idFormulario=?";
        $stmtSub = $conn->prepare($sql_Subcategorias);
        $stmtSub->bind_param("i", $idForm);
        if ($stmtSub->execute()) {
            
            $respAX = array(
                "status" => "success"
            );
        }else{
            $respAX = array(
                "status" => "error",
                "message" => $stmt->error
            );
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
