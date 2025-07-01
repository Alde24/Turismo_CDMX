// Validación del correo electrónico
            $("#email").on("blur", function() {
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($(this).val())) {
                    $("#emailError").hide();
                } else {
                    $("#emailError").show().text("Por favor, ingresa un correo electrónico válido.");
                }
            });