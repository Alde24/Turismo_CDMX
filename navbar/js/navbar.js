// Cargar el header
fetch('/ADS_Turismo404/navbar/html/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
    });

// Cargar el footer
fetch('/ADS_Turismo404/navbar/html/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });

