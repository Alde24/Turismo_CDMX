<?php
date_default_timezone_set('America/Mexico_City'); // Ajustar la zona horaria
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require '../PHPMailer/Exception.php';
require '../PHPMailer/PHPMailer.php';
require '../PHPMailer/SMTP.php';

session_start(); // Iniciar la sesión al comienzo del archivo
header('Content-Type: application/json');

include "../../BasedeDatos/php/Conexion_base_datos.php"; // Verifica que la ruta sea correcta
 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //$userId = $_POST['idUsuario'];
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    //$pais = $_POST['country'];
    //$num_cel = $_POST['phone'];
    $fecha_nacimiento = $_POST['birthdate'];
    $genero = $_POST['gender'];
    $biografia = ' ';

    // Generar el token de verificación
    $token = bin2hex(random_bytes(16));
    $exp_time = date('Y-m-d H:i:s', strtotime('+24 hours')); // Expira en 3 minutos

    // Consulta para insertar al nuevo usuario
    $sql_insert = "INSERT INTO usuario (Nombre, Apellidos, email, password, Biografia, Nacimiento, Genero, fec_creac, token, verificado,token_verificacion_exp) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, 0,?)";

    if ($conn && ($stmt_insert = $conn->prepare($sql_insert))) {
        $stmt_insert->bind_param('sssssssss', $nombre, $apellido, $email, $password, $biografia, $fecha_nacimiento, $genero, $token,$exp_time);

        if ($stmt_insert->execute()) {
            $_SESSION['email'] = $email;
            //se almacena el id del usuario receien registrado
            $idUsuario = $conn->insert_id;
            // Enviar correo de verificación
            //$verificationUrl = "http://localhost/ADS_Turismo404/inicio_sesion/html/verificarLogin.html?token=$token";
            //Comente el codigo porque puse el link de la pagina dentro del email body ya no como variable
            $mail = new PHPMailer(true);
            try {
            $mail->CharSet = 'UTF-8';
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'Turismo404.adm@gmail.com';
            $mail->Password = 'owsi bxzy nomp dgrp';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = 465;

            $mail->setFrom('Turismo404.adm@gmail.com', 'Turismo404');
            $mail->addAddress($email, "$nombre $apellido");

            $mail->isHTML(true);
            $mail->Subject = 'Verificación de Cuenta';
            // Adjuntar imágenes
            $mail->addEmbeddedImage('../../inimgs/encabezadocorreo.png', 'encabezado_cid');
            $mail->addEmbeddedImage('../../inimgs/piecorreo.png', 'pie_cid');
            
            $mail->Body = "
                <div style='text-align: center; font-family: Arial, sans-serif;'>
                <img src='cid:encabezado_cid' alt='Encabezado' style='width: 100%;  height: auto;' />
                <p style='font-size: 16px; color: #333; margin: 20px 0;'>
                    <strong>Gracias por registrarte en nuestra plataforma. Para completar la verificación de tu cuenta, haz clic en el siguiente enlace:</strong>
                </p>
                <a href='http://localhost/ADS_Turismo404/inicio_sesion/html/verificarLogin.html?token=" . $token . "' 
                style='display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #a13c64; text-decoration: none; border-radius: 5px;'>
                    Verificar cuenta
                </a>
                <p style='font-size: 16px; color: #333; margin: 20px 0;'>Si no realizaste esta solicitud, puedes ignorar este mensaje.</p>
                <p style='font-size: 16px; color: #333; margin: 20px 0;'>Atentamente,<br><strong>El equipo de ADS Turismo404</strong></p>
                <img src='cid:pie_cid' alt='Pie del correo' style='width: 100%;  height: auto;' />
                </div>"
            ;

        

            $mail->send();
            echo json_encode(["success" => true, "message" => "Correo enviado correctamente.", "idUser" => $idUsuario]);
            } catch (Exception $e) {
                echo json_encode(["error" => "No se pudo enviar el correo. Error: " . $mail->ErrorInfo]);
            };
        }else {
            echo json_encode(["error" => "Error al registrar usuario, por favor, verifique los datos ingresados."]);
        }
        
        $stmt_insert->close();
    } else {
        echo json_encode(["error" => "Ocurrió un error inesperado. Inténtelo de nuevo más tarde."]);
    }

    $conn->close();
}
?>