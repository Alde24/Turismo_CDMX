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
    $prioridadComida = $_POST['prioridad-comida'] ?? 0;
    //$presupuestoComida = $_POST['presupuestoComida'] ?? 0.0;
    $establecimientoComida = $_POST['establecimientoComida'] ?? [];
    $idFormulario=$_POST['idFormulario'] ?? 0;

    // Convertir a los tipos correctos para evitar errores de bind_param
    //$presupuestoComida = floatval($presupuestoComida);
    $prioridadComida = intval($prioridadComida);
    $idFormulario = intval($idFormulario);
    // Validar que haya un formulario existente
    if (empty($idFormulario)) {
        echo json_encode(array("status" => "error", "message" => "Falta idFormulario o es inválido"));
        exit;
    }
    // Recorrer el arreglo de establecimientos de comida y convertir cada valor a un entero
    foreach ($establecimientoComida as $key => $value) {
        // Convertir el valor a entero y guardarlo de nuevo en el arreglo
        $establecimientoComida[$key] = intval($value);
    }
    $numEstablecimientos=count($establecimientoComida);
    $numComp=0;
    //preparar la consulta para insertar los datos de hospedaje
    $sql_insert = "UPDATE formulario SET prioridadComida=? WHERE idFormulario=?";

    $stmt = $conn->prepare($sql_insert);
    $stmt->bind_param("ii", $prioridadComida,$idFormulario);
    //preparar la consulta para insertar los datos de preferencias de establecimientos de commida de un formulario
    foreach ($establecimientoComida as $tipo) {
        $sql_insert = "INSERT INTO PreferenciaComida (idFormulario, idEstablecimiento) VALUES (?, ?)";
        $stmt2 = $conn->prepare($sql_insert);
        $stmt2->bind_param("ii", $idFormulario, $tipo); 
        if($stmt2->execute()){
            $numComp++;
        }
    }
    if ($stmt->execute() /*&& $numComp==$numEstablecimientos*/) {
        $respAX= array("status" => "success");
    } else {
        $respAX= array("status" => "error" .$stmt->error);
    }
    $stmt->close();
}   
echo json_encode($respAX);
$conn->close();
?>
