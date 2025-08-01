// menu-responsive.js

function setupResponsiveMenu() {
    // Seleccionar elementos del DOM
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.options');
    const icon = burger.querySelector('i');
    
    // Función para alternar el menú
    const toggleMenu = () => {
        menu.classList.toggle('active');
        
        // Cambiar icono
        if (menu.classList.contains('active')) {
            icon.classList.replace('ri-menu-line', 'ri-close-line');
        } else {
            icon.classList.replace('ri-close-line', 'ri-menu-line');
        }
    };
    
    // Función para cerrar el menú
    const closeMenu = () => {
        menu.classList.remove('active');
        icon.classList.replace('ri-close-line', 'ri-menu-line');
    };
    
    burger.addEventListener('click', toggleMenu);
    
    // Cerrar menú cuando de hace clic en enlaces
    document.querySelectorAll('.options a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Cerrar menú al hacer clic fuera de "el menú" (valga la redundancia)
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !burger.contains(e.target) && menu.classList.contains('active')) {
            closeMenu();
        }
    });
}

document.addEventListener('DOMContentLoaded', setupResponsiveMenu);

if (typeof Turbo !== 'undefined') {
    document.addEventListener('turbo:load', setupResponsiveMenu);
}