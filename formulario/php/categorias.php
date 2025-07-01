<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
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
   
    //preparar la consulta para devolver todas las categorias
    $sql_select = "SELECT * FROM categorias";
    $stmt = $conn->prepare($sql_select);
    if ($stmt->execute()) {
        // Obtener el resultado de la consulta
        $result = $stmt->get_result();
        // Convertir el resultado en un arreglo asociativo
        $categorias = $result->fetch_all(MYSQLI_ASSOC);
        $respAX = array(
            "status" => "success",
            "categorias" => $categorias
        );

        //preparar la consulta para devolver todas las subcategorias y asociarlas a su respectiva categoria
        foreach ($respAX['categorias'] as &$categoria){
            $idCategoria=$categoria['idCategorias']; //se obtiene cada una de las categorías
            //Seleccionar todas las categorias de esa subcategoria
            $sql_Subcategorias="SELECT * FROM subcategorias WHERE idCategorias=?";
            $stmt = $conn->prepare($sql_Subcategorias);
            $stmt->bind_param("i", $idCategoria);
            if ($stmt->execute()) {
                // Obtener el resultado de la consulta
                $result = $stmt->get_result();
                // Convertir el resultado en un arreglo asociativo
                $subCategorias = $result->fetch_all(MYSQLI_ASSOC);
                //almacenamos en cada objeto categoria una subcategoria
                $categoria['subCategorias'] = $subCategorias;
            }
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
