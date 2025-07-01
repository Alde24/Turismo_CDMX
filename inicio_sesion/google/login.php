<?php
require_once '../../vendor/autoload.php';
require_once 'config_google.php';

$client = new Google_Client();
$client->setClientId($clientID);
$client->setClientSecret($clientSecret);
$client->setRedirectUri($redirectUri);
$client->addScope("email");
$client->addScope("profile");
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
   
    <title>Tu Título Aquí</title>
    <link rel="stylesheet" href="../css/login.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
   
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../js/login.js"></script>
</head>
<body>
    <header>
        <!-- Aquí puedes agregar el encabezado de tu página, como el logo o la navegación principal -->
    </header>

    <main>
        <section class="login-container">
            <div class="login-form-column">
                
                <form action="../php/login.php" method="POST" class="login-form" autocomplete="off">
                    <div class="iniciarseesion"> Iniciar Sesión </div>
                    <label for="email" class="form-label">Email</label>
                    <input type="email" name="email" id="email" class="form-input" placeholder="Ingresa tu correo aquí" required>

                    <label for="password" class="form-label">Password</label>
                    <div class="password-container">
                        <input type="password" name="password" id="password" class="form-input" placeholder="Ingresa tu contraseña aquí" required>
                        <i class="fa fa-eye" id="togglePassword"></i>
                    </div>
                    
                    <p class="forgot-password">¿Haz olvidado tu contraseña?</p>
                    <a href="#" class="forgot-password-link">Haz click aquí</a>
                    
                    <div class="or-divider">- OR -</div>
                    <?php echo "<a href='" . $client->createAuthUrl() . "' class='google-login-button'>"; ?>
                        <i class="fa-brands fa-google" style="color: #A13C64; font-size: 30px;"></i>
                    </a>
                    
                    <button type="submit" class="login-button">Entrar</button>
                </form>
                
            </div>
            
            <div class="welcome-column">
                <div class="welcome-content">
                    <div class="registrate-container">
                        <p class="registrate-password">¿No tienes cuenta?</p>
                        <a href="./sign_up.php" class="registrate-link">Regístrate</a>
                    </div>
                    <h2 class="welcome-message">¡Bienvenido de Nuevo, Viajero!</h2>
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d79709c8da7177657615c71b425971a94b1de76f25bb80e01dd93736c4c7ed9a?placeholderIfAbsent=true&apiKey=6e7bc380e91e466e8c33b15a363aec18" alt="Welcome illustration" class="welcome-image">
                </div>
            </div>
        </section>
    </main>

    <footer>
        <!-- Pie de página con información adicional, enlaces o derechos de autor -->
    </footer>
</body>
</html>
