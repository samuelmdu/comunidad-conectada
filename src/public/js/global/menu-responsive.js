const iconProfile = document.getElementById('icon-profile-button');
const menuFlotante = document.querySelector('.menu-flotante');


document.addEventListener('DOMContentLoaded', function () {
    const burger = document.querySelector('.burger');
    const options = document.querySelector('.options');

    burger.addEventListener('click', function () {
        options.classList.toggle('active'); // Alterna la clase 'active' para mostrar u ocultar el menú
    });
});

iconProfile.addEventListener('mouseover', function () {
    menuFlotante.style.display = 'flex';
    document.body.addEventListener('click', function (e) {
        menuFlotante.style.display = 'none';
    });
});


