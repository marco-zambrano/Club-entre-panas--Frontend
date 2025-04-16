import { socket, initSocket } from './socket.js';
import { createMessage, updateItemsList } from './ui.js';

export let currentItemId = null;
let allItems = []; // Mantener todos los items (contactos y comentarios) en memoria
let currentFilter = 'contact'; // Por defecto mostramos contacts

// Función para filtrar items basado en los toggles activos y el tipo de item
function filterItems() {
    document.querySelector('.bot-toggle').style.display = 'block';

    const filteredItems = allItems.filter(item => {
        const platformToggle = document.querySelector(`.platform-toggle[data-platform="${item.platform}"]`);
        const matchesPlatform = platformToggle && platformToggle.checked;
        const matchesType = currentFilter === 'contact' ? item.type === 'contact' : item.type === 'comment';

        return matchesPlatform && matchesType;
    });

    // Verificar si el item actual sigue visible después del filtrado
    const currentItemStillVisible = filteredItems.some(item => item.id === currentItemId);
    
    // Si el item actual ya no es visible, seleccionar el primer item visible
    if (!currentItemStillVisible && filteredItems.length > 0) {
        setCurrentItem(filteredItems[0].id);
        document.querySelector('chat-title').textContent = filteredItems[0].name;
    }
    
    updateItemsList(filteredItems, currentFilter);
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la conexión socket para recibir mensajes
    initSocket((data) => {
        if (data.itemId === currentItemId) {
            const { message } = data;
            createMessage(message.text, message.time, message.sender);
        }
    });

    // Escuchar los datos iniciales
    socket.on('initialData', (data) => {
        allItems = [...data.contacts, ...data.comments]; // Combinar contactos y comentarios
        filterItems(); // Aplicar filtros actuales
    });

    // Escuchar nuevos items
    socket.on('newItem', (item) => {
        allItems.push(item); // Agregar nuevo item a la lista completa
        filterItems(); // Actualizar la lista filtrada
    });

    // Manejar los filtros de plataforma
    document.querySelectorAll('.platform-toggle').forEach(toggle => {
        toggle.addEventListener('change', filterItems);
    });

    // Manejar el filtro de tipo (chat/comentario)
    const chatButton = document.querySelector('.item-chat');
    const commentButton = document.querySelector('.item-comment');

    // Función para actualizar el estado de los botones
    function updateFilterButtons() {
        chatButton.classList.toggle('active', currentFilter === 'contact');
        commentButton.classList.toggle('active', currentFilter === 'comment');
    }

    // Inicializar el estado de los botones
    updateFilterButtons();

    // Event listeners para los botones de filtro
    chatButton.addEventListener('click', () => {
        if (currentFilter !== 'contact') {
            currentFilter = 'contact';
            updateFilterButtons();
            filterItems();
        }
    });

    commentButton.addEventListener('click', () => {
        if (currentFilter !== 'comment') {
            currentFilter = 'comment';
            updateFilterButtons();
            filterItems();
        }
    });
});

// Exportar la función para cambiar el item actual
export function setCurrentItem(itemId) {
    currentItemId = itemId;
}