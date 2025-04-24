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

// Pedir los items iniciales ni bien logea
export function requestInitialItems() {
    socket.emit('requestInitialItems', {
        type: currentFilter,
        count: 0
    });
}
// Pedir los items pedidos por el scroll
export function requestMoreItems(nextPage) {
    socket.emit('requestMoreItems', {
        type: currentFilter,
        page: nextPage,
        count: itemsCount[currentFilter]
    });
}

// Enviar el estado del bot (encendido/apagado)
export function sendBotStatus(status) {
    socket.emit('botToggle', status)
}

// Enviar mensaje enviado manualmente
export function emitMessage(text, timeStamp, sender ) {
    socket.emit('sendMessage', {
        text: text,
        timeStamp: timeStamp,
        sender: sender,
        type: '',
        imageUrl: null
    });
}

// Escuchar nuevos mensajes
socket.on('newMessage', (data) => {
    // En caso de que no haya toggles activados, no permitir seguir con los mensajes llegados
    if (document.querySelector('.chat-title').textContent === 'Selecciona un contacto o comentario') return;

    const itemId = data.itemId;
    // Solo se ejecuta la funcion crear mensaje, si el id del mensaje comienza con 'contact' o por comment
    // Debido a que los mensajes del back, tienen id 'contact-134kfj5t5992u' o 'comment-134kfj5t5992u'por ejemplo
    // Igualmente no se como sera esto en produccion
    if (itemId.startsWith(currentFilter)) {
        createMessage(data.message.text, data.message.time, data.message.sender, data.message.type, data.message.imageUrl);
    }
});

// Escuchar la carga inicial de datos (items) cuando se logea
socket.on('initialData', (data) => {
    allItems[currentFilter] = data.items;
    itemsCount[currentFilter] = data.items.length;
    allItemsLoaded[currentFilter] = data.items.length < ITEMS_PER_PAGE;
    currentPage[currentFilter] = 0;
    filterItems();
});

// Escuchar nuevos items (tiempo real)
socket.on('newItem', (item) => {
    if (!allItems[item.type]) return;
    
    allItems[item.type].unshift(item);
    itemsCount[item.type]++;
    // if the filter is actived, print it, if it is not, just save it
    if (currentFilter === item.type) {
        filterItems();
    }
});

// Escuchar más items cargados (por scroll)
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