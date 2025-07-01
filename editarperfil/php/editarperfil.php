<?php
// Incluimos el archivo de conexión a la base de datos
include "../../BasedeDatos/php/Conexion_base_datos.php";
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inicia la sesión
session_start();
if (!isset($_SESSION['email'])) {
    header("Location: ../../inicio_sesion/html/login.php");
    exit();
}

// Obtener datos del usuario desde la sesión
$email = $_SESSION['email'];
$stmt = $conn->prepare("SELECT idUsuario, Nombre, Apellidos, NumCel, Pais, Biografia, Nacimiento, Genero, preferencias FROM usuario WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->bind_result($idUsuario, $nombre, $apellidos, $celular, $pais, $biografia, $nacimiento, $genero, $preferencias_json);
$stmt->fetch();
$stmt->close();

// Decodificar las preferencias en un array (si no están vacías)
$preferencias = !empty($preferencias_json) ? json_decode($preferencias_json, true) : [];


// Convertir la fecha de nacimiento a formato AAAA-MM-DD
$nacimiento_formateado = date("Y-m-d", strtotime($nacimiento));

// Procesar el formulario cuando se envía
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $NOMBRE = htmlspecialchars($_POST["nombre"]);
    $APELLIDOS = htmlspecialchars($_POST["apellido"]);
    $CELULAR = htmlspecialchars($_POST["phone"]);
    $NACIMIENTO = htmlspecialchars($_POST["fecha_nacimiento"]);
    $PAIS = htmlspecialchars($_POST["selectPais"]);
    $GENERO = htmlspecialchars($_POST["genero"]);
    $BIOGRAFIA = htmlspecialchars($_POST["biografia"]);
    $ID = intval($_POST["user_id"]);

    // Formatear la fecha
    $FECHA = date("Y-m-d", strtotime($NACIMIENTO));

    // Actualizar los datos en la base de datos
    $sql = "UPDATE usuario SET Nombre = ?, Apellidos = ?, NumCel = ?, Pais = ?, Biografia = ?, Nacimiento = ?, Genero = ? WHERE idUsuario = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("sssssssi", $NOMBRE, $APELLIDOS, $CELULAR, $PAIS, $BIOGRAFIA, $FECHA, $GENERO, $ID);
        if ($stmt->execute()) {
            echo "<script>
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Datos actualizados correctamente.',
                        confirmButtonText: 'OK'
                    });
                  </script>";
        } else {
            echo "<script>
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo actualizar la información.',
                        confirmButtonText: 'Reintentar'
                    });
                  </script>";
        }
        $stmt->close();
    } else {
        echo "Error en la preparación de la consulta: " . $conn->error;
    }
    
    $stmt->close();


}

// Cerrar la conexión
$conn->close();
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Perfil</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans:wght@400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../css/bootstrap.min.css">
    <link rel="stylesheet" href="../../navbar/css/navbar.css">
    <link rel="icon" href="../../inimgs/pest.png" type="image/x-icon">
    <script src="https://unpkg.com/just-validate@latest/dist/just-validate.production.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <script src="../../js//jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="../css/editarPerfil.css">
    <link rel="stylesheet" href="../../css/error.css">
    <script src="/ADS_Turismo404/navbar/js/navbar.js"></script>
</head>

