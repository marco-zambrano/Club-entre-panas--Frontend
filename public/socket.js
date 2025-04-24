import { filterItems, currentFilter } from "./script.js";
import { createMessage} from './ui.js';

export const socket = io();

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

// request for items in case theres no items in front
export function requestInitialItems() {
    socket.emit('requestInitialItems', {
        type: currentFilter,
        count: 0
    });
}
export function requestMoreItems(nextPage) {
    socket.emit('requestMoreItems', {
        type: currentFilter,
        page: nextPage,
        count: itemsCount[currentFilter]
    });
}


// Escuchar nuevos mensajes
socket.on('newMessage', (data) => {
    if (document.querySelector('.chat-title').textContent === 'Selecciona un contacto o comentario') return;

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
    if (currentFilter === item.type) {
        allItems[item.type].unshift(item);
        itemsCount[item.type]++;
        // if the filter is actived, print it, if it is not, just save it
        if (currentFilter === item.type) {
            filterItems();
        }
    }
});

// Escuchar más items cargados
socket.on('loadMoreItems', (data) => {
    // if the data base sents all the items, set allItemsLoades as true (chat/comment)
    if (data.items.length < ITEMS_PER_PAGE) {
        allItemsLoaded[currentFilter] = true;
    }

    allItems[currentFilter] = [...allItems[currentFilter], ...data.items];
    itemsCount[currentFilter] += data.items.length;
    currentPage[currentFilter] = data.page;
    filterItems();
});