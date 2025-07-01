var swiper = new Swiper(".mySwiper1", {
  slidesPerView: 3, // Número de tarjetas visibles en pantallas grandes
  spaceBetween: 50, // Espacio entre tarjetas
  navigation: {
      nextEl: "#SwiperNextRecomendado",
      prevEl: "#SwiperPrevRecomendado",
  },
  breakpoints: {
      // Configuración para pantallas pequeñas
      0: { // Móviles pequeños
          slidesPerView: 1,
          spaceBetween: 10,
      },
      576: { // Tabletas
          slidesPerView: 2,
          spaceBetween: 20,
      },
      768: { // Pantallas medianas en adelante
          slidesPerView: 3,
          spaceBetween: 30,
      }
  }
});

var swiper = new Swiper(".itinerariosSwiper", {
    slidesPerView: 3, // Número de tarjetas visibles en pantallas grandes
    spaceBetween: 50, // Espacio entre tarjetas
    navigation: {
        nextEl: "#SwiperNextItinerario",
        prevEl: "#SwiperNextItinerario",
    },
    breakpoints: {
        // Configuración para pantallas pequeñas
        0: { // Móviles pequeños
            slidesPerView: 1,
            spaceBetween: 10,
        },
        576: { // Tabletas
            slidesPerView: 2,
            spaceBetween: 20,
        },
        768: { // Pantallas medianas en adelante
            slidesPerView: 3,
            spaceBetween: 30,
        }
    }
  });