<body>
    <div id="header"></div>
    <main>
        <div class="contenedor">
            <div class="pink-background">
                <a class="button back-button" href="../../index.php">
                    <i class="bi bi-arrow-left-circle-fill"></i>
                </a>
            </div>
            <div class="edit-profile">
                <div class="profile-info">
                    <div class="profile-image-container">
                        <img src="../images/user.png" alt="Usuario" class="profile-image-large">
                        <button class="edit-photo-button" id="editPhotoButton">✏️</button>
                    </div>
                    <h2 class="profile-name"><?php echo htmlspecialchars($nombre) ?> <?php echo htmlspecialchars($apellidos) ?></h2>
                    <h3 class="profile-name">Turista</h3>
                    <div class="info-line">
                        <div class="info-icon"><img src="../images/birthday-icon.png" alt="Cumpleaños"></div>
                        <div class="info-text"> <?php echo htmlspecialchars($nacimiento_formateado) ?><span></span></div>
                    </div>
                    <div class="info-line">
                        <div class="info-icon"><img src="../images/email-icon.png" alt="Correo"></div>
                        <div class="info-text"> <?php echo htmlspecialchars($email) ?><span></span></div>
                    </div>
                    <div class="info-line">
                        <div class="info-icon"><img src="../images/phone-icon.png" alt="Teléfono"></div>
                        <div class="info-text"><?php echo htmlspecialchars($celular) ?></div>
                        <div class="info-text"><span></span></div>
                    </div>
                    <div class="info-line">
                        <div class="info-icon"><img src="../images/location-icon.png" alt="Correo"></div>
                        <div class="info-text"> <?php echo htmlspecialchars($pais) ?><span></span></div>
                    </div>
                    <div class="info-line">
                        <div class="info-icon"><img src="../images/genero-icon.png" alt="Género"></div>
                        <div class="info-text"> <?php echo htmlspecialchars($genero) ?><span></span></div>
                    </div>
                </div>
                <div class="form-section">
                    <b class="titulo">Editar perfil</b><br>
                    <br>
                    <form id="Editar_Usuario" method="POST" action="editarperfil.php" autocomplete="off" novalidate="novalidate">
                    <input type="hidden" name="user_id" value="<?php echo htmlspecialchars($idUsuario); ?>">
                        <div class="input-grid">
                            <div class="input-grupo">
                                <label for="nombre" class="form-label">Nombre(s)*:</label>
                                <input type="text" id="nombre" name="nombre" class="form-input form-control" placeholder="Nombre(s)" value="<?php echo htmlspecialchars($nombre) ?>" required>
                                <small id="nombreError" class="form-label text-danger" style="display: none;"></small>
                            </div>
                            <div class="input-grupo">
                                <label for="apellido" class="form-label">Apellido(s)*:</label>
                                <input type="text" id="apellido" name="apellido" class="form-input form-control" placeholder="Apellido(s)" value="<?php echo htmlspecialchars($apellidos) ?>" required>
                                <small id="apellidoError" class="form-label text-danger" style="display: none;"></small>
                            </div>
                            <div class="input-grupo">
                                <label for="fecha_nacimiento" class="form-label">Fecha de nacimiento*:</label>
                                <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" class="form-input form-control" value="<?php echo htmlspecialchars($nacimiento_formateado) ?>">
                                <small id="birthdateError" class="form-label text-danger" style="display: none;"></small>
                            </div>
                            <div class="input-grupo">
                                <label for="genero" class="form-label">Género*:</label>
                                <select id="genero" name="genero" class="form-input form-control">
                                    <!--option selected><?php echo htmlspecialchars($genero) ?></option-->
                                    <option value="Masculino" <?php if ($genero == "Masculino") echo 'selected'; ?>>Masculino</option>
                                    <option value="Femenino" <?php if ($genero == "Femenino") echo 'selected'; ?>>Femenino</option>
                                    <option value="Otro" <?php if ($genero == "Otro") echo 'selected'; ?>>Otro</option>
                                </select>
                                <small id="generoError" class="form-label text-danger" style="display: none;"></small>
                            </div>
                            <div class="input-grupo">
                                <label for="password" class="form-label">Nueva contraseña:</label>
                                <input type="password" name="password" id="password" class="form-input form-control" placeholder="Ingresa tu contraseña" required>
                                <small id="passwordError" class="form-label text-danger" style="display: none;"></small>
                            </div>
                            <div class="input-grupo">
                                <label for="confirm_password" class="form-label">Confirmar contraseña:</label>
                                <input type="password" id="confirm_password" class="form-input form-control" placeholder="Ingresa tu contraseña otra vez" required>
                                <small id="confirmPasswordError" class="form-label text-danger" style="display: none;"></small>
                            </div>
                            <div class="input-grupo">
                                <label for="selectPais" class="form-label">País*:</label>
                                <div class="d-flex align-items-center">
                                    <img id="flagIcon" src="" alt="Bandera" style="width: 25px; height: 18px; margin-right: 5px; display: none;">
                                    <select id="selectPais" name="selectPais" class="form-input form-control" placeholder="Selecciona tu país" value=""><?php echo htmlspecialchars($pais ?: ""); ?></select>
                                    <small id="paisError" class="form-label text-danger" style="display: none;"></small>
                                </div>
                            </div><br>
                            <div class="input-grupo">
                                <label for="lada" class="form-label">Código de marcación:</label>
                                <input type="text" id="lada" name="lada" class="form-input form-control" value="<?php echo htmlspecialchars($pais) ?>" placeholder="Código lada" readonly>
                            </div>
                            <div class="input-grupo">
                                <label for="phone" class="form-label">Número telefónico*:</label>
                                <input type="tel" id="phone" name="phone" class="form-input form-control" value="<?php echo htmlspecialchars($celular) ?>" placeholder="Ingresa el número telefónico" pattern="\d{10}" maxlength="10" required>
                                <small id="phoneError" class="form-label text-danger" style="display: none;">Número de teléfono no válido</small>
                            </div>
                        </div>
                        <br>
                        <div class="input-grupo">
                            <label for="biografia" class="form-label">Biografía:</label>
                            <textarea id="biografia" name="biografia" class="form-input form-control" placeholder="Escribe algo sobre ti..."><?php echo htmlspecialchars($biografia ?: ""); ?></textarea>
                            <small id="biografiaError" class="form-label text-danger" style="display: none;"></small>
                        </div>
                        <div class="button-group">
                            <button type="submit" class="save-button">Guardar</button>
                            <button type="button" id="deactivateAccountButton" class="delete-account-button">Desactivar cuenta</button>
                            <button type="button" class="edit-preferences-button" id="editPreferencesButton">Preferencias</button>
                        </div>
                    </form>
                </div>

    </main>
    <div id="preferencesModal" class="modalA">
        <div class="modal-contentA">
            <span class="close-button">&times;</span>
            <b class="titulo">Selecciona tus preferencias:</b><br>
            <div id="preferenciasActividades"></div>
            <button type="button" class="save-button2" id="savePreferencesButton">Guardar Preferencias</button>
        </div>
    </div>

    <div id="footer"></div>

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
              <h1 class="modal-title fs-5" id="confirmationModalLabel">¡Cambio Exitoso!</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-lg-8 d-lg-flex align-items-center">
                    <div id="confirmModalBody"></div>
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
    <!-- Div Modal / mensajes emergentos -->
    <!-- Modal Pregunta -->
    <div class="modal fade" id="preguntaModal" tabindex="-1" aria-labelledby="succesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header colorprincipal">
              <h1 class="modal-title fs-5" id="succesModalLabel">¿Estás seguro?</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-lg-8 d-lg-flex align-items-center text-center">
                  <p>Parece que estás intentando desactivar tu cuenta, ¿Estás seguro que deseas continuar?</p>
                </div>
                <div class="col-lg-4 ms-auto contPreguntaImg">

                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            </div>
          </div>
        </div>
    </div>
    <script src="../../js/bootstrap.bundle.min.js"></script>
    <script src="../js/editarperfil.js"></script>
    <script>
    document.addEventListener("DOMContentLoaded", function () {
        const selectPais = document.getElementById("selectPais");
        const ladaInput = document.getElementById("lada");
        const flagIcon = document.getElementById("flagIcon");

        // País seleccionado desde PHP
        const paisSeleccionado = "<?php echo htmlspecialchars($pais); ?>";

        // Opción por defecto
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Selecciona tu país";
        defaultOption.disabled = true; // Deshabilita la opción para evitar su selección
        defaultOption.selected = !paisSeleccionado; // La marca como seleccionada si no hay país
        selectPais.appendChild(defaultOption);

        // Función para actualizar LADA y bandera
        function updateLadaAndFlag(selectedOption) {
            ladaInput.value = selectedOption.dataset.lada || "";
            flagIcon.src = selectedOption.dataset.flag || "";
            flagIcon.style.display = selectedOption.dataset.flag ? "inline" : "none";
        }

        // Cargar los países desde la API
        fetch("https://restcountries.com/v3.1/all")
            .then(response => response.json())
            .then(data => {
                // Ordenar países alfabéticamente
                data.sort((a, b) => a.name.common.localeCompare(b.name.common));

                // Generar las opciones del select
                data.forEach(country => {
                    const option = document.createElement("option");
                    option.value = country.name.common;
                    option.textContent = country.name.common;
                    option.dataset.lada = country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : "");
                    option.dataset.flag = country.flags.svg;

                    // Marcar el país almacenado como seleccionado
                    if (country.name.common === paisSeleccionado) {
                        option.selected = true;
                        updateLadaAndFlag(option);
                    }

                    selectPais.appendChild(option);
                });
            })
            .catch(error => console.error("Error al cargar los países:", error));

        // Actualizar LADA y bandera al seleccionar un país
        selectPais.addEventListener("change", function () {
            updateLadaAndFlag(selectPais.options[selectPais.selectedIndex]);
        });
    });
    </script>
</body>

</html>