function deleteItinerary(event, button) {
    event.stopPropagation();

    const itineraryCard = button.parentElement;
    itineraryCard.remove();

    const itineraries = document.querySelectorAll('.itinerary-card');
    if (itineraries.length === 0) {
        const grid = document.querySelector('.itineraries-grid');
        const message = document.createElement('p');
        message.textContent = 'No tienes itinerarios para mostrar.';
        message.classList.add('no-itineraries-message');
        grid.appendChild(message);
    }
}

function goBack() {
    window.history.back();
}



