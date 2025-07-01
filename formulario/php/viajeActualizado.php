<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
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
    $presupuesto = $_POST['presupuesto'] ?? 0.0;
    $origen = $_POST['idOrigen'] ?? '';
    $destino = $_POST['idDestino'] ?? [];
    $fechaini = $_POST['fecha-inicio'] ?? '';
    $fechafin = $_POST['fecha-fin'] ?? '';
    $acompanantes = $_POST['acompanantes'] ?? 1;
    $coordOrigen = $_POST['coordOrigen'] ??'';
    $coordDestino = $_POST['coordDestino'] ??'';
    $dias = $_POST['dias']??[];
    $idFormulario=$_POST['idFormulario'] ?? 0;
    $ubicacionConocida = $_POST['UbicacionConocida']??'';
    /*
    A partir de la fecha de inicio y la fecha final insertar
    las fechas individuales en la tabla itinerario
    Segun que los dias de viaje se distribuyen los destinos
    */ 
    
    //Se obtiene un arreglo de las fechas individuales en el intervalo establecido
    function obtenerFechasEnIntervalo($fechaInicio, $fechaFin) {
        $inicio = new DateTime($fechaInicio);
        $fin = new DateTime($fechaFin);
        $fechas = [];
    
        while ($inicio <= $fin) {
            $fechas[] = $inicio->format('Y-m-d');
            $inicio->modify('+1 day');
        }
    
        return $fechas;
    }


    // Convertir a los tipos correctos para evitar errores de bind_param
    $presupuesto = floatval($presupuesto);
    $acompanantes = intval($acompanantes);
    $origen = strval($origen);
    //$destino = strval($destino);
    $fechaini = strval($fechaini);
    $fechafin = strval($fechafin);
    $coordOrigen = strval($coordOrigen);
    $coordDestino = strval($coordDestino);
    $idFormulario = intval($idFormulario);
    

    //preparar la consulta para insertar los datos
    $sql_insert = "UPDATE formulario SET NoViajeros=?, IdLugarOrigen=?, IdLugarDestino=?, CoordOrigen=?, CoordDestino=?, presupuesto=?, FechaFin=?, FechaIni=?, UbicacionLugares=? WHERE idFormulario=?";
    $stmt = $conn->prepare($sql_insert);
    $stmt->bind_param("issssdsssi", $acompanantes, $origen, $destino[0],$coordOrigen,$coordDestino, $presupuesto, $fechafin, $fechaini,$ubicacionConocida, $idFormulario);
    if ($stmt->execute()) {
        //si se hace la correcta insercion del fomrulario entonces se procede a insertar las fechas
        //y tambien los destinos
        $respAX= array("status" => "success"); 
        //Verificar si el usario sabe a donde ir
        if($ubicacionConocida == 'Si'){
            //Se obtiene el arreglo de fechas individuales:
            //Preparar consulta para insertar datos de todos los dias
            $stmt_origen = $conn->prepare("INSERT INTO fechasdestinos (IdFormulario,IdLugarDestino,Fecha,LatDestino,LongDestino,Nombre,EsDestino,EsOrigen) VALUES (?, ? , ? ,? , ?, ?,0,1)");
            $stmt_destino = $conn->prepare("INSERT INTO fechasdestinos (IdFormulario,IdLugarDestino,Fecha,LatDestino,LongDestino,Nombre,EsDestino,EsOrigen) VALUES (?, ? , ? ,? , ?, ?,1,0)");
            $fechasIntervalo=obtenerFechasEnIntervalo($fechaini, $fechafin);
            $numorigenes=0;
            $numDias=count($fechasIntervalo);
            if (!$stmt_origen) {
                echo json_encode(['status' => 'error', 'message' => 'Error al preparar la consulta de fechasdestinos en Origen: ' . $conn->error]);
                exit;
            }
            if (!$stmt_destino) {
                echo json_encode(['status' => 'error', 'message' => 'Error al preparar la consulta de fechasdestinos en Destino: ' . $conn->error]);
                exit;
            }
            // Procesar cada día
            foreach ($dias as $dia => $info) {
                // Procesar origen
                $origen = json_decode($info['origen'], true);
                if ($origen) {
                    $stmt_origen->bind_param('isssss',$idFormulario, $origen['idLugar'],$dia, $origen['latitud'], $origen['longitud'],$origen['nombre']);
                    if (!$stmt_origen->execute()) {
                        echo json_encode(['status' => 'error', 'message' => 'Error en fechasdestino al insertar origen para el día ' . $dia   .$idFormulario  .$origen['idLugar']  .$origen['latitud']  .$origen['longitud']   .$origen['nombre'] ]);
                        exit;
                        
                    }
                    else{
                        $numorigenes++;
                    }
                }
                // Procesar destinos
                if (isset($info['destinos']) && is_array($info['destinos'])) {
                    foreach ($info['destinos'] as $destino) {
                        $destino = json_decode($destino, true);
                        if ($destino) {
                            $stmt_destino->bind_param('isssss', $idFormulario,$destino['idLugar'],$dia, $destino['latitud'], $destino['longitud'],$destino['nombre']);
                            if (!$stmt_destino->execute()) {
                                echo json_encode(['status' => 'error', 'message' => 'Error en fechasdestino al insertar destino para el día ' . $dia]);
                                exit;
                            }
                        }
                    }
                }
            }
            if($numorigenes >=$numDias){
                $respAX["statusDias"] = "success";
            }
            else{
                $respAX["statusDias"] = "error".$stmt->error;
            }
        }
        else{
            $respAX["statusDias"] = "success";
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
