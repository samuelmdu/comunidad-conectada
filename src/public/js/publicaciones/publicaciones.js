
//Recorre todas las secciones con la clase vertical-content-section oculta el mensaje de no hay publicaciones creadas si hay cards presentes.
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('section.vertical-content-section').forEach(section => {
        const cards = section.querySelectorAll('.cards-container .card, .cards-container .route-card-anuncios');
        const mensaje = section.querySelector('.no-created');

        if (cards.length > 0 && mensaje) {
            mensaje.style.display = 'none';
        }
    });
});