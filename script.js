// Esperamos a que toda la página HTML cargue
document.addEventListener("DOMContentLoaded", function() {
    
    // Seleccionamos todos los botones de WhatsApp
    const botonesWhatsapp = document.querySelectorAll(".boton-whatsapp");

    // A cada botón le añadimos una acción al hacer clic
    botonesWhatsapp.forEach(function(boton) {
        boton.addEventListener("click", function() {
            alert("¡Pronto esto te llevará directo a mi WhatsApp para comprar!");
        });
    });

});