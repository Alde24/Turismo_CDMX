<?php
include "../../BasedeDatos/php/Conexion_base_datos.php";
session_start();

if (!isset($_SESSION['email'])) {
    echo json_encode(["status" => "error", "message" => "Usuario no autenticado."]);
    exit();
}

$email = $_SESSION['email'];

$stmt = $conn->prepare("DELETE FROM usuario WHERE email = ?");
if ($stmt) {
    $stmt->bind_param("s", $email);
    if ($stmt->execute()) {
        // Cierra sesión después de eliminar la cuenta
        session_destroy();
        echo json_encode(["message" => "Cuenta eliminada exitosamente."]);
        //echo json_encode(["success" => true, "message" => "Cuenta eliminada exitosamente."]);
        //echo json_encode(["status" => "success", "message" => "Cuenta eliminada exitosamente."]);
    } else {
        echo json_encode(["error" => "Error al eliminar la cuenta"]);
        //echo json_encode(["status" => "error", "message" => "Error al eliminar la cuenta."]);
    }
    $stmt->close();
} else {
    echo json_encode(["error" => "Error al preparar la consulta."]);
    //echo json_encode(["status" => "error", "message" => "Error al preparar la consulta."]);
}

$conn->close();
