fetch("/api/eventos")
    .then(res => res.json())
    .then(eventos => {
            //OBTIENE CONTENEDORES
            const contenedorNuevos = document.getElementById("cards-container-new");
            const contenedorRandoms = document.getElementById("cards-container-random");
            const contenedorTodos = document.getElementById("cards-container-all");

            //LIMPIA CONTENEDORES
            contenedorNuevos.innerHTML = "";
            contenedorRandoms.innerHTML = "";
            contenedorTodos.innerHTML = "";

            //BORRA MENSAJES SOLO SI ENCUENTRA EVENTOS
            if (eventos && eventos.length > 0) {
                const mensajeEventos = document.querySelectorAll(".no-created");
                mensajeEventos.forEach(mensaje => {
                    mensaje.style.display = "none";
                });
            }


            //INICIA A PINTAR LOS ULTIMOS 4 EVENTOS AGREGADOS

            for(i=(eventos.length - 1); i>(eventos.length-5); i--){
                const evento = eventos[i];
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

                //PAGINA ESPECIFICA DE EVENTO > RUTA ES /evento-informacion
                const boton = document.createElement("button");
                boton.className = "ver-detalles-btn";
                boton.textContent = "Ver Detalles";

                boton.addEventListener("click", async () => {
                //PARA OBTENER ESE EVENTO EN ESPECIFICO
                    const nombreEvento = titulo.textContent;

                    try {
                        const res = await fetch("/api/seleccionar-evento", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ nombreEvento })
                        });

                        if (res.ok) {
                            // Redirige al HTML que mostrará la información del evento
                            window.location.href = "/evento-informacion";
                        } else {
                            console.error("Error al seleccionar el evento");
                        }
                    } catch (err) {
                        console.error("Error en la petición:", err);
                    }
                });

                texto.appendChild(titulo);
                texto.appendChild(subtitulo);
                //DEBO DE AGREGAR DESPUES EL BOTON
                texto.appendChild(boton);
                card.appendChild(imagen);
                card.appendChild(texto);
                contenedorNuevos.appendChild(card);
            }

            //FIN DE LOS ULTIMOS 4 EVENTOS




            //AQUI SE PINTA INFORMACION PARA LA SECCION DE EVENTOS POPULARES Y SE TOMAN LOS RANDOM

            //MEZCLA EL ARREGLO PARA LAS SECCIONES RANDOM
            const eventosAleatorios = eventos
            //MEZCLA EL ARRAY
            .sort(() => Math.random() - 0.5)
            //TOMA DESDE EL 0 HASTA MENOR A 4 PORQUE SINO MUESTRA TODOS Y NO ES LA IDEA (EN EL FEED)
            .slice(0, 4);

            //CREA EVENTOS POPULARES (LOS TOMA DE FORMA ALEATORIA)
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
                    contenedorRandoms.appendChild(card);
                }
            );


            //TERMINA EVENTOS POPULARES (RANDOM)



            //INICIA A PINTAR TODOS LOS DEMAS EVENTOS CON UN FOR EACH (PINTA TODOS POR IGUAL)

            eventos.forEach(evento => {
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
                    contenedorTodos.appendChild(card);
                }
            )

            //TERMINA DE PINTAR A TODAS LAS RUTAS POR IGUAL

        }
    )
    .catch(err => console.error("Error al cargar eventos:", err));