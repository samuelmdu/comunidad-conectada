document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const options = document.querySelector('.options');
    
    burger.addEventListener('click', function() {
        options.classList.toggle('active'); // Alterna la clase 'active' para mostrar u ocultar el menú
    });
});