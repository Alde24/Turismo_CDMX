<?php

session_start(); // Inicia la sesión al principio del archivo

include "../../BasedeDatos/php/Conexion_base_datos.php";
require_once '../../vendor/autoload.php';
require_once 'config_google.php';

$client = new Google_Client();
$client->setClientId($clientID);
$client->setClientSecret($clientSecret);
$client->setRedirectUri($redirectUri);
$client->addScope("email");
$client->addScope("profile");

if (isset($_GET['code'])) {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    $client->setAccessToken($token['access_token']);

    // Obtener información del perfil
    $google_oauth = new Google_Service_Oauth2($client);
    $google_account_info = $google_oauth->userinfo->get();
    
    $email = $google_account_info->email;
    $name = $google_account_info->name;
    $givenName = $google_account_info->givenName;
    $familyName = $google_account_info->familyName;
    $picture = $google_account_info->picture;
    $gender = isset($google_account_info->gender) ? $google_account_info->gender : 'No especificado';
    $id = $google_account_info->id;
    $locale = $google_account_info->locale;
    $pais = substr($locale, strpos($locale, '_') + 1); // Extrae el país del código de localización

    // Variables para insertar en la base de datos
    $biografia = ' ';
    $password = password_hash($id, PASSWORD_DEFAULT);
    $num_cel = '';
    $fecha_nacimiento = '2024-12-21';
    $fecha_nacimiento = strval($fecha_nacimiento);
    // Verificar si el usuario ya existe en la base de datos
    $sql_check = "SELECT * FROM usuario WHERE email = ?";
    if ($stmt_check = $conn->prepare($sql_check)) {
        $stmt_check->bind_param('s', $email);
        $stmt_check->execute();
        $stmt_check->store_result();

        if ($stmt_check->num_rows > 0) {
            // Si el usuario ya existe, iniciar sesión automáticamente
            $_SESSION['email'] = $email;
            $_SESSION['name'] = $name;
            $_SESSION['givenName'] = $givenName;
            $_SESSION['familyName'] = $familyName;
            $_SESSION['picture'] = $picture;

            // Redirigir al index.php
            header('Location:../../index.php');
            exit();
        } else {
            // Insertar al nuevo usuario en la base de datos
            $sql_insert = "INSERT INTO usuario (Nombre, Apellidos, email, password, Biografia, Pais, NumCel, Nacimiento, Genero, fec_creac) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
            
            if ($stmt_insert = $conn->prepare($sql_insert)) {
                $stmt_insert->bind_param('sssssssss', $givenName, $familyName, $email, $password, $biografia, $pais, $num_cel, $fecha_nacimiento, $gender);

                if ($stmt_insert->execute()) {
                    // Registro exitoso, iniciar sesión automáticamente
                    $_SESSION['email'] = $email;
                    $_SESSION['name'] = $name;
                    $_SESSION['givenName'] = $givenName;
                    $_SESSION['familyName'] = $familyName;
                    $_SESSION['picture'] = $picture;

                    // Redirigir al index.php
                    header('Location:../../index.php');
                    exit();
                } else {
                    echo "<div class='alert alert-danger'>Error al registrar usuario: " . $stmt_insert->error . "</div>";
                }
                $stmt_insert->close();
            } else {
                echo "<div class='alert alert-danger'>Error en la consulta SQL: " . $conn->error . "</div>";
            }
        }
        $stmt_check->close();
    } else {
        echo "<div class='alert alert-danger'>Error en la consulta de verificación: " . $conn->error . "</div>";
    }

    $conn->close();
}
?>
