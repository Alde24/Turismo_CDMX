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
    
    //obtener datos del formulario
    $prioridadComida = $_POST['prioridadComida'] ?? 0.0;
    $idFormulario=$_POST['idFormulario'] ?? 0;
    $distanciaComida = $_POST['distanciaComida'] ?? 0.0;
    /*Obntener categorias */
    $establecimientoComida = $_POST['establecimientoComida'] ?? [];
    
    // cast
    $prioridadComida = intval($prioridadComida);
    $idFormulario = intval($idFormulario);
    $distanciaComida = floatval($distanciaComida);
        /*cast a establecimientos */
    foreach ($establecimientoComida as $key => $value) {
        $establecimientoComida[$key] = intval($value);
    }

    /*insertar en tabla preferenciaComida */
    $numComp = 0;
    foreach ($establecimientoComida as $tipo) {
        $sql_check = "SELECT COUNT(*) FROM preferenciacomida WHERE idFormulario = ? AND idEstablecimiento = ?";
        $stmt_check = $conn->prepare($sql_check);
        $stmt_check->bind_param("ii", $idFormulario, $tipo);
        $stmt_check->execute();
        $stmt_check->bind_result($count);
        $stmt_check->fetch();
        $stmt_check->close();
    
        if ($count == 0) {
            $sql_insert = "INSERT INTO preferenciacomida (idFormulario, idEstablecimiento) VALUES (?, ?)";
            $stmt2 = $conn->prepare($sql_insert);
            $stmt2->bind_param("ii", $idFormulario, $tipo);
            if ($stmt2->execute()) {
                $numComp++;
            }
        }
    }
    
    /*fin insertar*/
    
    //preparar la consulta para insertar los datos
    $sql_insert = "UPDATE formulario SET prioridadComida=?, distanciaComida=? WHERE idFormulario=?";

    $stmt = $conn->prepare($sql_insert);
    $stmt->bind_param("idi", $prioridadComida,$distanciaComida, $idFormulario);
    if ($stmt->execute()) {
        $respAX= array("status" => "success");
    } else {
        $respAX= array("status" => "error".$stmt->error);
    }
    
    $stmt->close();
}   
echo json_encode($respAX);

$conn->close();
?>
