fetch("/api/rutas")
    .then(res => res.json())
    .then(rutas => {
        // OBTIENE CONTENEDOR
        const contenedor = document.querySelector(".route-container");

        // LIMPIA CONTENEDOR
        contenedor.innerHTML = "";

        // OCULTAR MENSAJE SI HAY RUTAS
        //Por ahora no hay mensaje en el HTML, pero por si esteban quiere agregar uno en caso de que no hayan rutas
        // if (rutas && rutas.length > 0) {
        //     const mensajeRutas = document.getElementById("noCardsAtRutas");
        //     mensajeRutas.style.display = "none";
        // }

        rutas.forEach(ruta => {
            const card = document.createElement("div");
            card.className = "route-card";

            const leftBar = document.createElement("div");
            leftBar.className = "left-bar";

            const content = document.createElement("div");
            content.className = "card-content";

            const h3 = document.createElement("h3");
            h3.innerHTML = `Ruta <span id="nombreRuta">${ruta.rutaNombre}</span>`;

            const details = document.createElement("div");
            details.className = "route-details";

            const pHorarioLabel = document.createElement("p");
            pHorarioLabel.innerHTML = "<strong>Horarios</strong>";

            const pHorario = document.createElement("p");
            pHorario.id = "horarioRuta";
            pHorario.textContent = ruta.rutaHorario;

            const pFrecuencia = document.createElement("p");
            pFrecuencia.innerHTML = `Cada <span id="frecuenciaRuta">${ruta.rutaFrecuencia}</span> Minutos`;

            const pPrecioLabel = document.createElement("p");
            pPrecioLabel.innerHTML = "<strong>Precio</strong>";

            const pPrecio = document.createElement("p");
            pPrecio.innerHTML = `<span id="precioRuta">${ruta.rutaPrecio}</span> Colones`;

            const editarLink = document.createElement("a");
            editarLink.href = "/editar-transporte";
            editarLink.textContent = "Editar Ruta";

            details.appendChild(pHorarioLabel);
            details.appendChild(pHorario);
            details.appendChild(pFrecuencia);
            details.appendChild(pPrecioLabel);
            details.appendChild(pPrecio);

            content.appendChild(h3);
            content.appendChild(details);
            content.appendChild(editarLink);

            card.appendChild(leftBar);
            card.appendChild(content);

            contenedor.appendChild(card);
        });
    })
    .catch(err => console.error("Error al cargar rutas:", err));