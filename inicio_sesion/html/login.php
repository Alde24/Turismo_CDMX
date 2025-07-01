<?php
require_once '../../vendor/autoload.php';
require_once '../google/config_google.php';

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
    <title>Turismo404</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

    <link rel="stylesheet" href="../css/login.css">
    <link rel="stylesheet" href="../../css/bootstrap.min.css">
    <link rel="icon" href="../../inimgs/pest.png" type="image/x-icon">
    <link rel="stylesheet" href="../../css/error.css">
</head>
<body>
    <header>
        <!-- Aquí puedes agregar el encabezado de tu página, como el logo o la navegación principal -->
    </header>

    <main class="container-fluid">
      <section class="container-fluid login-container d-flex flex-column flex-md-row p-0">
        <div class="col-md-6 d-flex justify-content-center align-items-center p-0 m-0">

            <form action="../php/login1.php" method="POST" class="login-form w-100 h-100 " autocomplete="off">
              <div class="text-center iniciarseesion mb-5">Iniciar Sesión</div>
          
              <div class="form-group w-100">
                  <label for="email" class="form-label">Correo electrónico</label>
                  <input type="email" id="email" name="email" class="form-control form-input w-100" placeholder="Ingresa tu correo aquí" required>
              </div>
              <div class="form-group w-100 mb-2 position-relative">
                  <label for="password" class="form-label">Contraseña</label>
                  <input type="password" id="password" name="password" class="form-control form-input w-100" placeholder="Ingresa tu contraseña aquí" required>
                  <i class="bi bi-eye-slash-fill toggle-password position-absolute" id="togglePassword" style="top: 38px; right: 15px; cursor: pointer;"></i>
              </div>
              <p class="forgot-password">¿Haz olvidado tu contraseña?</p>
              <a href="recuperar.html" class="forgot-password-link d-block mb-3">Haz click aquí</a>
          
              <div class="form-label my-3 mb-3">O inicia sesión con:</div>
              <div class="registrate">
                

                  <div class="d-flex align-items-center justify-content-center mb-4">
                  <?php echo "<a href='" . $client->createAuthUrl() . "' class='google-login-button'>"; ?>
                        <i class="fa-brands fa-google" style="color: #A13C64; font-size: 30px;"></i>
                        <span class="or-divider ml-2"></span>
                      </a>
                  </div>
              </div>
              
              <button type="submit" class="login-button btn btn-primary w-100">Iniciar sesión</button>
          </form>
          
          </div>
          
          <div class="col-md-6 d-flex justify-content-center align-items-center welcome-column p-4">
              <div class="text-center welcome-content">
                  <div class="registrate-container d-flex justify-content-center align-items-center mb-3">
                      <p class="registrate-password mb-0">¿No tienes cuenta?</p>
                      <a href="../html/Signup.php" class="registrate-link ml-2">Regístrate</a>
                  </div>
                  <h2 class="welcome-message">¡Bienvenido de Nuevo, Viajero!</h2>
                  <img src="../../inimgs/pest.png" alt="Welcome illustration" class="img-fluid welcome-image mt-3">
              </div>
          </div>
      </section>
  </main>

    <footer>
        <!-- Pie de página con información adicional, enlaces o derechos de autor -->
    </footer>

    <!-- Div Modal / mensajes de error -->
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Upps! Parece que hubo un error</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-8 d-lg-flex align-items-center text-center">
                  <div id="errorModalBody">

                  </div><!-- Mensaje de error irá aquí -->
              </div>
              <div class="col-lg-4 ms-auto contErrorImg">
                  <!-- Foto de mascota error -->
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Aceptar</button>
          </div>
        </div>
      </div>
    </div>

  
  <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
  <script src="../../js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="../js/login.js"></script>
</body>
</html>
