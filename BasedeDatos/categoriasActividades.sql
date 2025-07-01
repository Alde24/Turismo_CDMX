/*INSERTAR REGISTROS DE CATEGORIAS:*/
INSERT INTO categorias (Nombre) VALUES 
("Cultura"), ("Educación"), ("Ocio y Entretenimiento"),
("Elementos naturales"), ("Lugares de Culto"), ("Servicios"),
("Compras"), ("Deportes");

/*Insertar regitsros de subcategorias*/
/*Cultura*/
INSERT INTO subCategorias (idCategorias, nombre, idValor) VALUES
(1, "Galerías de Arte", "art_gallery"),
(1, "Estudios Artísticos", "art_studio"),
(1, "Auditorio", "auditorium"),
(1, "Lugares Emblemáticos", "cultural_landmark"),
(1, "Sitios Históricos", "historical_place"),
(1, "Teatro de Artes Escénicas", "performing_arts_theater"),
(1, "Monumentos", "monument"),
(1, "Museos", "museum"),
(1, "Escultura", "sculpture");

/*Educacion*/
INSERT INTO subCategorias (idCategorias, nombre, idValor) VALUES
(2, "Bibliotecas", "library");


/*Ocio y entretenimineto*/
INSERT INTO subCategorias (idCategorias, nombre, idValor) VALUES
(3, "Centro de Deportes de Aventura", "adventure_sports_center"),
(3, "Anfiteatro", "amphitheatre"),
(3, "Centro de Diversiones", "amusement_center"),
(3, "Parque de Diversiones", "amusement_park"),
(3, "Acuario", "aquarium"),
(3, "Salón de Banquetes", "banquet_hall"),
(3, "Zona de Barbacoa", "barbecue_area"),
(3, "Jardín Botánico", "botanical_garden"),
(3, "Boliche", "bowling_alley"),
(3, "Casino", "casino"),
(3, "Campamento Infantil", "childrens_camp"),
(3, "Club de Comedia", "comedy_club"),
(3, "Centro Comunitario", "community_center"),
(3, "Sala de Conciertos", "concert_hall"),
(3, "Centro de Convenciones", "convention_center"),
(3, "Centro Cultural", "cultural_center"),
(3, "Parque de Ciclismo", "cycling_park"),
(3, "Sala de Baile", "dance_hall"),
(3, "Parque para Perros", "dog_park"),
(3, "Lugar para Eventos", "event_venue"),
(3, "Rueda de la Fortuna", "ferris_wheel"),
(3, "Jardín", "garden"),
(3, "Zona de Senderismo", "hiking_area"),
(3, "Monumento Histórico", "historical_landmark"),
(3, "Café Internet", "internet_cafe"),
(3, "Karaoke", "karaoke"),
(3, "Marina", "marina"),
(3, "Alquiler de Películas", "movie_rental"),
(3, "Cine", "movie_theater"),
(3, "Parque Nacional", "national_park"),
(3, "Club Nocturno", "night_club"),
(3, "Mirador", "observation_deck"),
(3, "Zona Todoterreno", "off_roading_area"),
(3, "Teatro de Ópera", "opera_house"),
(3, "Parque", "park"),
(3, "Sala Filarmónica", "philharmonic_hall"),
(3, "Zona de Picnic", "picnic_ground"),
(3, "Planetario", "planetarium"),
(3, "Plaza", "plaza"),
(3, "Montaña Rusa", "roller_coaster"),
(3, "Parque de Patinetas", "skateboard_park"),
(3, "Parque Estatal", "state_park"),
(3, "Atracción Turística", "tourist_attraction"),
(3, "Arcade de Videojuegos", "video_arcade"),
(3, "Centro de Visitantes", "visitor_center"),
(3, "Parque Acuático", "water_park"),
(3, "Lugar para Bodas", "wedding_venue"),
(3, "Parque de Vida Silvestre", "wildlife_park"),
(3, "Refugio de Vida Silvestre", "wildlife_refuge"),
(3, "Zoológico", "zoo");


/*Elementos naturales*/
INSERT INTO subCategorias (idCategorias, nombre, idValor) VALUES
(4, "Playa", "beach");

/*Lugares de culto*/
INSERT INTO subCategorias (idCategorias, nombre, idValor) VALUES
(5, "Iglesia", "church"),
(5, "Templo Hindú", "hindu_temple"),
(5, "Mezquita", "mosque"),
(5, "Sinagoga", "synagogue");

