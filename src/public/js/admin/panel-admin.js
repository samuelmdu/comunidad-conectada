document.addEventListener('DOMContentLoaded', () => {

    const tickets = document.querySelectorAll('.ticket');
    const filterButtons = document.querySelectorAll('.status-filter button');

    const buttonToStatus = {
        'todos': 'all',
        'nuevos': 'pending',
        'aprobados': 'approved',
        'rechazados': 'rejected'
    };

    function filtrarTickets() {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const btnText = button.textContent.trim().toLowerCase();
                const mappedFilter = buttonToStatus[btnText] || 'all';

                tickets.forEach(ticket => {
                    const status = ticket.dataset.status; // 'pending' | 'approved' | 'rejected'
                    const leftBar = ticket.querySelector('.left-bar');

                    // Actualizar colores según el estado en la DB
                    if (leftBar) {
                        switch (status) {
                            case 'pending':
                                leftBar.style.backgroundColor = 'var(--azul-claro)';
                                break;
                            case 'approved':
                                leftBar.style.backgroundColor = 'green';
                                break;
                            case 'rejected':
                                leftBar.style.backgroundColor = 'red';
                                break;
                            default:
                                leftBar.style.backgroundColor = 'gray';
                        }
                    }

                    // Aplicar filtro (mappedFilter == 'all' muestra todo)
                    if (mappedFilter === 'all' || mappedFilter === status) {
                        ticket.style.display = 'grid';
                    } else {
                        ticket.style.display = 'none';
                    }
                });
            });
        });
    }

    // Limitar longitud del texto de la descripción
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

    // Redireccionar al formulario
    function redireccionarFormulario() {
        tickets.forEach(ticket => {
            ticket.addEventListener('click', () => {
                const tipo = ticket.dataset.tipo;
                const publicationId = ticket.dataset.publicationId;
                const ticketId = ticket.dataset.ticketId;
                switch (tipo) {
                    case 'evento':
                        window.location.href = `/viewEvento?publicationId=${publicationId}&ticketId=${ticketId}`;
                        break;
                    case 'anuncio':
                        window.location.href = `/viewAnuncio?publicationId=${publicationId}&ticketId=${ticketId}`;
                        break;
                    case 'emprendimiento':
                        window.location.href = `/viewEmprendimiento?publicationId=${publicationId}&ticketId=${ticketId}`;
                        break;
                    case 'reporte':
                        window.location.href = `/viewReporte?publicationId=${publicationId}&ticketId=${ticketId}`;
                        break;
                }
            });
        });
    }

    // llamar funciones
    filtrarTickets();
    limiteDescripciones();
    redireccionarFormulario();
    document.querySelector('.status-filter button')?.click();

});
