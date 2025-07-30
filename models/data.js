const contenedor = document.getElementById("advertisement-father");

// Limpiar si ya hay contenido (opcional)
contenedor.innerHTML = "";

anuncios.forEach(anuncio => {
  // Crear tarjeta
    const card = document.createElement("div");
    card.className = "route-card-anuncios";

    // Crear barra izquierda
    const leftBar = document.createElement("div");
    leftBar.className = "left-bar";

    // Crear contenido
    const content = document.createElement("div");
    content.className = "card-content-anuncios";

    // Título
    const h3 = document.createElement("h3");
    h3.textContent = anuncio.titulo;

    // Detalles
    const detalles = document.createElement("div");
    detalles.className = "route-details-anuncios";

    // Día
    const pDiaLabel = document.createElement("p");
    pDiaLabel.innerHTML = "<strong>Día:</strong>";
    const pDia = document.createElement("p");
    pDia.textContent = anuncio.dia;

    // Hora
    const pHoraLabel = document.createElement("p");
    pHoraLabel.innerHTML = "<strong>Hora:</strong>";
    const pHora = document.createElement("p");
    pHora.textContent = anuncio.hora;

    // Ubicación
    const pUbiLabel = document.createElement("p");
    pUbiLabel.innerHTML = "<strong>Ubicación:</strong>";
    const pUbi = document.createElement("p");
    pUbi.textContent = anuncio.ubicacion;

    // Armar estructura
    detalles.appendChild(pDiaLabel);
    detalles.appendChild(pDia);
    detalles.appendChild(pHoraLabel);
    detalles.appendChild(pHora);
    detalles.appendChild(pUbiLabel);
    detalles.appendChild(pUbi);

    content.appendChild(h3);
    content.appendChild(detalles);

    card.appendChild(leftBar);
    card.appendChild(content);

    // Agregar la card al contenedor padre
    contenedor.appendChild(card);
});