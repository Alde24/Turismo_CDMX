<?php
require_once '../../vendor/autoload.php';
require_once 'config_google.php';
require_once '../../BasedeDatos/php/Conexion_base_datos.php'; 

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Encriptación de la contraseña
    $pais = $_POST['country'];
    $num_cel = $_POST['phone'];
    $fecha_nacimiento = $_POST['birthdate'];
    $genero = $_POST['gender'];
    $biografia = ' ';
    $token = bin2hex(random_bytes(16)); // Crear el token de verificación
    $verificado = 0;

    // Insertar al nuevo usuario
    $query = "INSERT INTO usuario (Nombre, Apellidos, email, password, Biografia, Pais, NumCel, Nacimiento, Genero, fec_creac, token, verificado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)";
    
    $stmt = $conn->prepare($query); // Asegúrate de que $conn está correctamente inicializado
    $stmt->bind_param("sssssssssii", $nombre, $apellido, $email, $password, $biografia, $pais, $num_cel, $fecha_nacimiento, $genero, $token, $verificado);

    if ($stmt->execute()) {
        // Enviar correo de verificación
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'pro.eu.turbo-smtp.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'cesarmarianoreyes@gmail.com';
            $mail->Password = 'bxihsYZb';
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;
        
            $mail->setFrom('cesarmarianoreyes@gmail.com', 'Turistas404');
            $mail->addAddress($email);
        
            $mail->isHTML(true);
            $mail->Subject = 'Verifica tu cuenta';
        
                            // Ruta de las imágenes
                            $imageHeaderPath = '../../inimgs/encabezadocorreo.png';
                            $imageFooterPath = '../../inimgs/piecorreo.png';
            
                            // Adjuntar las imágenes al correo
                            $mail->addEmbeddedImage($imageHeaderPath, 'encabezado_cid');
                            $mail->addEmbeddedImage($imageFooterPath, 'pie_cid');
        
            // Cuerpo del correo
            $mail->Body = '
            <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333; text-align: center; margin: 0; padding: 0;">
                <div style="margin-bottom: 20px;">
                    <img src="cid:encabezado_cid" alt="Encabezado del correo" style="width: 100%; max-width: 100%; height: auto; display: block;">
                </div>
                <p>Hola ' . htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8') . ',</p>
                <p>Gracias por registrarte en nuestra plataforma. Para completar el proceso de verificación de tu cuenta, haz clic en el siguiente enlace:</p>
                <p style="margin: 20px 0;">
                    <a href="http://localhost/ADS_TURISMO404/inicio_sesion/google/verify.php?token=' . urlencode($token) . '" 
                       style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #a13c64; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Verificar cuenta
                    </a>
                </p>
                <p>Si no realizaste esta solicitud, puedes ignorar este mensaje. Si necesitas ayuda, no dudes en contactarnos.</p>
                <p>Atentamente,<br><strong>El equipo de soporte de ADS Turismo404</strong></p>
                <div style="margin-top: 20px;">
                    <img src="cid:pie_cid" alt="Pie del correo" style="width: 100%; max-width: 100%; height: auto; display: block;">
                </div>
            </div>';
            $mail->send();
            echo "Registro exitoso. Por favor verifica tu correo.";
        } catch (Exception $e) {
            echo "Error al enviar correo: {$mail->ErrorInfo}";
        }
        
    }
    $stmt->close();
}
?>