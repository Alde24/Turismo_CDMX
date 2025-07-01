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
    $prioridadActividades = $_POST['prioridadActividades'] ?? 0;
    //$presupuestoActividades = $_POST['presupuestoActividades'] ?? 0.0;
    $DistanciaActividad = $_POST['DistanciaActividad'] ?? 0.0;
    $costos = $_POST['RangoCostoActividad'] ?? [];
    $parametroBusqueda=$_POST['parametroActividades'] ?? '';
    $idFormulario=$_POST['idFormulario'] ?? 0;
    
    // Convertir a los tipos correctos para evitar errores de bind_param
    //$presupuestoActividades = floatval($presupuestoActividades);
    $prioridadActividades = intval($prioridadActividades);
    $parametroBusqueda = intval($parametroBusqueda);
    $DistanciaActividad = intval($DistanciaActividad);
    $idFormulario = intval($idFormulario);
    // Validar que haya un formulario existente
    if (empty($idFormulario)) {
        echo json_encode(array("status" => "error", "message" => "Falta idFormulario o es inválido"));
        exit;
    }
    // Recorrer el arreglo de rango de costos de actividades y convertir cada valor a un entero
    foreach ($costos as $key => $value) {
        // Convertir el valor a entero y guardarlo de nuevo en el arreglo
        $costos[$key] = intval($value);
    }
    //cantidad de rengos seleccionado
    $numIntereses=count($costos);
    $numComp=0;
    //preparar la consulta para insertar los datos de hospedaje
    $sql_insert = "UPDATE formulario SET prioridadActividades=?,  preferenciaDistancia=?, parametroActividades=? WHERE idFormulario=?";

    $stmt = $conn->prepare($sql_insert);
    $stmt->bind_param("iiii", $prioridadActividades, $DistanciaActividad, $parametroBusqueda, $idFormulario);
    //preparar la consulta para insertar los datos de preferencias de rangos de costos para las actividades
    foreach ($costos as $tipo) {
        $sql_insert = "INSERT INTO preferenciaprecioactividades (idFormulario, idprecioActividades) VALUES (?, ?)";
        $stmt2 = $conn->prepare($sql_insert);
        $stmt2->bind_param("ii", $idFormulario, $tipo); 
        if($stmt2->execute()){
            $numComp++;
        }
    }
    if ($stmt->execute() /*&& $numComp==$numIntereses*/) {
        $respAX= array("status" => "success");
    } else {
        $respAX= array("status" => "error".$stmt->error);
    }
    $stmt->close();
}   
echo json_encode($respAX);
$conn->close();
?>
