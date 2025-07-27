const tickets = document.querySelectorAll('.ticket');

tickets.forEach(ticket => {
    ticket.addEventListener('click', () => {
        const tipo = ticket.querySelector('.ticket-info')?.textContent.trim().toLowerCase();

        switch (tipo) {
            case 'evento':
                window.location.href = '../form-evento/form-evento.html';
                break;
            case 'anuncio':
                window.location.href = '../form-anuncio/form-anuncio.html';
                break;
            case 'emprendimiento':
                window.location.href = '../form-emprendimiento/form-emprendimiento.html';
                break;
            case 'reporte':
                window.location.href = '../form-reporte/form-reporte.html';
                break;
            default:
                // Si no coincide ningún caso, puedes redirigir a una página por defecto o no hacer nada
                console.warn('Tipo de ticket no reconocido:', tipo);
                break;
        }
    });
});
