import { allItems, allItemsLoaded, currentPage } from './socket.js'; // variables
import { requestInitialItems, requestMoreItems, sendBotStatus, sendActivedItem} from './socket.js'; // functions
import { updateItemsList } from './ui.js';

export let currentItemId = null; // Id of the item actived
export let currentFilter = null; // define (Chat or Comment)
let lastToggle = null; // referencia al ultimo toggle que hubo
let lastToggleHandler = null; // referencia al ultimo addEventListener que hubo (para borrarlo y no acumular eventos)


// ACA LO QUE FILTRAMOS SON LAS PLATAFORMAS QUE SE VAN A MOSTRAR
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
        initiliceBotToggle();
    }
    
    updateItemsList(filteredItems, currentFilter);
}

// Funcionalidades del toggle del bot
function handleInputVisibility(isChecked, itemId) {
    if (!itemId) return;
    
    // hide or show text input depending the individual bot toggle boolean value
    const messageInputContainer = document.querySelector('.message-input-container');
    messageInputContainer.style.display = isChecked ? 'none' : 'flex';
    
    // Emit the new status from the bot toggle to the backend 
    sendBotStatus(itemId, isChecked); // ------ (GOES TO BACK)
}
// inicializar el estado del boton 
export function initiliceBotToggle() {
    const currentItem = allItems[currentFilter].find(item => item.id === currentItemId);
    
    if (currentItem) {
        const botToggle = document.querySelector('.individual-bot-toggle');

        // Si había un toggle anterior, le quitamos el evento
        if (lastToggle && lastToggleHandler) {
            lastToggle.removeEventListener('change', lastToggleHandler);
        }

        // Definir la nueva función manejadora al momento de que el toggle changes
        const toggleHandler = (e) => {
            const isChecked = e.target.checked;
            handleInputVisibility(isChecked, currentItem.id);
        };

        // Guardar las referencias para futura limpieza
        lastToggle = botToggle;
        lastToggleHandler = toggleHandler;

        // Establecer el estado inicial del toggle
        botToggle.checked = currentItem.isBotActived;
        handleInputVisibility(currentItem.isBotActived, currentItem.id);

        // Asignar el nuevo event listener
        botToggle.addEventListener('change', toggleHandler);
    }
}


// Función para cambiar el item id actual (el actived)
export function setCurrentItem(itemId) {
    currentItemId = itemId;
    // const currentItem = allItems[currentFilter].find( item => item.id === currentItemId);
    // if (currentItem.messages.length > 0) {
    //     currentItem.messages.forEach(message => {
    //         createMessage(message.text, message.time, message.sender, message.type, message.imageUrl);
    //     });
    //     return;
    // }

    sendActivedItem(currentItemId);
}
// Funcion para cambiar si estamos en la seccion de chats o comentarios
export function setCurrentFilter(value) {
    if (currentFilter !== value) {
        currentFilter = value;
        // Si no tenemos items cargados para este tipo, solicitarlos
        if (!allItems[currentFilter] || allItems[currentFilter].length === 0) {
            requestInitialItems();  // Pedir los items iniciales de la bd ------ (GOES TO BACK)
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
    requestMoreItems(nextPage) // Pedir mas items de las bases de datos (porque scrolleamos) ------ (GOES TO BACK)
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