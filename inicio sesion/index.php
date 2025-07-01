<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
   
    <title>Tu Título Aquí</title>
    <link rel="stylesheet" href="login.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

</head>
<body>

<?php
require_once '../vendor/autoload.php';

// init configuration
$clientID = '650299382312-9g671hovq974drah6vg5utj3037pja1h.apps.googleusercontent.com';
$clientSecret = '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';
$redirectUri = 'http://localhost/ADS_Turismo404/inicio%20sesion/';

// create Client Request to access Google API
$client = new Google_Client();
$client->setClientId($clientID);
$client->setClientSecret($clientSecret);
$client->setRedirectUri($redirectUri);
$client->addScope("email");
$client->addScope("profile");
echo $client->addScope("email");
// authenticate code from Google OAuth Flow
if (isset($_GET['code'])) {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    $client->setAccessToken($token['access_token']);

    // get profile info
    $google_oauth = new Google_Service_Oauth2($client);
    $google_account_info = $google_oauth->userinfo->get();
    $email =  $google_account_info->email;
    $name =  $google_account_info->name;

    
} else { ?>
    <main>
        <section class="login-container">
            <div class="login-form-column">
                
              <form action="login.php" method="post" class="login-form">
                <div class="iniciarseesion"> Iniciar Sesión </div>
                <label for="email" class="form-label">Email</label>
                <input type="email" name="email" id="email" class="form-input" placeholder="Ingresa tu correo aquí" required>

                <label for="password" class="form-label">Password</label>
                <input type="password" name="password" id="password" class="form-input" placeholder="Ingresa tu contraseña aquí" required>

                
                <p class="forgot-password">¿Haz olvidado tu contraseña?</p>
                <a href="#" class="forgot-password-link">Haz click aquí</a>
                
                <button type="submit" class="login-button">Entrar</button>
                
                <div class="or-divider">- OR -</div>
                <div class="googlee">
                  <a href="<?php echo $client->createAuthUrl() ?>"><i class="fa-brands fa-google" style="color: #A13C64; font-size: 30px;"></i></a>
               </div>
                
                  
              </form>
            </div>
            
            <div class="welcome-column">
              <div class="welcome-content">
                <div class="registrate-container">
                  <p class="registrate-password">¿No tienes cuenta?</p>
                  <a href="sign up.html" class="registrate-link">Regístrate</a>
                </div>
                <h2 class="welcome-message">¡Bienvenido de Nuevo, Viajero!</h2>
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d79709c8da7177657615c71b425971a94b1de76f25bb80e01dd93736c4c7ed9a?placeholderIfAbsent=true&apiKey=6e7bc380e91e466e8c33b15a363aec18" alt="Welcome illustration" class="welcome-image">
              </div>
            </div>
          </section>
    </main>
<?php } ?>