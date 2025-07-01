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
    <title>Registrate</title>
    <link rel="stylesheet" href="../css/signup.css">
    <link rel="icon" href="../../inimgs/pest.png" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/css/intlTelInput.css">
    <link rel="stylesheet" href="../../css/bootstrap.min.css">
    <link rel="stylesheet" href="../../css/error.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/intlTelInput.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <header>
        <!-- Aquí puedes agregar el encabezado de tu página, como el logo o la navegación principal -->
    </header>

    <main>
        <section class="login-container">
            <div class="welcome-column">
                <div class="welcome-content">
                    <div class="registrate-container">
                        <p class="registrate-password">¿Ya tienes una cuenta?</p>
                        <a href="../html/login.php" class="registrate-link">Inicia Sesión</a>
                    </div>
                    <h2 class="welcome-message">¡Sé parte de la mejor experiencia!</h2>
                    <img src="../../inimgs/pest.png" alt="Welcome illustration" class="img-fluid welcome-image mt-3">
                </div>
            </div>

            <div class="login-form-column col-md-6 d-flex justify-content-center align-items-center">
                <form class="login-form w-100" action="../php/signup.php" method="POST">
                    <div class="iniciarseesion mb-3 text-center"> Regístrate </div>
                    <div class="row g-3 mb-3 flex-row">
                        <div class="flex-item">
                            <label for="nombre" class="form-label">Nombre(s)*:</label>
                            <input type="text" name="nombre" id="nombre" class="form-input form-control" placeholder="Ingresa tu nombre">
                            <small id="nombreError" class="form-label text-danger" style="display: none;"></small>
                        </div>
                        <div class="flex-item">
                            <label for="apellido" class="form-label">Apellido(s)*:</label>
                            <input type="text" name="apellido" id="apellido" class="form-input form-control" placeholder="Ingresa tu apellido">
                            <small id="apellidoError" class="form-label text-danger" style="display: none;"></small>
                        </div>
                    </div>
                    <div class="row g-3 mb-3 flex-row">
                        <div>
                            <label for="email" class="form-label">Correo electrónico*:</label>
                            <input type="email" name="email" id="email" class="form-input form-control" placeholder="Ingresa tu correo">
                            <small id="emailError" class="form-label text-danger" style="display: none;"></small>
                        </div>
                    </div>
                    <div class="row mb-3 w-100 row-gap-4">
                        <div class="col-lg-6 col-sm-12 position-relative">
                            <label for="password" class="form-label">Contraseña*:</label>
                            <input type="password" name="password" id="password" class="form-input form-control" placeholder="Ingresa tu contraseña">
                            <i class="bi bi-eye-slash-fill toggle-password position-absolute" id="togglePassword1"></i>
                            <small id="passwordError" class="form-label text-danger" style="display: none;"></small>
                        </div>
                        <div class="col-lg-6 col-sm-12 position-relative">
                            <label for="confirm_password" class="form-label">Confirmar contraseña*:</label>
                            <input type="password" id="confirm_password" class="form-input form-control" placeholder="Ingresa tu contraseña otra vez">
                            <i class="bi bi-eye-slash-fill toggle-password position-absolute" id="togglePassword2"></i>
                            <small id="confirmPasswordError" class="form-label text-danger" style="display: none;"></small>
                        </div>
                    </div>

                    <!-- País, código de marcación, y número de teléfono 
                    <div class="row g-3 mb-3 flex-row">
                        <div class="flex-item">
                            <label for="selectPais" class="form-label">País:</label>
                            <div class="d-flex align-items-center">
                                <img id="flagIcon" src="" alt="Bandera" style="width: 25px; height: 18px; margin-right: 5px; display: none;">
                                <select id="selectPais" name="country" class="form-input form-control"></select>
                                <small id="paisError" class="form-label text-danger" style="display: none;"></small>
                            </div>
                        </div>
                        <div class="flex-item">
                            <label for="lada" class="form-label">Código de marcación:</label>
                            <input type="text" id="lada" name="lada" class="form-input form-control" placeholder="Código lada" readonly>
                        </div>
                        <div class="flex-item">
                            <label for="phone" class="form-label">Número telefónico:</label>
                            <input type="tel" id="phone" name="phone" class="form-input form-control" placeholder="Ingresa el número telefónico" pattern="\d{10}" maxlength="10">
                            <small id="phoneError" class="form-label text-danger" style="display: none;">Número de teléfono no válido</small>
                        </div>
                    </div>-->
                    

                    <!-- Fecha de nacimiento y género -->
                    <div class="row g-3 mb-3 flex-row">
                        <div class="flex-item">
                            <label for="birthdate" class="form-label">Fecha de nacimiento*:</label>
                            <input type="date" name="birthdate" id="birthdate" class="form-input form-control">
                            <small id="birthdateError" class="form-label text-danger" style="display: none;"></small>
                        </div>
                        <div class="flex-item">
                            <label for="gender" class="form-label">Género:</label>
                            <select name="gender" id="gender" class="form-input form-control">
                                <option value="">Selecciona tu género</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Otro">Otro</option>
                            </select>
                            <small id="genderError" class="form-label text-danger" style="display: none;"></small>
                        </div>
                    </div>
                    <div class="form-label my-3 mb-3">O regístrate con: </div>
                    <div class="registrate">
                    <?php echo "<a href='" . $client->createAuthUrl() . "' class='google-login-button'>"; ?>
                        <i class="fa-brands fa-google" style="color: #A13C64; font-size: 30px;"></i>
                    </a>
                    <span class="or-divider ml-2"></span>
                    </div>
                    <br>
                <!-- Botón de envío original -->
                <button type="submit" class="login-button btn btn-primary w-100 mt-2">Registrar</button>
                </form>
            </div>
        </section>
    </main>

    <footer>
        <!-- Pie de página con información adicional, enlaces o derechos de autor -->
    </footer>
    <!-- Div Modal / mensajes emergentes -->
    <!-- Div Modal / mensajes emergentes -->
    <!-- Modal Error -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Upps! Parece que hubo un error</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-lg-8 d-lg-flex align-items-center">
                    <div class="textError" id="errorModalBody">
  
                    </div><!-- Mensaje de error irá aquí -->
                </div>
                <div class="col-lg-4 ms-auto contErrorImg">
                    <!-- Foto de mascota error -->
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
    </div>

    <!-- Modal Confirmacion -->
    <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="confirmationModalLabel">¡Registro Exitoso!</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-lg-8 d-lg-flex align-items-center">
                    <p>Tu cuenta ha sido creada exitosamente. Por favor, verifica tu cuenta revisando tu correo electrónico.</p>
                </div>
                <div class="col-lg-4 ms-auto contSuccesImg">
                    <!-- Foto de mascota error -->
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
    </div>

    <!-- Contenedor para el mensaje de carga -->
    <div id="loadingMessage" class="d-none text-center position-fixed top-50 start-50 translate-middle">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando...</p>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../js/signup.js"></script>
</body>
</html>