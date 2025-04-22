import { socket, initSocket } from './socket.js';
import { createMessage, updateItemsList } from './ui.js';

export let currentItemId = null;
export let currentFilter = null;
setCurrentFilter('contact');
let allItems = []; // Mantener todos los items (contactos y comentarios) en memoria (podrian traerse de la BD en futuro)

// Función para filtrar items basado en los toggles activos y el tipo de item
export function filterItems() {
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
        document.querySelector('.chat-title').textContent = filteredItems[0].name;
        document.querySelector('.messages').innerHTML = '';
    }
    
    updateItemsList(filteredItems, currentFilter);
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la conexión socket
    initSocket();

    // Escuchar nuevos mensajes
    socket.on('newMessage', (data) => {
        const itemId = data.itemId;
        if (itemId.startsWith(currentFilter)) {
            createMessage(data.message.text, data.message.time, data.message.sender, data.message.type, data.message.imageUrl); // filter messages and comments appearance 
        }
    });
    // hear the initial data
    socket.on('initialData', (data) => {
        allItems = [...data.contacts, ...data.comments]; // Combinar contactos y comentarios
        filterItems(); // Aplicar filtros actuales
    });
    // hear the new items
    socket.on('newItem', (item) => {
        allItems.push(item); // Agregar nuevo item a la lista completa
        filterItems(); // Actualizar la lista filtrada
    });
});

// Exportar la función para cambiar el item actual
export function setCurrentItem(itemId) {
    currentItemId = itemId;
}
export function setCurrentFilter(value) {
    currentFilter = value;
}