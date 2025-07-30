    //EVENTOS DEL FEED
    
    fetch("/api/eventos")
    .then(res => res.json())
    .then(eventos => {
            //OBTIENE CONTENEDORES
            const contenedor = document.getElementById("cards-eventos");

            //LIMPIA CONTENEDORES
            contenedor.innerHTML = "";


            //MENSAJES OCULTOS EN EVENTOS, solo se muestran si no contenido
            if (eventos && eventos.length > 0) {
                const mensajes = document.querySelectorAll(".no-created");
                mensajes.forEach(mensaje => {
                    mensaje.classList.add("no-content-to-show");
                });
            }


            const eventosAleatorios = eventos
                //MEZCLA EL ARRAY
                .sort(() => Math.random() - 0.5)
                //TOMA DESDE EL 0 HASTA MENOR A 4 PORQUE SINO MUESTRA TODOS Y NO ES LA IDEA (EN EL FEED)
                .slice(0, 4);

                eventosAleatorios.forEach(evento => {
                    const card = document.createElement("div");
                    card.className = "card";

                    const imagen = document.createElement("div");
                    imagen.className = `card-image ${evento.claseImagen || "default"}`;

                    const texto = document.createElement("div");
                    texto.className = "card-text-container";

                    const titulo = document.createElement("p");
                    titulo.className = "card-title";
                    titulo.textContent = evento.eventName;

                    const subtitulo = document.createElement("p");
                    subtitulo.className = "card-subtitle";
                    subtitulo.textContent = evento.direction;

                    texto.appendChild(titulo);
                    texto.appendChild(subtitulo);
                    card.appendChild(imagen);
                    card.appendChild(texto);
                    contenedor.appendChild(card);
                }
            );
        }
    )
    .catch(err => console.error("Error al cargar eventos:", err));


