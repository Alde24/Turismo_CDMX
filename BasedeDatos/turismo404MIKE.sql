-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 10-12-2024 a las 01:19:27
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `turismo404`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividad`
--

CREATE TABLE `actividad` (
  `idCategorias` int(11) NOT NULL,
  `idDestino` int(11) NOT NULL,
  `idLugar` int(11) DEFAULT NULL,
  `nombre` longtext DEFAULT NULL,
  `Hora_ini` time DEFAULT NULL,
  `Hora_fin` time DEFAULT NULL,
  `costo` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alojamiento`
--

CREATE TABLE `alojamiento` (
  `idAlojamiento` int(11) NOT NULL,
  `Tipo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `alojamiento`
--

INSERT INTO `alojamiento` (`idAlojamiento`, `Tipo`) VALUES
(1, 'Hotel'),
(2, 'Hostal'),
(3, 'Airbnb'),
(4, 'Casa de huespedes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `idCategorias` int(11) NOT NULL,
  `Nombre` varchar(90) DEFAULT NULL,
  `Imagen` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`idCategorias`, `Nombre`, `Imagen`) VALUES
(1, 'Cultura', '/ADS_Turismo404/editarperfil/images/categoryimg/cultural.png'),
(2, 'Educación', '/ADS_Turismo404/editarperfil/images/categoryimg/education.png'),
(3, 'Ocio y Entretenimiento', '/ADS_Turismo404/editarperfil/images/categoryimg/entretenimiento.png'),
(4, 'Elementos naturales', '/ADS_Turismo404/editarperfil/images/categoryimg/naturaleza.png'),
(5, 'Lugares de Culto', '/ADS_Turismo404/editarperfil/images/categoryimg/religioso.png'),
(6, 'Servicios', '/ADS_Turismo404/editarperfil/images/categoryimg/relax.png'),
(7, 'Compras', '/ADS_Turismo404/editarperfil/images/categoryimg/compras.png'),
(8, 'Deportes', '/ADS_Turismo404/editarperfil/images/categoryimg/deportes.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `destino`
--

CREATE TABLE `destino` (
  `idDestino` int(11) NOT NULL,
  `idItinerario` int(11) NOT NULL,
  `idLugarDestino` longtext DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  `CoordDestino` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `destino`
--

INSERT INTO `destino` (`idDestino`, `idItinerario`, `idLugarDestino`, `Fecha`, `CoordDestino`) VALUES
(20, 52, 'ChIJd5OnVyH80YUR3aJAsoFl_zM', NULL, NULL),
(21, 54, 'ChIJW8MJYwj80YURc0q6XMSv-ks', NULL, NULL),
(22, 59, 'ChIJidPZvuf-0YURUDELLAa_Xrg', NULL, NULL),
(23, 60, 'ChIJhQcnon__zYURa0HR17b18uA', NULL, NULL),
(24, 63, 'ChIJHea-pweP0YUR_DrOurXfZZM', NULL, NULL),
(25, 68, 'EkFKaWxvdHppbmdvLCBFc3RhZG8gZGUgTWV4aWNvLCBOYXVjYWxwYW4gZGUgSnXDoXJleiwgTcOpeC4sIE1leGljbyIuKiwKFAoSCQFARuPFA9KFEdM-1-LJXPXREhQKEgkdtF-qxQPShRH71kGtqC_LqA', NULL, NULL),
(26, 70, 'ChIJE3wNxMYB0oUR7gfWEoRUgBQ', NULL, NULL),
(27, 73, 'ChIJrytwDXsAzoURdPOX5AOA3nw', NULL, NULL),
(28, 77, 'ChIJlbopajEAzoURkUFiyph2J_E', NULL, NULL),
(29, 85, 'ChIJm6DrmgL_0YURqONhzsag6IU', NULL, NULL),
(30, 88, 'ChIJrytwDXsAzoURdPOX5AOA3nw', NULL, NULL),
(31, 90, 'ChIJGQkBCFIAzoURlLaQUWnuYZc', NULL, NULL),
(32, 92, 'ChIJo97obYwDzoURhFO92h_3eZs', NULL, NULL),
(33, 95, 'ChIJtRKjR83-0YURSRoKZak2sSs', NULL, NULL),
(34, 97, 'ChIJYczSHCT80YURcAFpPX1ZlNk', NULL, NULL),
(35, 99, 'ChIJ9-pzBOABzoUR9sERoax5a80', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `establecimientoscomida`
--

CREATE TABLE `establecimientoscomida` (
  `idEstablecimiento` int(11) NOT NULL,
  `Tipo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `establecimientoscomida`
--

INSERT INTO `establecimientoscomida` (`idEstablecimiento`, `Tipo`) VALUES
(1, 'Cafe'),
(2, 'Fast_food_restaurant'),
(3, 'Mexican_restaurant'),
(4, 'Restaurant'),
(5, 'Vegan_restaurant');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favoritos`
--

CREATE TABLE `favoritos` (
  `idFavoritos` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idLugar` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fechasdestinos`
--

CREATE TABLE `fechasdestinos` (
  `IdFechaDestino` int(11) NOT NULL,
  `IdFormulario` int(11) NOT NULL,
  `IdLugarDestino` varchar(50) DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  `LatDestino` varchar(50) DEFAULT NULL,
  `LongDestino` varchar(50) DEFAULT NULL,
  `Nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fechasdestinos`
--

INSERT INTO `fechasdestinos` (`IdFechaDestino`, `IdFormulario`, `IdLugarDestino`, `Fecha`, `LatDestino`, `LongDestino`, `Nombre`) VALUES
(1, 58, 'ChIJGx5lP7Qd0oURRlXhRudmRyA', '2024-12-09', '19.552015', '-99.2419326', 'Multiplaza Alamedas, Boulevard Adolfo López Mateos'),
(2, 58, 'ChIJ96XQ0kEd0oUR3hJO9cRrZqg', '2024-12-09', '19.5461326', '-99.208967', 'Multiplaza Arboledas, Periférico Boulevard Manuel '),
(3, 58, 'ChIJ11_XBkz50YURyQoZon1W4T8', '2024-12-10', '19.5046493', '-99.146323', 'ESCOM - Escuela Superior de Cómputo - IPN, ESCOM I'),
(4, 58, 'ChIJo97obYwDzoURhFO92h_3eZs', '2024-12-10', '19.2572314', '-99.1029664', 'Xochimilco, CDMX, México');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formulario`
--

CREATE TABLE `formulario` (
  `idFormulario` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `NoViajeros` int(11) DEFAULT NULL,
  `IdLugarOrigen` longtext DEFAULT NULL,
  `IdLugarDestino` longtext DEFAULT NULL,
  `CoordOrigen` longtext DEFAULT NULL,
  `CoordDestino` longtext DEFAULT NULL,
  `presupuesto` decimal(10,2) DEFAULT NULL,
  `FechaIni` date DEFAULT NULL,
  `FechaFin` date DEFAULT NULL,
  `prioridadTranporte` int(11) DEFAULT NULL,
  `presupuestoTranporte` decimal(10,2) DEFAULT NULL,
  `tipoTransporte` varchar(32) DEFAULT NULL,
  `tipoCarretera` varchar(32) DEFAULT NULL,
  `prioridadHospedaje` int(11) DEFAULT NULL,
  `presupuestoHospedaje` decimal(10,2) DEFAULT NULL,
  `distanciaHospedaje` decimal(10,2) DEFAULT NULL,
  `preferenciaDistancia` int(11) DEFAULT NULL,
  `prioridadActividades` int(11) DEFAULT NULL,
  `presupuestoActividades` int(11) DEFAULT NULL,
  `parametroActividades` int(11) DEFAULT NULL,
  `prioridadComida` int(11) DEFAULT NULL,
  `presupuestoComida` decimal(10,2) DEFAULT NULL,
  `distanciaComida` float DEFAULT NULL,
  `UbicacionLugares` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `formulario`
--

INSERT INTO `formulario` (`idFormulario`, `idUsuario`, `NoViajeros`, `IdLugarOrigen`, `IdLugarDestino`, `CoordOrigen`, `CoordDestino`, `presupuesto`, `FechaIni`, `FechaFin`, `prioridadTranporte`, `presupuestoTranporte`, `tipoTransporte`, `tipoCarretera`, `prioridadHospedaje`, `presupuestoHospedaje`, `distanciaHospedaje`, `preferenciaDistancia`, `prioridadActividades`, `presupuestoActividades`, `parametroActividades`, `prioridadComida`, `presupuestoComida`, `distanciaComida`, `UbicacionLugares`) VALUES
(29, 13, 3, 'ChIJnyKTvXf80YURRNK6YfV-0AI', 'ChIJd5OnVyH80YUR3aJAsoFl_zM', '(19.4360762, -99.07190829999999)', '(19.4055237, -99.0925662)', 100.00, '2024-12-11', '2024-12-12', 5, NULL, 'publico', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, 13, 4, 'ChIJw6TTmOH-0YURBzh462X6hSc', 'ChIJW8MJYwj80YURc0q6XMSv-ks', '(19.4046606, -99.13385489999999)', '(19.4332622, -99.08949860000001)', 100.00, '2024-12-20', '2024-12-21', 5, NULL, 'privado', NULL, 1, NULL, 0.90, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(31, 13, 3, 'ChIJP1dJRVf_0YURr8MZosHl4kI', 'ChIJidPZvuf-0YURUDELLAa_Xrg', '(19.4194815, -99.18945579999999)', '(19.4075942, -99.136094)', 2000.00, '2024-12-13', '2024-12-17', 1, NULL, 'publico', NULL, 2, NULL, 0.90, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(32, 13, 3, 'ChIJh80WKBr_0YUROy_5zNKjA50', 'ChIJhQcnon__zYURa0HR17b18uA', '(19.4028026, -99.15434069999999)', '(19.3041972, -99.19028379999999)', 340.00, '2024-12-06', '2024-12-06', 5, NULL, 'publico', NULL, 5, NULL, 0.90, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, 13, 2, 'ChIJMV3hFkD_0YUR9qTMPafpzGk', 'ChIJHea-pweP0YUR_DrOurXfZZM', '(19.4090008, -99.1689686)', '(19.5391919, -99.39697149999999)', 1000.00, '2024-12-07', '2024-12-09', 6, NULL, 'publico', NULL, 2, NULL, 5.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(34, 13, 2, 'ChIJYczSHCT80YURcAFpPX1ZlNk', 'EkFKaWxvdHppbmdvLCBFc3RhZG8gZGUgTWV4aWNvLCBOYXVjYWxwYW4gZGUgSnXDoXJleiwgTcOpeC4sIE1leGljbyIuKiwKFAoSCQFARuPFA9KFEdM-1-LJXPXREhQKEgkdtF-qxQPShRH71kGtqC_LqA', '(19.4051022, -99.0956211)', '(19.445005, -99.24578179999999)', 1000.00, '2024-12-13', '2024-12-17', 5, NULL, 'caminando', NULL, 5, NULL, 0.90, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(35, 13, 4, 'ChIJbez6G6IBzoUR38rOPniQoW4', 'ChIJE3wNxMYB0oUR7gfWEoRUgBQ', '(19.2844014, -99.1846376)', '(19.3994065, -99.2085974)', 100.00, '2024-12-06', '2024-12-07', 5, NULL, 'publico', NULL, 2, NULL, 0.90, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(36, 13, 3, 'ChIJ28vnsJsBzoURv5ilmAoMoGc', 'ChIJrytwDXsAzoURdPOX5AOA3nw', '(19.3077102, -99.13442169999999)', '(19.2971863, -99.18083969999999)', 1000.00, '2024-12-07', '2024-12-09', 5, NULL, 'privado', NULL, 5, NULL, 0.90, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(37, 13, 2, 'ChIJB3UJ2yYAzoURQeheJnYQBlQ', 'ChIJlbopajEAzoURkUFiyph2J_E', '(19.4326077, -99.133208)', '(19.4873329, -99.1236134)', 2000.00, '2024-12-06', '2024-12-09', 5, NULL, 'publico', NULL, 5, NULL, 0.90, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, 13, 3, 'ChIJOz-6AMT_0YURofTM9_ekAWI', 'ChIJm6DrmgL_0YURqONhzsag6IU', '(19.3551806, -99.1624636)', '(19.3956147, -99.1462534)', 10.00, '2024-12-06', '2024-12-13', 9, NULL, 'caminando', NULL, 2, NULL, 0.90, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(39, 13, 3, 'ChIJw-66vMT40YURhOxTB0UKnzE', 'ChIJrytwDXsAzoURdPOX5AOA3nw', '(19.4496513, -99.1568607)', '(19.2971863, -99.18083969999999)', 1000.00, '2024-12-07', '2024-12-09', 4, NULL, 'privado', NULL, 6, NULL, 2.90, 2, 2, NULL, 2, 0, NULL, NULL, NULL),
(40, 13, 4, 'ChIJYczSHCT80YURcAFpPX1ZlNk', 'ChIJGQkBCFIAzoURlLaQUWnuYZc', '(19.4051022, -99.0956211)', '(19.3028607, -99.1505277)', 8000.00, '2024-12-12', '2024-12-13', 5, NULL, 'publico', NULL, 2, NULL, 4.90, 1, 2, NULL, 2, 0, NULL, NULL, NULL),
(41, 13, 7, 'ChIJ11_XBkz50YURyQoZon1W4T8', 'ChIJo97obYwDzoURhFO92h_3eZs', '(19.5046493, -99.146323)', '(19.2572314, -99.1029664)', 5000.00, '2024-12-12', '2024-12-13', 3, NULL, 'publico', NULL, 5, NULL, 4.90, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(42, 13, 3, 'ChIJoXf3chzy0YURgGayQgpU1Ew', 'ChIJtRKjR83-0YURSRoKZak2sSs', '(19.5671142, -99.04451929999999)', '(19.4326018, -99.1332049)', 10.00, '2024-12-09', '2024-12-11', 5, NULL, 'privado', NULL, NULL, NULL, NULL, 1, 1, NULL, 1, 0, NULL, NULL, NULL),
(43, 13, 6, 'ChIJ90P2x9v40YURxkaLX6N8mx0', 'ChIJYczSHCT80YURcAFpPX1ZlNk', '(19.4496728, -99.1516292)', '(19.4051022, -99.0956211)', 3000.00, '2024-12-08', '2024-12-09', 2, NULL, 'privado', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(44, 13, 3, 'ChIJzeSi8jn_0YURMiXDZ-gzmi0', 'ChIJ9-pzBOABzoUR9sERoax5a80', '(19.4195256, -99.162549)', '(19.3391738, -99.1252086)', 2000.00, '2024-12-09', '2024-12-10', 2, NULL, 'publico', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(45, 13, 2, 'ChIJYczSHCT80YURcAFpPX1ZlNk', 'ChIJOz-6AMT_0YURofTM9_ekAWI', '(19.4051022, -99.0956211)', '(19.3551806, -99.1624636)', 10.00, '2024-12-10', '2024-12-14', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(46, 13, 2, 'ChIJ7a1VdC3_0YUR4c2lTZFXbpo', 'ChIJYxCNbHb40YUR9s1Fdr8kGJk', '(19.4295587, -99.155453)', '(19.5360618, -99.1968306)', 100.00, '2024-12-07', '2024-12-10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(47, 13, 23, 'ChIJBwSKbzT_0YURL8cF7c7Nctk', 'ChIJ-7L47G_i0YURqeSG2dLeEbw', '(19.426753, -99.16184489999999)', '(19.3619294, -98.9714623)', 1000.00, '2024-12-07', '2024-12-08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(48, 13, 3, 'ChIJIRaXOar40YURGfvz2usIuKk', 'ChIJbS8EZf8B0oURwwD8B0MpqK0', '(19.4381377, -99.1878502)', '(19.4308408, -99.1917115)', 5000.00, '2024-12-07', '2024-12-08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(49, 13, 2, 'ChIJB3UJ2yYAzoURQeheJnYQBlQ', 'ChIJoXf3chzy0YURgGayQgpU1Ew', '(19.4326077, -99.133208)', '(19.5671142, -99.04451929999999)', 1000.00, '2024-12-07', '2024-12-08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(50, 13, 3, 'ChIJzeSi8jn_0YURMiXDZ-gzmi0', 'ChIJ90P2x9v40YURxkaLX6N8mx0', '(19.4195256, -99.162549)', '(19.4496728, -99.1516292)', 100.00, '2024-12-07', '2024-12-09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(51, 13, 2, 'ChIJmTJrhDP_0YURHpJrNSgT0x8', 'ChIJA_8cTjr50YURKmq5IIv_l9E', '(19.4288787, -99.16165149999999)', '(19.4461911, -99.1283211)', 10.00, '2024-12-07', '2024-12-08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(52, 13, 3, 'ChIJ3TPwH_v_0YURPyNigd20siU', 'ChIJ7z-C0zUczoURDvbvTV8zbJE', '(19.3461816, -99.17895039999999)', '(19.2924017, -98.9403667)', 1000.00, '2024-12-07', '2024-12-08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(53, 13, 7, 'ChIJh4kDTCPu0YURA4ENkROFV0s', 'ChIJ3TPwH_v_0YURPyNigd20siU', '(19.6029246, -98.99111959999999)', '(19.3461816, -99.17895039999999)', 100.00, '2024-12-12', '2024-12-13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(54, 13, 7, 'Ej9DLiBCZWxsYXMgQXJ0ZXMsIEZlZGVyYWwsIDE1NzAwIENpdWRhZCBkZSBNw6l4aWNvLCBDRE1YLCBNZXhpY28iLiosChQKEgl9tILRE_zRhRHZLvJpx6d5dxIUChIJB7Vg8RD80YURl9zrUzQ9Tro', 'ChIJwy80ES4AzoURgODUMdhnJpo', '(19.4207844, -99.0841753)', '(19.3437444, -99.1561883)', 900.00, '2024-12-07', '2024-12-09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(55, 13, 3, '', '', '', '', 1000.00, '2024-12-12', '2024-12-14', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(56, 13, 4, '', '', '', '', 220.00, '2024-12-08', '2024-12-09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(57, 13, 2, 'ChIJczjP3ur4zYURQB1lgC7SQeo', 'ChIJvSSvubb70YUROZNFpHaDGKg', '(19.3058148, -99.3032743)', '(19.4761297, -99.0750788)', 1000.00, '2024-12-12', '2024-12-13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(58, 16, 2, 'ChIJ__vTAocc0oUR4MjngvxrWsU', NULL, 'undefined', 'undefined', 10000.00, '2024-12-09', '2024-12-10', 10, NULL, 'privado', NULL, 10, NULL, 0.90, 2, 8, NULL, 1, 6, NULL, 900, 'Si');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial`
--

CREATE TABLE `historial` (
  `idUsuario` int(11) NOT NULL,
  `idFormulario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `itinerario`
--

CREATE TABLE `itinerario` (
  `idItinerario` int(11) NOT NULL,
  `idFormulario` int(11) NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `itinerario`
--

INSERT INTO `itinerario` (`idItinerario`, `idFormulario`, `fecha_inicio`, `fecha_fin`, `fecha`) VALUES
(51, 29, '2024-12-11', NULL, NULL),
(52, 29, '2024-12-12', NULL, NULL),
(53, 30, '2024-12-20', NULL, NULL),
(54, 30, '2024-12-21', NULL, NULL),
(55, 31, '2024-12-13', NULL, NULL),
(56, 31, '2024-12-14', NULL, NULL),
(57, 31, '2024-12-15', NULL, NULL),
(58, 31, '2024-12-16', NULL, NULL),
(59, 31, '2024-12-17', NULL, NULL),
(60, 32, '2024-12-06', NULL, NULL),
(61, 33, '2024-12-07', NULL, NULL),
(62, 33, '2024-12-08', NULL, NULL),
(63, 33, '2024-12-09', NULL, NULL),
(64, 34, '2024-12-13', NULL, NULL),
(65, 34, '2024-12-14', NULL, NULL),
(66, 34, '2024-12-15', NULL, NULL),
(67, 34, '2024-12-16', NULL, NULL),
(68, 34, '2024-12-17', NULL, NULL),
(69, 35, '2024-12-06', NULL, NULL),
(70, 35, '2024-12-07', NULL, NULL),
(71, 36, '2024-12-07', NULL, NULL),
(72, 36, '2024-12-08', NULL, NULL),
(73, 36, '2024-12-09', NULL, NULL),
(74, 37, '2024-12-06', NULL, NULL),
(75, 37, '2024-12-07', NULL, NULL),
(76, 37, '2024-12-08', NULL, NULL),
(77, 37, '2024-12-09', NULL, NULL),
(78, 38, '2024-12-06', NULL, NULL),
(79, 38, '2024-12-07', NULL, NULL),
(80, 38, '2024-12-08', NULL, NULL),
(81, 38, '2024-12-09', NULL, NULL),
(82, 38, '2024-12-10', NULL, NULL),
(83, 38, '2024-12-11', NULL, NULL),
(84, 38, '2024-12-12', NULL, NULL),
(85, 38, '2024-12-13', NULL, NULL),
(86, 39, '2024-12-07', NULL, NULL),
(87, 39, '2024-12-08', NULL, NULL),
(88, 39, '2024-12-09', NULL, NULL),
(89, 40, '2024-12-12', NULL, NULL),
(90, 40, '2024-12-13', NULL, NULL),
(91, 41, '2024-12-12', NULL, NULL),
(92, 41, '2024-12-13', NULL, NULL),
(93, 42, '2024-12-09', NULL, NULL),
(94, 42, '2024-12-10', NULL, NULL),
(95, 42, '2024-12-11', NULL, NULL),
(96, 43, '2024-12-08', NULL, NULL),
(97, 43, '2024-12-09', NULL, NULL),
(98, 44, '2024-12-09', NULL, NULL),
(99, 44, '2024-12-10', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `precioactividades`
--

CREATE TABLE `precioactividades` (
  `idprecioActividades` int(11) NOT NULL,
  `Tipo` varchar(100) NOT NULL,
  `identificador` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `precioactividades`
--

INSERT INTO `precioactividades` (`idprecioActividades`, `Tipo`, `identificador`) VALUES
(1, 'Gratuito', 'PRICE_LEVEL_FREE'),
(2, 'Economico', 'PRICE_LEVEL_INEXPENSIVE'),
(3, 'Moderado', 'PRICE_LEVEL_MODERATE'),
(4, 'Costoso', 'PRICE_LEVEL_EXPENSIVE'),
(5, 'Muy costoso', 'PRICE_LEVEL_VERY_EXPENSIVE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preferenciaalojamiento`
--

CREATE TABLE `preferenciaalojamiento` (
  `idFormulario` int(11) NOT NULL,
  `idAlojamiento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `preferenciaalojamiento`
--

INSERT INTO `preferenciaalojamiento` (`idFormulario`, `idAlojamiento`) VALUES
(30, 1),
(31, 2),
(32, 1),
(33, 4),
(34, 4),
(35, 1),
(36, 1),
(37, 1),
(38, 1),
(39, 1),
(40, 1),
(41, 1),
(58, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preferenciacomida`
--

CREATE TABLE `preferenciacomida` (
  `idFormulario` int(11) NOT NULL,
  `idEstablecimiento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `preferenciacomida`
--

INSERT INTO `preferenciacomida` (`idFormulario`, `idEstablecimiento`) VALUES
(33, 1),
(33, 2),
(33, 4),
(34, 3),
(35, 1),
(36, 2),
(37, 3),
(38, 3),
(39, 1),
(40, 2),
(41, 1),
(42, 1),
(43, 1),
(44, 1),
(58, 1),
(58, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preferenciaprecioactividades`
--

CREATE TABLE `preferenciaprecioactividades` (
  `idFormulario` int(11) NOT NULL,
  `idprecioActividades` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `preferenciaprecioactividades`
--

INSERT INTO `preferenciaprecioactividades` (`idFormulario`, `idprecioActividades`) VALUES
(39, 2),
(40, 3),
(42, 2),
(58, 2),
(58, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preferencias`
--

CREATE TABLE `preferencias` (
  `idUsuario` int(11) NOT NULL,
  `idCategorias` int(11) NOT NULL,
  `idSubCat` int(11) DEFAULT NULL,
  `idSubSubCat` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reseña`
--

CREATE TABLE `reseña` (
  `idReseña` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idFormulario` int(11) NOT NULL,
  `Titulo` varchar(50) NOT NULL,
  `Apellidos` varchar(50) NOT NULL,
  `preferencias` varchar(255) DEFAULT NULL,
  `calificacioidUsuarion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reseñas`
--

CREATE TABLE `reseñas` (
  `idReseña` int(11) NOT NULL,
  `titulo` varchar(30) NOT NULL,
  `comentario` varchar(250) DEFAULT NULL,
  `calificacion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultados_comida`
--

CREATE TABLE `resultados_comida` (
  `idResultado` int(11) NOT NULL,
  `idFormulario` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `precio` varchar(50) DEFAULT NULL,
  `valoracion` float DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultados_hospedaje`
--

CREATE TABLE `resultados_hospedaje` (
  `idResultado` int(11) NOT NULL,
  `idFormulario` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `direccion` varchar(50) NOT NULL,
  `calificacion` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subcategorias`
--

CREATE TABLE `subcategorias` (
  `idSubCategoria` int(11) NOT NULL,
  `idCategorias` int(11) NOT NULL,
  `nombre` text DEFAULT NULL,
  `idValor` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `subcategorias`
--

INSERT INTO `subcategorias` (`idSubCategoria`, `idCategorias`, `nombre`, `idValor`) VALUES
(313, 1, 'Galerías de Arte', 'art_gallery'),
(314, 1, 'Estudios Artísticos', 'art_studio'),
(315, 1, 'Auditorio', 'auditorium'),
(316, 1, 'Lugares Emblemáticos', 'cultural_landmark'),
(317, 1, 'Sitios Históricos', 'historical_place'),
(318, 1, 'Teatro de Artes Escénicas', 'performing_arts_theater'),
(319, 1, 'Monumentos', 'monument'),
(320, 1, 'Museos', 'museum'),
(321, 1, 'Escultura', 'sculpture'),
(322, 2, 'Bibliotecas', 'library'),
(323, 3, 'Centro de Deportes de Aventura', 'adventure_sports_center'),
(324, 3, 'Anfiteatro', 'amphitheatre'),
(325, 3, 'Centro de Diversiones', 'amusement_center'),
(326, 3, 'Parque de Diversiones', 'amusement_park'),
(327, 3, 'Acuario', 'aquarium'),
(328, 3, 'Salón de Banquetes', 'banquet_hall'),
(329, 3, 'Zona de Barbacoa', 'barbecue_area'),
(330, 3, 'Jardín Botánico', 'botanical_garden'),
(331, 3, 'Boliche', 'bowling_alley'),
(332, 3, 'Casino', 'casino'),
(333, 3, 'Campamento Infantil', 'childrens_camp'),
(334, 3, 'Club de Comedia', 'comedy_club'),
(335, 3, 'Centro Comunitario', 'community_center'),
(336, 3, 'Sala de Conciertos', 'concert_hall'),
(337, 3, 'Centro de Convenciones', 'convention_center'),
(338, 3, 'Centro Cultural', 'cultural_center'),
(339, 3, 'Parque de Ciclismo', 'cycling_park'),
(340, 3, 'Sala de Baile', 'dance_hall'),
(341, 3, 'Parque para Perros', 'dog_park'),
(342, 3, 'Lugar para Eventos', 'event_venue'),
(343, 3, 'Rueda de la Fortuna', 'ferris_wheel'),
(344, 3, 'Jardín', 'garden'),
(345, 3, 'Zona de Senderismo', 'hiking_area'),
(346, 3, 'Monumento Histórico', 'historical_landmark'),
(347, 3, 'Café Internet', 'internet_cafe'),
(348, 3, 'Karaoke', 'karaoke'),
(349, 3, 'Marina', 'marina'),
(350, 3, 'Alquiler de Películas', 'movie_rental'),
(351, 3, 'Cine', 'movie_theater'),
(352, 3, 'Parque Nacional', 'national_park'),
(353, 3, 'Club Nocturno', 'night_club'),
(354, 3, 'Mirador', 'observation_deck'),
(355, 3, 'Zona Todoterreno', 'off_roading_area'),
(356, 3, 'Teatro de Ópera', 'opera_house'),
(357, 3, 'Parque', 'park'),
(358, 3, 'Sala Filarmónica', 'philharmonic_hall'),
(359, 3, 'Zona de Picnic', 'picnic_ground'),
(360, 3, 'Planetario', 'planetarium'),
(361, 3, 'Plaza', 'plaza'),
(362, 3, 'Montaña Rusa', 'roller_coaster'),
(363, 3, 'Parque de Patinetas', 'skateboard_park'),
(364, 3, 'Parque Estatal', 'state_park'),
(365, 3, 'Atracción Turística', 'tourist_attraction'),
(366, 3, 'Arcade de Videojuegos', 'video_arcade'),
(367, 3, 'Centro de Visitantes', 'visitor_center'),
(368, 3, 'Parque Acuático', 'water_park'),
(369, 3, 'Lugar para Bodas', 'wedding_venue'),
(370, 3, 'Parque de Vida Silvestre', 'wildlife_park'),
(371, 3, 'Refugio de Vida Silvestre', 'wildlife_refuge'),
(372, 3, 'Zoológico', 'zoo'),
(373, 4, 'Playa', 'beach'),
(374, 5, 'Iglesia', 'church'),
(375, 5, 'Templo Hindú', 'hindu_temple'),
(376, 5, 'Mezquita', 'mosque'),
(377, 5, 'Sinagoga', 'synagogue'),
(378, 6, 'Esteticista', 'beautician'),
(379, 6, 'Salón de Belleza', 'beauty_salon'),
(380, 6, 'Servicio de Arte Corporal', 'body_art_service'),
(381, 6, 'Floristería', 'florist'),
(382, 6, 'Cuidado del Cabello', 'hair_care'),
(383, 6, 'Peluquería', 'hair_salon'),
(384, 6, 'Artista de Maquillaje', 'makeup_artist'),
(385, 6, 'Salón de Uñas', 'nail_salon'),
(386, 6, 'Centro de Información Turística', 'tourist_information_center'),
(387, 1, 'Galerías de Arte', 'art_gallery'),
(388, 1, 'Estudios Artísticos', 'art_studio'),
(389, 1, 'Auditorio', 'auditorium'),
(390, 1, 'Lugares Emblemáticos', 'cultural_landmark'),
(391, 1, 'Sitios Históricos', 'historical_place'),
(392, 1, 'Teatro de Artes Escénicas', 'performing_arts_theater'),
(393, 1, 'Monumentos', 'monument'),
(394, 1, 'Museos', 'museum'),
(395, 1, 'Escultura', 'sculpture'),
(396, 2, 'Bibliotecas', 'library'),
(397, 3, 'Centro de Deportes de Aventura', 'adventure_sports_center'),
(398, 3, 'Anfiteatro', 'amphitheatre'),
(399, 3, 'Centro de Diversiones', 'amusement_center'),
(400, 3, 'Parque de Diversiones', 'amusement_park'),
(401, 3, 'Acuario', 'aquarium'),
(402, 3, 'Salón de Banquetes', 'banquet_hall'),
(403, 3, 'Zona de Barbacoa', 'barbecue_area'),
(404, 3, 'Jardín Botánico', 'botanical_garden'),
(405, 3, 'Boliche', 'bowling_alley'),
(406, 3, 'Casino', 'casino'),
(407, 3, 'Campamento Infantil', 'childrens_camp'),
(408, 3, 'Club de Comedia', 'comedy_club'),
(409, 3, 'Centro Comunitario', 'community_center'),
(410, 3, 'Sala de Conciertos', 'concert_hall'),
(411, 3, 'Centro de Convenciones', 'convention_center'),
(412, 3, 'Centro Cultural', 'cultural_center'),
(413, 3, 'Parque de Ciclismo', 'cycling_park'),
(414, 3, 'Sala de Baile', 'dance_hall'),
(415, 3, 'Parque para Perros', 'dog_park'),
(416, 3, 'Lugar para Eventos', 'event_venue'),
(417, 3, 'Rueda de la Fortuna', 'ferris_wheel'),
(418, 3, 'Jardín', 'garden'),
(419, 3, 'Zona de Senderismo', 'hiking_area'),
(420, 3, 'Monumento Histórico', 'historical_landmark'),
(421, 3, 'Café Internet', 'internet_cafe'),
(422, 3, 'Karaoke', 'karaoke'),
(423, 3, 'Marina', 'marina'),
(424, 3, 'Alquiler de Películas', 'movie_rental'),
(425, 3, 'Cine', 'movie_theater'),
(426, 3, 'Parque Nacional', 'national_park'),
(427, 3, 'Club Nocturno', 'night_club'),
(428, 3, 'Mirador', 'observation_deck'),
(429, 3, 'Zona Todoterreno', 'off_roading_area'),
(430, 3, 'Teatro de Ópera', 'opera_house'),
(431, 3, 'Parque', 'park'),
(432, 3, 'Sala Filarmónica', 'philharmonic_hall'),
(433, 3, 'Zona de Picnic', 'picnic_ground'),
(434, 3, 'Planetario', 'planetarium'),
(435, 3, 'Plaza', 'plaza'),
(436, 3, 'Montaña Rusa', 'roller_coaster'),
(437, 3, 'Parque de Patinetas', 'skateboard_park'),
(438, 3, 'Parque Estatal', 'state_park'),
(439, 3, 'Atracción Turística', 'tourist_attraction'),
(440, 3, 'Arcade de Videojuegos', 'video_arcade'),
(441, 3, 'Centro de Visitantes', 'visitor_center'),
(442, 3, 'Parque Acuático', 'water_park'),
(443, 3, 'Lugar para Bodas', 'wedding_venue'),
(444, 3, 'Parque de Vida Silvestre', 'wildlife_park'),
(445, 3, 'Refugio de Vida Silvestre', 'wildlife_refuge'),
(446, 3, 'Zoológico', 'zoo'),
(447, 4, 'Playa', 'beach'),
(448, 5, 'Iglesia', 'church'),
(449, 5, 'Templo Hindú', 'hindu_temple'),
(450, 5, 'Mezquita', 'mosque'),
(451, 5, 'Sinagoga', 'synagogue'),
(452, 6, 'Esteticista', 'beautician'),
(453, 6, 'Salón de Belleza', 'beauty_salon'),
(454, 6, 'Servicio de Arte Corporal', 'body_art_service'),
(455, 6, 'Floristería', 'florist'),
(456, 6, 'Cuidado del Cabello', 'hair_care'),
(457, 6, 'Peluquería', 'hair_salon'),
(458, 6, 'Artista de Maquillaje', 'makeup_artist'),
(459, 6, 'Salón de Uñas', 'nail_salon'),
(460, 6, 'Centro de Información Turística', 'tourist_information_center'),
(461, 7, 'Tienda de Abarrotes Asiáticos', 'asian_grocery_store'),
(462, 7, 'Tienda de Autopartes', 'auto_parts_store'),
(463, 7, 'Tienda de Bicicletas', 'bicycle_store'),
(464, 7, 'Librería', 'book_store'),
(465, 7, 'Carnicería', 'butcher_shop'),
(466, 7, 'Tienda de Celulares', 'cell_phone_store'),
(467, 7, 'Tienda de Ropa', 'clothing_store'),
(468, 7, 'Tienda de Conveniencia', 'convenience_store'),
(469, 7, 'Tienda Departamental', 'department_store'),
(470, 7, 'Tienda de Descuentos', 'discount_store'),
(471, 7, 'Tienda de Electrónica', 'electronics_store'),
(472, 7, 'Tienda de Alimentos', 'food_store'),
(473, 7, 'Mueblería', 'furniture_store'),
(474, 7, 'Tienda de Regalos', 'gift_shop'),
(475, 7, 'Supermercado', 'grocery_store'),
(476, 7, 'Ferretería', 'hardware_store'),
(477, 7, 'Tienda de Artículos para el Hogar', 'home_goods_store'),
(478, 7, 'Tienda de Mejoras para el Hogar', 'home_improvement_store'),
(479, 7, 'Joyería', 'jewelry_store'),
(480, 7, 'Licorería', 'liquor_store'),
(481, 7, 'Mercado', 'market'),
(482, 7, 'Tienda de Mascotas', 'pet_store'),
(483, 7, 'Zapatería', 'shoe_store'),
(484, 7, 'Centro Comercial', 'shopping_mall'),
(485, 7, 'Tienda de Artículos Deportivos', 'sporting_goods_store'),
(486, 7, 'Tienda', 'store'),
(487, 7, 'Supermercado', 'supermarket'),
(488, 7, 'Tienda de Almacén', 'warehouse_store'),
(489, 7, 'Mayorista', 'wholesaler'),
(490, 8, 'Arena', 'arena'),
(491, 8, 'Campo Atlético', 'athletic_field'),
(492, 8, 'Excursión de Pesca', 'fishing_charter'),
(493, 8, 'Estanque de Pesca', 'fishing_pond'),
(494, 8, 'Gimnasio', 'fitness_center'),
(495, 8, 'Campo de Golf', 'golf_course'),
(496, 8, 'Gimnasio', 'gym'),
(497, 8, 'Pista de Patinaje sobre Hielo', 'ice_skating_rink'),
(498, 8, 'Parque Infantil', 'playground'),
(499, 8, 'Resort de Esquí', 'ski_resort'),
(500, 8, 'Lugar de Actividades Deportivas', 'sports_activity_location'),
(501, 8, 'Club Deportivo', 'sports_club'),
(502, 8, 'Entrenamiento Deportivo', 'sports_coaching'),
(503, 8, 'Complejo Deportivo', 'sports_complex'),
(504, 8, 'Estadio', 'stadium'),
(505, 8, 'Piscina', 'swimming_pool');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellidos` varchar(50) NOT NULL,
  `NumCel` varchar(10) DEFAULT NULL,
  `Pais` varchar(30) DEFAULT NULL,
  `Biografia` longtext NOT NULL,
  `Nacimiento` date NOT NULL,
  `IMAGEN` text DEFAULT NULL,
  `Genero` varchar(20) NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `fec_creac` datetime DEFAULT NULL,
  `token` varchar(64) DEFAULT NULL,
  `token_expiracion` datetime DEFAULT NULL,
  `verificado` tinyint(1) DEFAULT 0,
  `token_password` varchar(32) DEFAULT NULL,
  `fec_creac_password` datetime DEFAULT NULL,
  `token_password_expiracion` datetime DEFAULT NULL,
  `token_verificacion_exp` datetime DEFAULT NULL,
  `preferencias` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `Nombre`, `Apellidos`, `NumCel`, `Pais`, `Biografia`, `Nacimiento`, `IMAGEN`, `Genero`, `email`, `password`, `fec_creac`, `token`, `token_expiracion`, `verificado`, `token_password`, `fec_creac_password`, `token_password_expiracion`, `token_verificacion_exp`, `preferencias`) VALUES
(1, 'Tazin', 'Sahab Gutierritos', '0000000000', 'México', 'Actualizacion #1', '2000-08-22', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FUsuario_%2528inform%25C3%25A1tica%2529&psig=AOvVaw23Kn-00ZX9gbhLU27XvAf5&ust=1730473581854000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIiRzsvyuIkDFQAAAAAdAAAAABAE', 'Masculino', 'tazim@gnail.com', 'password', '2024-10-31 09:26:24', NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL),
(3, 'Mario', 'Pastrana Ortiz', '7352276333', 'MX', ' ', '1999-10-20', NULL, 'masculino', 'ejemplo@hexa.com', '$2y$10$sn8tGqEGD2JMFy/BslD6iuVYptIfHKRnG6egR9bSXbB0/ksYAHKH2', '2024-11-02 23:02:37', NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL),
(4, 'Mario', 'Pastrana Ortiz', '7352276333', 'MX', ' ', '1999-10-20', NULL, 'masculino', 'ejemplo@hexa.com', '$2y$10$NqlATcynWFPLy.9DfNz00e8PXWC8ZoX1Op.2YN69UaJNy2QRNMxFu', '2024-11-02 23:03:28', NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL),
(5, 'Jose', 'Hernandez', '7352276435', 'MX', ' ', '2024-10-02', NULL, 'no-binario', 'jose13@gmail.com', '$2y$10$kDbRpgY1czty4jY91n5eKuiobYIYgK10QUNbIfsttchilJn0vVj7.', '2024-11-02 23:50:55', NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL),
(6, 'Isa', 'Perez', '2345678986', 'México', 'Hola', '2017-10-24', NULL, 'Masculino', 'isa@hotmail.com', '$2y$10$lt3OFxZPF6r4PJ6NKD6.EO4kH7CGB7zITFYm66e6Cevgpb6moNCu6', '2024-11-04 09:12:01', NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL),
(7, 'Ejemplo', 'Usuario', '7353568907', '+52', ' ', '2002-06-11', NULL, 'masculino', 'mocoril478@cpaurl.com', '$2y$10$kt9gJLhAjHYnUg2gHtzTY.xzwFOdZfoZIs86/Og4hQSS8ZDU86toe', '2024-11-23 21:43:56', '1bad3c508ef46536b91460f7c98caec1', NULL, 0, NULL, NULL, NULL, NULL, NULL),
(9, 'Pastrana Barranco', 'Aldebaran', '', '', ' ', '2024-12-21', NULL, 'No especificado', 'aldepb2013@gmail.com', '$2y$10$DsivhN.6DiM3PRBYc1SOl.vpQkJhlCbCegZNoCXFfLTWGiO/F7syO', '2024-11-24 18:15:40', NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL),
(13, 'Ejemplo SEgundp', 'Tercero', '7352276435', '+52', ' ', '2000-06-21', NULL, 'masculino', 'aldeb2411@gmail.com', '$2y$10$PsoZJQH94KX3kP5wnB/QleUc9oo9fbO3FOZ1mSgdeI4x9MoqxHIhu', '2024-11-27 00:50:42', '1ca719189d134c0360eb89df770d554f', NULL, 1, 'f1c1e212f1561b29bee4f4c0cdebae6c', NULL, '2024-12-02 02:42:16', NULL, '[\"historical_place\",\"bowling_alley\",\"community_center\",\"night_club\",\"sports_coaching\"]'),
(14, 'SKDI', 'JDWU', '1234567890', '+52', ' ', '2000-09-12', NULL, 'masculino', 'gowanim660@bflcafe.com', '$2y$10$DkELoxAn1ezFS5DEMIZ2ZOQq0OYNxVyvhdoq/6xXrLSRSJmwIAKf6', '2024-11-27 14:41:15', 'ab52912de6651330202d620dd4c89a09', NULL, 0, NULL, NULL, NULL, NULL, NULL),
(15, 'Benja', 'Nuerdo', NULL, NULL, ' ', '2003-06-10', NULL, 'masculino', 'bewixiy564@eoilup.com', '$2y$10$Op0u63Ko4Q/oEFWLaWUsTe42yel256huhMOZx.VoVKCUT0KhOQhsG', '2024-12-08 21:59:09', 'cf50fbaa8c4b3e7dbc7a1eb9e7062178', NULL, 1, NULL, NULL, NULL, NULL, NULL),
(16, 'Mike', 'Mikeson', NULL, NULL, ' ', '2003-09-10', NULL, 'masculino', 'miklesarwing@gmail.com', '$2y$10$l.h9mrw5/PyR/MigNxoCk.1Rt/w9NpDSIR9vrZrdHexZBZLPDKXyi', '2024-12-09 16:22:26', 'ae2055c8c9af6118494a2a19ddec5575', NULL, 1, NULL, NULL, NULL, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD PRIMARY KEY (`idCategorias`,`idDestino`),
  ADD KEY `idDestino_idx` (`idDestino`);

--
-- Indices de la tabla `alojamiento`
--
ALTER TABLE `alojamiento`
  ADD PRIMARY KEY (`idAlojamiento`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`idCategorias`);

--
-- Indices de la tabla `destino`
--
ALTER TABLE `destino`
  ADD PRIMARY KEY (`idDestino`),
  ADD KEY `idItinerario_idx` (`idItinerario`);

--
-- Indices de la tabla `establecimientoscomida`
--
ALTER TABLE `establecimientoscomida`
  ADD PRIMARY KEY (`idEstablecimiento`);

--
-- Indices de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`idFavoritos`),
  ADD KEY `idUsuario_idx` (`idUsuario`);

--
-- Indices de la tabla `fechasdestinos`
--
ALTER TABLE `fechasdestinos`
  ADD PRIMARY KEY (`IdFechaDestino`),
  ADD KEY `IdFormulario` (`IdFormulario`);

--
-- Indices de la tabla `formulario`
--
ALTER TABLE `formulario`
  ADD PRIMARY KEY (`idFormulario`),
  ADD KEY `idUsuario_idx` (`idUsuario`);

--
-- Indices de la tabla `historial`
--
ALTER TABLE `historial`
  ADD PRIMARY KEY (`idUsuario`,`idFormulario`),
  ADD KEY `idFormulario_idx` (`idFormulario`);

--
-- Indices de la tabla `itinerario`
--
ALTER TABLE `itinerario`
  ADD PRIMARY KEY (`idItinerario`),
  ADD KEY `idFormulario_idx` (`idFormulario`);

--
-- Indices de la tabla `precioactividades`
--
ALTER TABLE `precioactividades`
  ADD PRIMARY KEY (`idprecioActividades`);

--
-- Indices de la tabla `preferenciaalojamiento`
--
ALTER TABLE `preferenciaalojamiento`
  ADD PRIMARY KEY (`idFormulario`,`idAlojamiento`),
  ADD KEY `idAlojamiento` (`idAlojamiento`);

--
-- Indices de la tabla `preferenciacomida`
--
ALTER TABLE `preferenciacomida`
  ADD PRIMARY KEY (`idFormulario`,`idEstablecimiento`),
  ADD KEY `idEstablecimiento` (`idEstablecimiento`);

--
-- Indices de la tabla `preferenciaprecioactividades`
--
ALTER TABLE `preferenciaprecioactividades`
  ADD PRIMARY KEY (`idFormulario`,`idprecioActividades`),
  ADD KEY `idprecioActividades` (`idprecioActividades`);

--
-- Indices de la tabla `preferencias`
--
ALTER TABLE `preferencias`
  ADD PRIMARY KEY (`idUsuario`,`idCategorias`),
  ADD KEY `idUsuario_idx` (`idUsuario`),
  ADD KEY `idCategorias_idx` (`idCategorias`);

--
-- Indices de la tabla `reseña`
--
ALTER TABLE `reseña`
  ADD PRIMARY KEY (`idReseña`),
  ADD KEY `idUsuario` (`idUsuario`),
  ADD KEY `idFormulario` (`idFormulario`);

--
-- Indices de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD PRIMARY KEY (`idReseña`);

--
-- Indices de la tabla `resultados_hospedaje`
--
ALTER TABLE `resultados_hospedaje`
  ADD PRIMARY KEY (`idResultado`);

--
-- Indices de la tabla `subcategorias`
--
ALTER TABLE `subcategorias`
  ADD PRIMARY KEY (`idSubCategoria`,`idCategorias`),
  ADD KEY `idCategorias` (`idCategorias`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alojamiento`
--
ALTER TABLE `alojamiento`
  MODIFY `idAlojamiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `idCategorias` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `destino`
--
ALTER TABLE `destino`
  MODIFY `idDestino` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `establecimientoscomida`
--
ALTER TABLE `establecimientoscomida`
  MODIFY `idEstablecimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  MODIFY `idFavoritos` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fechasdestinos`
--
ALTER TABLE `fechasdestinos`
  MODIFY `IdFechaDestino` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `formulario`
--
ALTER TABLE `formulario`
  MODIFY `idFormulario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de la tabla `itinerario`
--
ALTER TABLE `itinerario`
  MODIFY `idItinerario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT de la tabla `precioactividades`
--
ALTER TABLE `precioactividades`
  MODIFY `idprecioActividades` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  MODIFY `idReseña` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `subcategorias`
--
ALTER TABLE `subcategorias`
  MODIFY `idSubCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=506;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD CONSTRAINT `idCategorias2` FOREIGN KEY (`idCategorias`) REFERENCES `categorias` (`idCategorias`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idDestino` FOREIGN KEY (`idDestino`) REFERENCES `destino` (`idDestino`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `destino`
--
ALTER TABLE `destino`
  ADD CONSTRAINT `idItinerario` FOREIGN KEY (`idItinerario`) REFERENCES `itinerario` (`idItinerario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `idUsuario3` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `fechasdestinos`
--
ALTER TABLE `fechasdestinos`
  ADD CONSTRAINT `fechasdestinos_ibfk_1` FOREIGN KEY (`IdFormulario`) REFERENCES `formulario` (`idFormulario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `formulario`
--
ALTER TABLE `formulario`
  ADD CONSTRAINT `idUsuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `historial`
--
ALTER TABLE `historial`
  ADD CONSTRAINT `idFormulario` FOREIGN KEY (`idFormulario`) REFERENCES `formulario` (`idFormulario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idUsuario2` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `itinerario`
--
ALTER TABLE `itinerario`
  ADD CONSTRAINT `idFormulario2` FOREIGN KEY (`idFormulario`) REFERENCES `formulario` (`idFormulario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `preferenciaalojamiento`
--
ALTER TABLE `preferenciaalojamiento`
  ADD CONSTRAINT `preferenciaalojamiento_ibfk_1` FOREIGN KEY (`idFormulario`) REFERENCES `formulario` (`idFormulario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `preferenciaalojamiento_ibfk_2` FOREIGN KEY (`idAlojamiento`) REFERENCES `alojamiento` (`idAlojamiento`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `preferenciacomida`
--
ALTER TABLE `preferenciacomida`
  ADD CONSTRAINT `preferenciacomida_ibfk_1` FOREIGN KEY (`idFormulario`) REFERENCES `formulario` (`idFormulario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `preferenciacomida_ibfk_2` FOREIGN KEY (`idEstablecimiento`) REFERENCES `establecimientoscomida` (`idEstablecimiento`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `preferenciaprecioactividades`
--
ALTER TABLE `preferenciaprecioactividades`
  ADD CONSTRAINT `preferenciaprecioactividades_ibfk_1` FOREIGN KEY (`idFormulario`) REFERENCES `formulario` (`idFormulario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `preferenciaprecioactividades_ibfk_2` FOREIGN KEY (`idprecioActividades`) REFERENCES `precioactividades` (`idprecioActividades`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `preferencias`
--
ALTER TABLE `preferencias`
  ADD CONSTRAINT `idCategorias` FOREIGN KEY (`idCategorias`) REFERENCES `categorias` (`idCategorias`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idUsuario4` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `reseña`
--
ALTER TABLE `reseña`
  ADD CONSTRAINT `reseña_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reseña_ibfk_2` FOREIGN KEY (`idFormulario`) REFERENCES `formulario` (`idFormulario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `subcategorias`
--
ALTER TABLE `subcategorias`
  ADD CONSTRAINT `subcategorias_ibfk_1` FOREIGN KEY (`idCategorias`) REFERENCES `categorias` (`idCategorias`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
