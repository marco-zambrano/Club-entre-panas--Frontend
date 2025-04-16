import { socket, initSocket } from './socket.js';
import { createMessage, updateItemsList } from './ui.js';

export let currentItemId = null;
let allItems = []; // Mantener todos los items (contactos y comentarios) en memoria

// Función para filtrar items basado en los toggles activos
function filterItems() {
    document.querySelector('.bot-toggle').style.display = 'block';
    
    const filteredItems = allItems.filter(item => {
        const platformToggle = document.querySelector(`.platform-toggle[data-platform="${item.platform}"]`);
        return platformToggle && platformToggle.checked;
    });
    
    // Verificar si el item actual sigue visible después del filtrado
    const currentItemStillVisible = filteredItems.some(item => item.id === currentItemId);
    
    // Si el item actual ya no es visible, seleccionar el primer item visible
    if (!currentItemStillVisible && filteredItems.length > 0) {
        currentItemId = filteredItems[0].id;
    }
    
    updateItemsList(filteredItems);
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la conexión socket
    initSocket((data) => {
        if (data.itemId === currentItemId) {
            const { message } = data;
            createMessage(message.text, message.time, message.sender);
        }
    });

    // Escuchar los datos iniciales
    socket.on('initialData', (data) => {
        console.log('Received initial data:', data);
        allItems = [...data.contacts, ...data.comments]; // Combinar contactos y comentarios
        filterItems(); // Aplicar filtros actuales
    });

    // Escuchar nuevos items
    socket.on('newItem', (item) => {
        console.log('Received new item:', item);
        allItems.push(item); // Agregar nuevo item a la lista completa
        filterItems(); // Actualizar la lista filtrada
    });

    // Manejar los filtros de plataforma
    document.querySelectorAll('.platform-toggle').forEach(toggle => {
        toggle.addEventListener('change', filterItems);
    });
});

// Exportar la función para cambiar el item actual
export function setCurrentItem(itemId) {
    currentItemId = itemId;
}