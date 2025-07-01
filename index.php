<?php
// Iniciar la sesión
session_start();

// Incluir la conexión a la base de datos
include "./BasedeDatos/php/Conexion_base_datos.php";

// Comprobar si el usuario ha iniciado sesión
if (!isset($_SESSION['email'])) {
    // Si no está iniciada la sesión, redirige a la página de inicio de sesión
    header("Location: ./inicio_sesion/html/login.php");
    exit();
}

$mostrar_modal = false;

// Obtener el email del usuario desde la sesión
$email = $_SESSION['email'];

// Preparar y ejecutar la consulta para obtener los datos del usuario
$stmt = $conn->prepare("SELECT nombre, apellidos, nacimiento, numCel, pais, genero, biografia FROM usuario WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->bind_result($nombre, $apellidos, $nacimiento, $numCel, $pais, $genero, $biografia);
$stmt->fetch();
$stmt->close();

$nombre_usuario = $nombre;

// Verificar si algún campo está vacío
if (empty($nombre) || empty($apellidos) || empty($nacimiento) || empty($numCel) || empty($pais) || empty($genero) || empty($biografia)) {
    $mostrar_modal = true;
}
// Cerrar la conexión
$conn->close();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Turismo 404</title>
    <link rel="stylesheet" href="./css/bootstrap.min.css">
    <link rel="stylesheet" href="./css/styles.css">
    <link rel="stylesheet" href="navbar/css/navbar.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <link rel="icon" href="inimgs/pest.png" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./css/error.css">
</head>

<body>
    <div id="header"></div>

    <!-- Saludo al usuario -->
    <div class="container-sm saludo-usuario mt-4">
        <h2>¡Hola, <?php echo htmlspecialchars($nombre_usuario); ?>!</h2>
    </div>

    <section class="container sombra mt-4 imgviaje w-75">
        <div class="contenidoViajeNuevo">
            <a class="btn btn-viaje" href="formulario/html/Formulario.html">Nuevo Viaje</a>
        </div>
    </section>

    <section class="container p-3 mb-3">
        <h2 class="text-center">🌟 ¡Descubre cada paso de tu aventura! 🌟</h2>
        <p class="text-center">En nuestra sección de itinerario, te ofrecemos una guía detallada de actividades diarias para que aproveches al máximo cada momento. Desde viajes inolvidables hasta experiencias únicas, hemos planeado cada detalle pensando en ti. Ya sea que estés buscando diversión, descanso o nuevas experiencias, aquí encontrarás un plan diseñado para cumplir tus expectativas.</p>
        <h3 class="text-center mb-2">¡Prepárate para vivir una experiencia organizada, emocionante y sin preocupaciones!</h3>
        <div class="contSuccesImg"></div>
    </section>

    <section class="container p-3 mb-5">

    </section>
    <section class="container mb-5">
        <div class="row">
            <div class="col-lg-6">
                <h3>¿Quieres consultar el clima?</h2>
                <div class="card d-flex">
                        <div class="cloud">
                        </div>
                        <img src="./inimgs/climaPet.png" alt="" class="climaPet">
                        <a class="btn btn-secondary btn-clima" href="./clima/clima.html" >Consultar clima</a>
                </div>
            </div>
            <div class="col-lg-6">
                <h3>¿Tienes alguna pregunta?</h2>
                <div class="card color-2">
                        <img src="./inimgs/dudaPet.png" alt="" class="climaPet">
                        <a class="btn btn-secondary btn-clima" href="./faq.html">Visita las FAQ'S</a>
                        
                </div>
            </div>
        </div>
    </section>

    <section class="container mb-5">
        <h2>Sobre nosotros</h2>
        <p class="t-align-center">Nosotros somos un equipo multidisciplinario comprometido con la creación de una aplicación web innovadora destinada a la generación de itinerarios personalizados. Esta herramienta está diseñada para facilitar la planificación de viajes, permitiendo a los usuarios crear itinerarios detallados y adaptados a sus necesidades y preferencias. El equipo combina experiencia en diferentes áreas para asegurar que el producto final sea funcional, seguro y fácil de usar.</p>
    <!-- NO SUPE DONDE QUEDARIA MEJOOOOOOOOOOOOOOR-->
        <div class="sombra container">
            <h3 class="text-center">Síguenos</h3>
            <div class="swiper mySwiper">
                <div class="swiper-wrapper mb-4">
                <div class="swiper-slide">
                    <h2>Scrum master</h2>
                    <div class="row">
                        <div class="col-lg-12 col-sm-12 d-flex persona">
                            <a class="linkPersona" href="https://www.instagram.com/aliak5_/">
                                <div class="circle-fp">
                                    <img src="./img-integrantes/AleM.jpeg" alt="">
                                </div>
                                <h3>Alejandra Malagón</h3>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <h2>Backend</h2>
                    <div class="row">
                        <div class="col-lg-3 col-sm-6 d-flex persona">
                            <a class="linkPersona" href="https://www.instagram.com/aldep_24/">
                                <div class="circle-fp">
                                    <img src="./img-integrantes/alde.jpg" alt="">
                                </div>
                                <h3>Aldebaran Pastrana</h3>
                            </a>
                        </div>
                        <div class="col-lg-3 col-sm-6 d-flex persona">
                            <a class="linkPersona" href="https://www.instagram.com/omaaar_es/">
                                <div class="circle-fp">
                                    <img src="./img-integrantes/omar.jpg" alt="">
                                </div>
                                <h3>Omar Redondo</h3>
                            </a>
                        </div>
                        <div class="col-lg-3 col-sm-6 d-flex persona">
                            <a class="linkPersona" href="https://www.instagram.com/tazim.sahab">
                                <div class="circle-fp">
                                    <img src="./img-integrantes/tazim.jpeg" alt="">
                                </div>
                                <h3>Cesar Mariano</h3>
                            </a>
                        </div>
                        <div class="col-lg-3 col-sm-6 d-flex persona">
                            <a class="linkPersona" href="https://www.instagram.com/isaiasssrt/">
                                <div class="circle-fp">
                                    <img src="./img-integrantes/isa.jpg" alt="">
                                </div>
                                <h3>Isaias Romero</h3>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <h2>Frontend</h2>
                    <div class="row">
                        <div class="col-lg-3 col-sm-6 d-flex persona">
                            <a class="linkPersona" href="https://www.instagram.com/aless.vilk/">
                                <div class="circle-fp">
                                    <img src="./img-integrantes/AleV.jpg" alt="">
                                </div>
                                <h3>Alejandra Villegas</h3>
                            </a>
                        </div>
                        <div class="col-lg-3 col-sm-6 d-flex persona">
                            <a class="linkPersona" href="https://www.instagram.com/luisdavidmtzx">
                                <div class="circle-fp">
                                    <img src="./img-integrantes/David.jpg" alt="">
                                </div>
                                <h3>David Martínez</h3>
                            </a>
                        </div>
                        <div class="col-lg-3 col-sm-6 d-flex persona">
                            <a class="linkPersona" href="https://www.instagram.com/ivenyou2._/">
                                <div class="circle-fp">
                                    <img src="./img-integrantes/ivonne.jpg" alt="">
                                </div>
                                <h3>Ivonne Méndez</h3>
                            </a>
                        </div>
                        <div class="col-lg-3 col-sm-6 d-flex persona">
                            <a class="linkPersona" href="https://www.instagram.com/adamarialvar22/">
                                <div class="circle-fp">
                                    <img src="./img-integrantes/adamari.jpg" alt="">
                                </div>
                                <h3>Adamari Mendoza</h3>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <h2>Documentación</h2>
                    <div class="row">
                        <div class="col-lg-4 col-sm-6 d-flex persona">
                            <a class="linkPersona" href="https://www.instagram.com/x.vianneyq/">
                                <div class="circle-fp">
                                    <img src="./img-integrantes/ximena.jpeg" alt="">
                                </div>
                                <h3>Ximena Quevedo</h3>
                            </a>
                        </div>
                        <div class="col-lg-4 col-sm-6 d-flex persona">
                            <a class="linkPersona" href="https://www.instagram.com/marco_nomarcosss/">
                                <div class="circle-fp">
                                    <img src="./img-integrantes/marco.jpeg" alt="">
                                </div>
                                <h3>Marco Mánica</h3>
                            </a>
                        </div>
                        <div class="col-lg-4 col-sm-6 d-flex persona">
                            <a class="linkPersona" href="https://www.instagram.com/mike.gutierrez_64/">
                                <div class="circle-fp">
                                    <img src="./img-integrantes/mike.jpg" alt="">
                                </div>
                                <h3>Miguel Rodríguez</h3>
                            </a>
                        </div>
                    </div>
                </div>
                </div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-pagination"></div>
            </div>
        </div>
    </section>

    <h2 class="container">Sigue a Ajoloturista en instagram</h2>
    <section class="container instagram-section">
        <div class="row">
            <div class="instagram-post col-lg-4">
                <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DC5Fjw4SKSG/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" data-instgrm-version="13">
                    <a href="https://www.instagram.com/p/DC5Fjw4SKSG/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank"></a>
                </blockquote>
            </div>
            <div class="instagram-post col-lg-4">
                <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DDYc-fhNMpY/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" data-instgrm-version="13">
                    <a href="https://www.instagram.com/p/DDYc-fhNMpY/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank"></a>
                </blockquote>
            </div>
            <div class="instagram-post col-lg-4">
                <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DDd31_ku02b/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" data-instgrm-version="13">
                    <a href="https://www.instagram.com/p/DDd31_ku02b/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank"></a>
                </blockquote>
            </div>
        </div>
    </section>

    <div id="footer"></div>

    <!-- modal para el perfil incompleto -->
    <?php if ($mostrar_modal): ?>
        <div class="modal" id="completarPerfilModal" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Completa tu perfil</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="cerrarModal()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-8 d-lg-flex align-items-center text-center">
                                <div>
                                    <p class="c-negro">Para una mejor experiencia, por favor, completa la información de tu perfil.</p>
                                </div>
                            </div>
                            <div class="col-lg-4 ms-auto contPreguntaImg">
                                <!-- Foto de mascota error -->
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="window.location.href='editarperfil/php/editarperfil.php'">Completar perfil</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="cerrarModal()">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
        <script>
            // Función para cerrar el modal sin cambiar de página
            function cerrarModal() {
                document.getElementById('completarPerfilModal').style.display = 'none';
                // Opcional: eliminar el fondo oscuro de Bootstrap
                document.body.classList.remove('modal-open');
                let backdrops = document.getElementsByClassName('modal-backdrop');
                while (backdrops.length > 0) {
                    backdrops[0].parentNode.removeChild(backdrops[0]);
                }
            }
        </script>
    <?php endif; ?>
    <script async src="//www.instagram.com/embed.js"></script>
    <script src="./js/bootstrap.bundle.min.js"></script>
    <!-- Swiper JS -->
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <script src="./navbar/js/navbar.js"></script>
    <script src="js/script.js"></script>
    <script>
        $(document).ready(function() {
            if ($('#completarPerfilModal').length) {
                $('#completarPerfilModal').modal('show');
            }
        });
    </script>
    <script>
    var swiper = new Swiper(".mySwiper", {
      cssMode: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
      },
      mousewheel: true,
      keyboard: true,
    });
  </script>
</body>
</html>
