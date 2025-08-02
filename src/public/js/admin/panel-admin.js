const tickets = document.querySelectorAll('.ticket');
const filterButtons = document.querySelectorAll('.status-filter button');


// Asignar iconos a los tickets según su tipo
const iconosPorTipo = {
    evento: 'bx bxs-calendar-check',
    anuncio: 'bx bxs-megaphone',
    emprendimiento: 'bx bxs-briefcase-alt',
    reporte: 'bx bxs-error',
    default: 'bx bxs-info-circle'
};

// Actualizar colores de la barra de estado según el estado del ticket (se llama left-bar porque es la misma que se usa en el formulario de transporte)
function ActualizarLeftBar() {
    tickets.forEach(ticket => {
        const statusText = ticket.querySelector('.ticket-status')?.textContent.trim().toLowerCase();
        const leftBar = ticket.querySelector('.left-bar');

        if (leftBar) {
            switch (statusText) {
                case 'rechazado':
                    leftBar.style.backgroundColor = 'red';
                    break;
                case 'aprobado':
                    leftBar.style.backgroundColor = 'green';
                    break;
                case 'nuevo':
                    leftBar.style.backgroundColor = 'var(--azul-claro)';
                    break;
                default:
                    leftBar.style.backgroundColor = 'gray';
            }
        }
    });
}

//poner límite visual de 100 caracteres a las descripciones de los tickets
function limiteDescripciones() {
    tickets.forEach(ticket => {
        const p = ticket.querySelector('p');
        if (!p) return;

        const span = p.querySelector('span.ticket-info');
        const textoCompleto = p.textContent.trim();

        const tipoTexto = span ? span.textContent.trim() : '';
        const descripcionTexto = textoCompleto.replace(tipoTexto, '').trim();

        if (descripcionTexto.length > 100) {
            const nuevaDescripcion = descripcionTexto.substring(0, 100) + '...';
            p.innerHTML = `<span class="ticket-info">${tipoTexto}</span> ${nuevaDescripcion}`;
        }
    });
}

// Filtrar tickets según el estado seleccionado
function filtrarTickets() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.textContent.trim().toLowerCase();

            tickets.forEach(ticket => {
                const statusText = ticket.querySelector('.ticket-status')?.textContent.trim().toLowerCase();

                if (filter === 'todos' || statusText === filter.slice(0, -1)) {
                    ticket.style.display = 'grid';
                } else {
                    ticket.style.display = 'none';
                }
            });
        });
    });
}

// Redireccionar al formulario correspondiente al hacer clic en un ticket
function redireccionarFormulario() {
    tickets.forEach(ticket => {
        ticket.addEventListener('click', () => {
            const tipo = ticket.dataset.tipo;
            switch (tipo) {
                case 'evento':
                    window.location.href = '/form-evento';
                    break;
                case 'anuncio':
                    window.location.href = '/form-anuncio';
                    break;
                case 'emprendimiento':
                    window.location.href = '/form-emprendimiento';
                    break;
                case 'reporte':
                    window.location.href = '/form-reporte';
                    break;
                default:
                    console.warn('Tipo de ticket no reconocido:', tipo);
            }
        });
    });
}

// Ejecutar funciones
ActualizarLeftBar();
limiteDescripciones();
filtrarTickets();
redireccionarFormulario();
