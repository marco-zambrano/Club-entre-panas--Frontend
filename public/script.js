import { allItems, allItemsLoaded, currentPage } from './socket.js';
import { requestInitialItems, requestMoreItems} from './socket.js';
import { updateItemsList } from './ui.js';

export let currentItemId = null;
export let currentFilter = null;

// Función para filtrar items basado en los toggles activos y el tipo de item
export function filterItems() {
    // Prevent filtering if allItems[currentFilter] is not initialized yet
    if (!allItems[currentFilter]) return;

    // If the bot toggle is disabled, set it as available
    const botToggle = document.querySelector('.bot-toggle');
    const computedStyle = window.getComputedStyle(botToggle);
    if (computedStyle.display === 'none') botToggle.style.display = 'block';

    // Filter them by the activated platform toggle
    const filteredItems = allItems[currentFilter].filter(item => {
        const platformToggle = document.querySelector(`.platform-toggle[data-platform="${item.platform}"]`);
        const matchesPlatform = platformToggle && platformToggle.checked;
        return matchesPlatform;
    });

    // Sort items by lastMessageTime in descending order (most recent first)
    filteredItems.sort((a, b) => {
        const timeA = new Date(a.lastMessageTime);
        const timeB = new Date(b.lastMessageTime);  
        return timeB - timeA;
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

// Exportar la función para cambiar el item id actual
export function setCurrentItem(itemId) {
    currentItemId = itemId;
}

export function setCurrentFilter(value) {
    if (currentFilter !== value) {
        currentFilter = value;
        // Si no tenemos items cargados para este tipo, solicitarlos
        if (!allItems[currentFilter] || allItems[currentFilter].length === 0) {
            requestInitialItems();
        } else {
            // si ya tenemos items cargados, simplemente lo filtramos depende el caso
            filterItems();
        }
    }
}

// Función para cargar más items cuando se hace scroll
export function loadNewItems() {
    if (allItemsLoaded[currentFilter]) return; //Si ya estan todos los items cargados, no traer mas items
    const nextPage = currentPage[currentFilter] + 1;
    requestMoreItems(nextPage)
}

document.addEventListener('DOMContentLoaded', () => {
    setCurrentFilter('contact');
    // Implementar scroll infinito
    const contactsList = document.querySelector('.contacts-list');
    contactsList.addEventListener('scroll', () => {
        if (contactsList.scrollTop + contactsList.clientHeight >= contactsList.scrollHeight - 100) {
            loadNewItems();
        }
    });
});