/*Servicios*/
INSERT INTO subCategorias (idCategorias, nombre, idValor) VALUES
(6, "Esteticista", "beautician"),
(6, "Salón de Belleza", "beauty_salon"),
(6, "Servicio de Arte Corporal", "body_art_service"),
(6, "Floristería", "florist"),
(6, "Cuidado del Cabello", "hair_care"),
(6, "Peluquería", "hair_salon"),
(6, "Artista de Maquillaje", "makeup_artist"),
(6, "Salón de Uñas", "nail_salon"),
(6, "Centro de Información Turística", "tourist_information_center");

/*Compras*/
INSERT INTO subCategorias (idCategorias, nombre, idValor) VALUES
(7, "Tienda de Abarrotes Asiáticos", "asian_grocery_store"),
(7, "Tienda de Autopartes", "auto_parts_store"),
(7, "Tienda de Bicicletas", "bicycle_store"),
(7, "Librería", "book_store"),
(7, "Carnicería", "butcher_shop"),
(7, "Tienda de Celulares", "cell_phone_store"),
(7, "Tienda de Ropa", "clothing_store"),
(7, "Tienda de Conveniencia", "convenience_store"),
(7, "Tienda Departamental", "department_store"),
(7, "Tienda de Descuentos", "discount_store"),
(7, "Tienda de Electrónica", "electronics_store"),
(7, "Tienda de Alimentos", "food_store"),
(7, "Mueblería", "furniture_store"),
(7, "Tienda de Regalos", "gift_shop"),
(7, "Supermercado", "grocery_store"),
(7, "Ferretería", "hardware_store"),
(7, "Tienda de Artículos para el Hogar", "home_goods_store"),
(7, "Tienda de Mejoras para el Hogar", "home_improvement_store"),
(7, "Joyería", "jewelry_store"),
(7, "Licorería", "liquor_store"),
(7, "Mercado", "market"),
(7, "Tienda de Mascotas", "pet_store"),
(7, "Zapatería", "shoe_store"),
(7, "Centro Comercial", "shopping_mall"),
(7, "Tienda de Artículos Deportivos", "sporting_goods_store"),
(7, "Tienda", "store"),
(7, "Supermercado", "supermarket"),
(7, "Tienda de Almacén", "warehouse_store"),
(7, "Mayorista", "wholesaler")



/*Deportes*/
INSERT INTO subCategorias (idCategorias, nombre, idValor) VALUES
(8, "Arena", "arena"),
(8, "Campo Atlético", "athletic_field"),
(8, "Excursión de Pesca", "fishing_charter"),
(8, "Estanque de Pesca", "fishing_pond"),
(8, "Gimnasio", "fitness_center"),
(8, "Campo de Golf", "golf_course"),
(8, "Gimnasio", "gym"),
(8, "Pista de Patinaje sobre Hielo", "ice_skating_rink"),
(8, "Parque Infantil", "playground"),
(8, "Resort de Esquí", "ski_resort"),
(8, "Lugar de Actividades Deportivas", "sports_activity_location"),
(8, "Club Deportivo", "sports_club"),
(8, "Entrenamiento Deportivo", "sports_coaching"),
(8, "Complejo Deportivo", "sports_complex"),
(8, "Estadio", "stadium"),
(8, "Piscina", "swimming_pool");

UPDATE categorias SET Imagen="/ADS_Turismo404/editarperfil/images/categoryimg/cultural.png" where idCategorias=1;
UPDATE categorias SET Imagen="/ADS_Turismo404/editarperfil/images/categoryimg/education.png" where idCategorias=2;
UPDATE categorias SET Imagen="/ADS_Turismo404/editarperfil/images/categoryimg/entretenimiento.png" where idCategorias=3;
UPDATE categorias SET Imagen="/ADS_Turismo404/editarperfil/images/categoryimg/naturaleza.png" where idCategorias=4;
UPDATE categorias SET Imagen="/ADS_Turismo404/editarperfil/images/categoryimg/religioso.png" where idCategorias=5;
UPDATE categorias SET Imagen="/ADS_Turismo404/editarperfil/images/categoryimg/relax.png" where idCategorias=6;
UPDATE categorias SET Imagen="/ADS_Turismo404/editarperfil/images/categoryimg/compras.png" where idCategorias=7;
UPDATE categorias SET Imagen="/ADS_Turismo404/editarperfil/images/categoryimg/deportes.png" where idCategorias=8;