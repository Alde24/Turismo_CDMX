
// Manejar clics en las estrellas de favoritos
favoritesContainer.addEventListener("click", event => {
    if (event.target.classList.contains("favorite-icon")) {
        const card = event.target.closest(".card");
        if (favoritesContainer.contains(card)) {
            card.style.transition = "all 0.3s ease"; // Agregar animación para transición suave
            card.style.transform = "scale(0)"; // Reducir el tamaño de la tarjeta a 0 antes de eliminarla
            setTimeout(() => {
                favoritesContainer.removeChild(card); // Eliminar la tarjeta después de la animación
            }, 300); // Espera el tiempo de la animación para eliminar la tarjeta
        }
    }
});

// Sección de Visitados Recientemente
const recentlyVisitedContainer = document.querySelectorAll(".card-container")[0]; // Primera card-container
const recentlyVisitedStars = recentlyVisitedContainer.querySelectorAll(".favorite-icon");

recentlyVisitedStars.forEach(star => {
    // Establecer las estrellas grises
    star.classList.add("gray");
    star.addEventListener("click", () => {
        star.classList.toggle("gold");
        star.classList.toggle("gray");
    });
});

function goBack() {
    window.history.back();
}