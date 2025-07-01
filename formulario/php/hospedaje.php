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
    $prioridadHospedaje = $_POST['prioridadHospedaje'] ?? 0;
    //$presupuestoHospedaje = $_POST['presupuestoHospedaje'] ?? 0.0;
    $distancia = $_POST['distancia'] ?? '';
    $alojamiento = $_POST['Estancia'] ?? [];
    $idFormulario=$_POST['idFormulario'] ?? 0;
    $recomendacionHospedaje = $_POST['recomendacionHospedaje'] ?? 0;
    // Convertir a los tipos correctos para evitar errores de bind_param
    //$presupuestoHospedaje = floatval($presupuestoHospedaje);
    $prioridadHospedaje = intval($prioridadHospedaje);
    $distancia = floatval($distancia);
    $idFormulario = intval($idFormulario);
    // Validar que haya un formulario existente
    if (empty($idFormulario)) {
        echo json_encode(array("status" => "error", "message" => "Falta idFormulario o es inválido"));
        exit;
    }

    $recomendacionHospedaje = intval($recomendacionHospedaje);
    // Recorrer el arreglo y convertir cada valor a un entero
    foreach ($alojamiento as $key => $value) {
        // Convertir el valor a entero y guardarlo de nuevo en el arreglo
        $alojamiento[$key] = intval($value);
    }
    $numAlojamiento=count($alojamiento);
    $numComp=0;
    //preparar la consulta para insertar los datos de hospedaje
    $sql_insert = "UPDATE formulario SET prioridadHospedaje=?,  distanciaHospedaje=? WHERE idFormulario=?";

    $stmt = $conn->prepare($sql_insert);
    $stmt->bind_param("idi", $prioridadHospedaje,  $distancia, $idFormulario);
    //preparar la consulta para insertar los datos de preferencias de lugares de  hospedaje
    foreach ($alojamiento as $tipo) {
        $sql_insert = "INSERT INTO PreferenciaAlojamiento (idFormulario, idAlojamiento) VALUES (?, ?)";
        $stmt2 = $conn->prepare($sql_insert);
        $stmt2->bind_param("ii", $idFormulario, $tipo); 
        if($stmt2->execute()){
            $numComp++;
        }
    }
    if ($stmt->execute() && $numComp==$numAlojamiento) {
       $respAX= array("status" => "success");
    } else {
        $respAX= array("status" => "error".$stmt->error);
    }
    $stmt->close();
}   
echo json_encode($respAX);
$conn->close();
?>
