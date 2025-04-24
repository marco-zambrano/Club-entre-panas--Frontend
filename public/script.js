import { socket, initSocket } from './socket.js';
import { createMessage, updateItemsList } from './ui.js';

export let currentItemId = null;
export let currentFilter = null;

// Variables para rastrear el estado de la carga
export let allItems = {
    contacts: [],
    comments: []
};
export let itemsCount = {
    contacts: 0,
    comments: 0
};
export let allItemsLoaded = {
    contacts: false,
    comments: false
};
export let currentPage = {
    contacts: 0,
    comments: 0
};
const ITEMS_PER_PAGE = 20;

// Función para filtrar items basado en los toggles activos y el tipo de item
export function filterItems() {
    // If the but toggle is disabled, set it as available
    const botToggle = document.querySelector('.bot-toggle');
    const computedStyle = window.getComputedStyle(botToggle);
    if (computedStyle.display === 'none') botToggle.style.display = 'block';

    // Filter them by the activated platform toggle
    console.log(allItems[currentFilter])
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

// Función para cargar más items cuando se hace scroll
export function loadMoreItems() {
    if (allItemsLoaded[currentFilter]) return;
    
    const nextPage = currentPage[currentFilter] + 1;
    socket.emit('loadMoreItems', {
        type: currentFilter,
        page: nextPage,
        count: itemsCount[currentFilter]
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la conexión socket
    initSocket();

    // Escuchar nuevos mensajes
    socket.on('newMessage', (data) => {
        const itemId = data.itemId;
        if (itemId.startsWith(currentFilter)) {
            createMessage(data.message.text, data.message.time, data.message.sender, data.message.type, data.message.imageUrl);
        }
    });

    // Escuchar la carga inicial de datos
    socket.on('initialData', (data) => {
        allItems[currentFilter] = data.items;
        itemsCount[currentFilter] = data.items.length;
        allItemsLoaded[currentFilter] = data.items.length < ITEMS_PER_PAGE;
        currentPage[currentFilter] = 0;
        filterItems();
    });

    // Escuchar nuevos items
    socket.on('newItem', (item) => {
        if (item.type && allItems[item.type]) {
            allItems[item.type].unshift(item);
            itemsCount[item.type]++;
            if (currentFilter === item.type) {
                filterItems();
            }
        }
    });

    // Escuchar más items cargados
    socket.on('moreItems', (data) => {
        if (data.items.length < ITEMS_PER_PAGE) {
            allItemsLoaded[currentFilter] = true;
        }

        allItems[currentFilter] = [...allItems[currentFilter], ...data.items];
        itemsCount[currentFilter] += data.items.length;
        currentPage[currentFilter] = data.page;
        filterItems();
    });

    // Implementar scroll infinito
    const contactsList = document.querySelector('.contacts-list');
    contactsList.addEventListener('scroll', () => {
        if (contactsList.scrollTop + contactsList.clientHeight >= contactsList.scrollHeight - 100) {
            loadMoreItems();
        }
    });
});

// Exportar la función para cambiar el item actual
export function setCurrentItem(itemId) {
    currentItemId = itemId;
}

export function setCurrentFilter(value) {
    if (currentFilter !== value) {
        currentFilter = value;
        // Si no tenemos items cargados para este tipo, solicitarlos
        console.log(currentFilter);
        if (!allItems[currentFilter] || allItems[currentFilter].length === 0) {
            socket.emit('loadInitialItems', {
                type: currentFilter,
                count: 0
            });
        } else {
            filterItems();
        }
    }
}

setCurrentFilter('contact');