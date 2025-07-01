<?php
date_default_timezone_set('America/Mexico_City'); // Ajustar la zona horaria
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require '../PHPMailer/Exception.php';
require '../PHPMailer/PHPMailer.php';
require '../PHPMailer/SMTP.php';

// Configuración de la base de datos
include "../../BasedeDatos/php/Conexion_base_datos.php";
session_start();
header("Content-Type: application/json"); // Configura el encabezado para JSON

// Comprobar si se ha enviado el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener el correo electrónico del formulario
    $email = $_POST['email'];

    // Verificar si el correo electrónico existe en la base de datos
    $sql = "SELECT nombre, idUsuario FROM usuario WHERE email = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Obtener el id y nombre de usuario
            $row = $result->fetch_assoc();
            $userId = $row['idUsuario'];
            $_SESSION['user_id'] = $userId;
            // Generar el token y configurar la expiración
            $token = bin2hex(random_bytes(16)); // Genera un token aleatorio
            //Verificacion de la hora
            $horaactual = date('Y-m-d H:i:s');

            $expiracion = date('Y-m-d H:i:s', strtotime('+1 hour')); // Configura la expiración para 1 hora después
            $expiracion_hora = date('H:i:s',strtotime('+1 hour'));
            // Guardar el token y la expiración en la base de datos
            $sql = "UPDATE usuario SET token_password = ?, token_password_expiracion = ? WHERE email= ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sss", $token, $expiracion, $email);
            $stmt->execute();
        
            // Crear una instancia de PHPMailer
            $mail = new PHPMailer(true);

            try {
                // Configuración del servidor SMTP
                $mail->CharSet = 'UTF-8';
                $mail->SMTPDebug = 0; // Desactivar la salida de depuración
                $mail->isSMTP(); // Enviar usando SMTP
                $mail->Host = 'smtp.gmail.com'; // Servidor SMTP
                $mail->SMTPAuth = true; // Activar autenticación SMTP
                $mail->Username = 'Turismo404.adm@gmail.com'; // Nombre de usuario SMTP
                $mail->Password = 'owsi bxzy nomp dgrp'; // Contraseña específica de aplicación
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Habilitar encriptación TLS implícita
                $mail->Port = 465; // Puerto TCP para conectar

                // Destinatarios
                $mail->setFrom('Tusimo404.adm@gmail.com', 'Administrador');
                $mail->addAddress($email, 'Turista'); // Destinatario

                // Contenido del correo
                $mail->isHTML(true); // Formato HTML
                $mail->Subject = 'Recuperación de contraseña';
                
                // Ruta de las imágenes
                $imageHeaderPath = '../../inimgs/encabezadocorreo.png';
                $imageFooterPath = '../../inimgs/piecorreo.png';

                // Adjuntar las imágenes al correo
                $mail->addEmbeddedImage($imageHeaderPath, 'encabezado_cid');
                $mail->addEmbeddedImage($imageFooterPath, 'pie_cid');

                // Cuerpo del correo
                $mail->Body = '
                <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333; text-align: center; margin: 0; padding: 0;">
                <!-- Imagen del encabezado -->
                <div style="margin-bottom: 20px;">
                <img src="cid:encabezado_cid" alt="Encabezado del correo" style="width: 100%; max-width: 100%; height: auto; display: block;">
                </div>
        
                <!-- Texto del correo -->
                <p>Estimado/a usuario/a,</p>
                <p>Hemos recibido una solicitud para restablecer la contraseña asociada a tu cuenta. Para proceder con este cambio, te invitamos a hacer clic en el siguiente enlace:</p>
                <p style="margin: 20px 0;">
                <a href="http://localhost/ADS_Turismo404/inicio_sesion/html/verificarTokenPass.html?token=' . $token . '" 
                style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #a13c64; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Restablecer Contraseña
                </a>
                </p>
                <p>Si no has realizado esta solicitud, puedes ignorar este mensaje. La seguridad de tu cuenta es nuestra prioridad, por lo que te recomendamos no compartir este enlace con nadie.</p>
                <p>Atentamente,<br><strong>El equipo de soporte de ADS Turismo404</strong></p>
        
                <!-- Imagen del pie -->
                <div style="margin-top: 20px;">
                <img src="cid:pie_cid" alt="Pie del correo" style="width: 100%; max-width: 100%; height: auto; display: block;">
                </div>
                </div>';

                $mail->AltBody = 'Este es el cuerpo del correo en texto plano para clientes que no soportan HTML';

                $mail->send();
                echo json_encode(["message" => "Hemos enviado un correo a la dirección proporcionada. Por favor, revisa los pasos a seguir. El enlace expira a las  $expiracion_hora ."]);
            } catch (Exception $e) {
                echo json_encode(["error" => "El correo no pudo ser enviado. Error: " . $mail->ErrorInfo]);
            }
        } else {
            echo json_encode(["error" => "No se ha encontrado un usuario asociado con el correo electrónico ingresado. Por favor, verifique el dato ingresado."]);
        }

        // Cerrar declaración
        $stmt->close();
    } else {
        echo json_encode(["error" => "Error en la consulta a la base de datos."]);
    }
}

// Cerrar la conexión
$conn->close();
?>
