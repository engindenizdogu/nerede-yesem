// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Set active page in navigation
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.setAttribute('aria-current', 'page');
            }
        });
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Load navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('nav-container', 'src/html/components/nav.html');
}); 