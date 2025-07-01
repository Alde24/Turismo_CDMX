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
    $presupuesto = $_POST['presupuesto'] ?? 0.0;
    $origen = $_POST['idOrigen'] ?? '';
    $destino = $_POST['idDestino'] ?? [];
    $fechaini = $_POST['fecha-inicio'] ?? '';
    $fechafin = $_POST['fecha-fin'] ?? '';
    $acompanantes = $_POST['acompanantes'] ?? 1;
    $coordOrigen = $_POST['coordOrigen'] ??'';
    $coordDestino = $_POST['coordDestino'] ??'';
    $dias = $_POST['dias'];
    $idFormulario=$_POST['idFormulario'] ?? 0;

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
    $sql_insert = "UPDATE formulario SET NoViajeros=?, IdLugarOrigen=?, IdLugarDestino=?, CoordOrigen=?, CoordDestino=?, presupuesto=?, FechaFin=?, FechaIni=? WHERE idFormulario=?";
    $stmt = $conn->prepare($sql_insert);
    $stmt->bind_param("issssdssi", $acompanantes, $origen, $destino[0],$coordOrigen,$coordDestino, $presupuesto, $fechafin, $fechaini, $idFormulario);
    if ($stmt->execute()) {
        //si se hace la correcta insercion del fomrulario entonces se procede a insertar las fechas
        //y tambien los destinos
        $respAX= array("status" => "success");
        //Se obtiene el arreglo de fechas individuales:
        $fechasIntervalo=obtenerFechasEnIntervalo($fechaini, $fechafin);
        //arreglo que almacenará los resultados de las inserciones de fechas en la tabla itinerario
        $fechasInsert=[];
        //Cantidad de dias
        $numDias=count($fechasIntervalo);
        $numComp=0;
        //Insertar registros de fechas en la tabla itinerario
        foreach ($fechasIntervalo as $fecha) {
            $sql_insert = "INSERT INTO itinerario (idFormulario, fecha) VALUES (?, ?)";
            $stmt2 = $conn->prepare($sql_insert);
            $stmt2->bind_param("is", $idFormulario, $fecha); 
            if($stmt2->execute()){
                // Obtener el ID del registro insertado
                $idItinerario = $stmt2->insert_id;
                
                // Almacenar el registro insertado en el arreglo
                $fechasInsert[] = [
                    "idItinerario" => $idItinerario,
                    "idFormulario" => $idFormulario,
                    "fecha" => $fecha
                ];
                $numComp++;
            }
        }
        if ($numComp==$numDias) {
            $respAX["statusDias"] = "success";
            //si se insertan las fechas en itinerario,entonces insertar los destinos
            //Insertar los multiples destinos en el ultimo dia de viaje
            $idItinerarioInsert=$fechasInsert[$numDias-1]['idItinerario'];
            //Cantidad de destinos: 
            $numDestinos=count($destino);
            $numComp=0;
            //Insertar registros de fechas en la tabla itinerario
            foreach ($destino as $dest) {
                $sql_insert = "INSERT INTO destino (idItinerario, idLugarDestino) VALUES (?, ?)";
                $stmt2 = $conn->prepare($sql_insert);
                $stmt2->bind_param("is", $idItinerarioInsert, $dest); //Cambiar la variable idItinerarioInsert para insertar destinos en distintos dias
                if($stmt2->execute()){
                    // Obtener el ID del registro insertado
                    $idItinerario = $stmt2->insert_id;
                    
                    // Almacenar el registro insertado en el arreglo
                    $fechasInsert[] = [
                        "idItinerario" => $idItinerario,
                        "idFormulario" => $idFormulario,
                        "fecha" => $fecha
                    ];
                    $numComp++;
                }
            }
            if ($numComp==$numDestinos) {
                $respAX["statusDestinos"] = "success";
            } else {
                $respAX["statusDestinos"] = "error".$stmt->error;
            }
        } else {
            $respAX["statusDias"] = "error".$stmt->error;
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
