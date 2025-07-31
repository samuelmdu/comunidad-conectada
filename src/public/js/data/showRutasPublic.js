fetch("/api/rutas")
    .then(res => res.json())
    .then(rutas => {
            //OBTIENE CONTENEDORES
            const contenedor = document.querySelector(".route-container");

            //LIMPIA CONTENEDORES
            contenedor.innerHTML = "";


            //MENSAJES OCULTOS EN EVENTOS, solo se muestran si no contenido
            if (rutas && rutas.length > 0) {
                const mensajeRutas = document.getElementById("noCardsAtRutas");
                mensajeRutas.style.display = "none";
            }


                rutas.forEach(ruta => {
                    const card = document.createElement("div");
                    card.className = "route-card";

                    const leftBar = document.createElement("div");
                    leftBar.className = "left-bar";

                    const content = document.createElement("div");
                    content.className = "card-content";

                    const h3 = document.createElement("h3");
                    h3.innerHTML = `Ruta <span>${ruta.rutaNombre}</span>`;

                    const details = document.createElement("div");
                    details.className = "route-details";

                    const pHorarioLabel = document.createElement("p");
                    pHorarioLabel.innerHTML = "<strong>Horarios</strong>";

                    const pHorario = document.createElement("p");
                    pHorario.textContent = ruta.rutaHorario;

                    const pFrecuencia = document.createElement("p");
                    pFrecuencia.innerHTML = `Cada <span>${ruta.rutaFrecuencia}</span> Minutos`;

                    const pPrecioLabel = document.createElement("p");
                    pPrecioLabel.innerHTML = "<strong>Precio</strong>";

                    const pPrecio = document.createElement("p");
                    pPrecio.innerHTML = `<span>${ruta.rutaPrecio}</span> Colones`;

                    details.appendChild(pHorarioLabel);
                    details.appendChild(pHorario);
                    details.appendChild(pFrecuencia);
                    details.appendChild(pPrecioLabel);
                    details.appendChild(pPrecio);

                    content.appendChild(h3);
                    content.appendChild(details);

                    card.appendChild(leftBar);
                    card.appendChild(content);

                    contenedor.appendChild(card);
                }
            );
        }
    )
    .catch(err => console.error("Error al cargar rutas:", err));