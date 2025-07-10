import { items } from './socket.js'; // variables
import { updateBotStatus, getItemHistory, getItems, setViewedImgFalse, setTagBtnStatus, reportErrorToBackend } from './socket.js'; // functions
import { updateItemsList, createMessage, tagColors } from './ui.js';

export let currentItemId = null; // Id of the item actived
export let currentFilter = null; // define (Chat or Comment)
let lastToggle = null; // referencia al ultimo toggle que hubo
let lastToggleHandler = null; // referencia al ultimo addEventListener que hubo (para borrarlo y no acumular eventos)
let lastTagBtn = null;
let lastTagBtnHandler = null;


//THIS FILTERS ITEMS BY PLATFORM, TYPE(COMMENT OR MESSAGE), AND SORTS THEM
export function filterItems() {
    // console.log('FILTRANDO.......')
    //PREVENT FURTHER FILTERING IF NO ITEMS
    if (!items[currentFilter]){
        console.error('items[currentFilter] is not initialized yet');
        return;
    }

    //IF BOT TOGGLE IS NOT VISIBLE, SHOW IT
    const botToggle = document.querySelector('.bot-toggle');
    const computedStyle = window.getComputedStyle(botToggle);
    if (computedStyle.display === 'none') botToggle.style.display = 'flex';

    //FILTER THEM BY THE ACTIVATED PLATFORM TOGGLE
    const filteredItems = items[currentFilter].list.filter(item => {
        const platformToggle = document.querySelector(`.platform-toggle[data-platform="${item.platform}"]`);
        const matchesPlatform = platformToggle && platformToggle.checked;

        if (currentFilter === 'contacts') {
            const selectedTags = Array.from(document.querySelectorAll('.tag-toggle:checked')).map(toggle => toggle.dataset.tag);
            const itemTags = Array.isArray(item.tag) ? item.tag : [item.tag];

            if (selectedTags.includes('default') && itemTags.length === 0) {
                return matchesPlatform;
            }

            const matchesTags = selectedTags.some(tag => itemTags.includes(tag));
            return matchesPlatform && matchesTags;
        }

        return matchesPlatform;
    });

    //SORT ITEMS BY LAST SORT ITEMS BY TIME IN DESCENDING ORDER (MOST RECENT FIRST)
    let entryKey = null;
    if (currentFilter === "contacts") {
        entryKey = "messages";
    } else if (currentFilter === "comments") {
        entryKey = "comments";
    }

    filteredItems.sort((a, b) => {
        // Obtenemos el array de mensajes/comentarios para el elemento 'a'
        // Si entryKey es null o el array no existe/está vacío, usamos un timestamp por defecto de 0.
        const arrayA = entryKey && a[entryKey] ? a[entryKey] : [];
        const ultimoItemA = arrayA.length > 0 ? arrayA[arrayA.length - 1] : { time: 0 };
        const timestampA = ultimoItemA.time;

        // Obtenemos el array de mensajes/comentarios para el elemento 'b'
        const arrayB = entryKey && b[entryKey] ? b[entryKey] : [];
        const ultimoItemB = arrayB.length > 0 ? arrayB[arrayB.length - 1] : { time: 0 };
        const timestampB = ultimoItemB.time;

        // Comparamos los timestamps para ordenar de más reciente a más antiguo.
        // Restamos timestampA de timestampB para que el mayor (más reciente) vaya primero.
        return timestampB - timestampA;
    });

    //VERIFY IF CURRENT ITEM IS VISIBLE AFTER FILTERING
    const currentItemStillVisible = filteredItems.some(item => item.id === currentItemId);
    
    //IF IT'S NOT VISIBLE, OPEN THE FIRST ITEM IN THE FILTERED LIST
    if (!currentItemStillVisible && filteredItems.length > 0) {
        openItem(filteredItems[0].id);
        initilizeBotToggle();
    }

    updateItemsList(filteredItems, currentFilter);
}

//BOT TOGGLE FUNCTIONALITY
function handleInputVisibility(isChecked, itemId) {
    if (!itemId) return;
    
    //HIDE OR SHOW TEXT INPUT DEPENDING ON THE INDIVIDUAL BOT TOGGLE BOOLEAN VALUE
    const messageInputContainer = document.querySelector('.message-input-container');
    messageInputContainer.style.display = isChecked ? 'none' : 'flex';
    
    const currentItem = items[currentFilter].list.find(item => item.id === currentItemId);
    currentItem.botEnabled = isChecked;
    updateBotStatus(itemId, isChecked); //GOES TO THE BACKEND USING WEBSOCKETS
}

//INITIALIZE BOT TOGGLE
export function initilizeBotToggle() {
    const currentItem = items[currentFilter].list.find(item => item.id === currentItemId);
    
    if (currentItem) {
        const botToggle = document.querySelector('.individual-bot-toggle');

        //IF THERE WAS A PREVIOUS TOGGLE, REMOVE IT
        if (lastToggle && lastToggleHandler) {
            lastToggle.removeEventListener('change', lastToggleHandler);
        }

        //DEFINE NEW HANDLER FUNC WHEN TOGGLE CHANGES
        const toggleHandler = (e) => {
            const isChecked = e.target.checked;
            handleInputVisibility(isChecked, currentItem.id);
        };

        //SAVE THOSE REFERENCES FOR FUTURE CLEANING
        lastToggle = botToggle;
        lastToggleHandler = toggleHandler;

        //ESTABLISH INITIAL TOGGLE STATUS
        botToggle.checked = currentItem.botEnabled;
        handleInputVisibility(currentItem.botEnabled, currentItem.id);

        //ASIGN NEW ADDEVENTLISTENER FUNC
        botToggle.addEventListener('change', toggleHandler);
    }
}

let currentActiveHandler = null;

const handleTagBtn = currentItem => {
    // --- PASO 1: Limpiar los listeners ANTERIORES ---
    document.querySelectorAll(".tag-btn").forEach(btn => {
        if (currentActiveHandler) {
            btn.removeEventListener("click", currentActiveHandler);
        }
    });

    // --- Lógica de reseteo visual ---
    const resetAllTagButtons = () => {
        document.querySelectorAll(".tag-btn").forEach(btn => {
            btn.style.backgroundColor = "transparent";
        });
    };

    resetAllTagButtons();

    // Ensure currentItem.tag is an array before proceeding
    if (typeof currentItem.tag === 'string') {
        currentItem.tag = currentItem.tag === 'default' ? [] : [currentItem.tag];
    } else if (!Array.isArray(currentItem.tag)) {
        currentItem.tag = [];
    }

    // Establecemos el estado inicial basado en el nuevo `currentItem`
    if (currentItem.tag.length > 0) {
        currentItem.tag.forEach(tag => {
            const tagElement = document.querySelector(`.tag-btn--${tag.toLowerCase()}`);
            if (tagElement) {
                tagElement.style.backgroundColor = tagColors[tag];
            }
        });
    }

    // --- PASO 2: Crear el NUEVO handler para el `currentItem` actual ---
    currentActiveHandler = e => {
        const btnElement = e.currentTarget;
        const tagName = btnElement.textContent;
        
        // Ensure itemTagContainer is handled correctly
        let itemTagContainer = document.getElementById(`contact-tags-${currentItem.id}`);
        if (!itemTagContainer) {
            const itemElementContainer = document.querySelector(`.contact[data-item-id="${currentItem.id}"]`);
            itemTagContainer = document.createElement('div');
            itemTagContainer.className = 'contact-tags-container';
            itemTagContainer.id = `contact-tags-${currentItem.id}`;
            itemElementContainer.appendChild(itemTagContainer);
        }

        const tagIndex = currentItem.tag.indexOf(tagName);

        if (tagIndex > -1) { // Si la etiqueta ya existe, la eliminamos
            currentItem.tag.splice(tagIndex, 1);
            btnElement.style.backgroundColor = "transparent";
        } else { // Si no existe, la agregamos
            currentItem.tag.push(tagName);
            btnElement.style.backgroundColor = tagColors[tagName];
        }

        setTagBtnStatus(currentItem.id, currentItem.tag);
        updateTagDisplay(currentItem);
    };

    document.querySelectorAll(".tag-btn").forEach(btn => {
        btn.addEventListener("click", currentActiveHandler);
    });
};

function updateTagDisplay(item) {
    const tagContainer = document.getElementById(`contact-tags-${item.id}`);
    if (!tagContainer) return;

    tagContainer.innerHTML = ''; // Limpiamos el contenedor

    item.tag.forEach(tagName => {
        const tagElement = document.createElement('span');
        tagElement.className = 'contact-tag';
        tagElement.textContent = tagName;
        tagElement.style.backgroundColor = tagColors[tagName];
        tagContainer.appendChild(tagElement);
    });
}

//TO OPEN A NEW ITEM
export function openItem(itemId) {
    currentItemId = itemId;

    // Si itemId es null o no se encuentra, limpiar el área de chat
    const currentItem = itemId ? items[currentFilter].list.find(item => item.id === itemId) : null;

    if (!currentItem) {
        document.querySelector('.chat-title').textContent = 'Selecciona un contacto o comentario';
        const messagesContainer = document.querySelector('.messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
        document.querySelector('.bot-toggle').style.display = 'none';
        const previouslyActive = document.querySelector('.contact.active');
        if (previouslyActive) {
            previouslyActive.classList.remove('active');
        }
        return;
    }

    if (currentItem.imgViewed === false) {
        const imageNotification = document.getElementById(`image-notification-${itemId}`);
        if (imageNotification) {
            imageNotification.style.display = 'none'; // Hide the image notification
        }
        currentItem.imgViewed = true; // Mark the image as visualized
        setViewedImgFalse(currentItemId, currentItem.platform); // Send the status to the backend
    }

    document.querySelector('.chat-title').textContent = currentItem.name;
    document.querySelector('.post-link').href = currentItem.permalink; // set the permalink in the comment

    //CLEAN MESSAGE CONTAINER BEFORE ADDING NEW MESSAGES
    const messagesContainer = document.querySelector('.messages');
    if (messagesContainer) {
        messagesContainer.innerHTML = '';
    }

    if (currentFilter === 'contacts') handleTagBtn(currentItem);

    // Si no hay ningun mensaje en el contenedor messages
    var entryKey = (currentFilter == "contacts") ? "messages" : (currentFilter == "comments") ? "comments" : null;
    if (currentItem[entryKey] && currentItem[entryKey].length > 0) {
        //TO HAVE TIME IN A HH:MM AM/PM FORMAT
        currentItem[entryKey].forEach(message => {
            const senderString = message.self === true ? 'bot' : "contact"; //if true, bot, else contact
            createMessage(message.content, message.time, senderString, message.type); //WILL CHANGE FOR EPOCH
        });
        
        const messagesContainer = document.querySelector('.messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return;
    }

    getItemHistory(currentItemId, currentFilter);
}

//TO CHANGE MESSAGE/COMMENT FILTER
export function setCurrentFilter(value) {
    currentFilter = value;

    //IF WE HAVE LOADED ITEMS, FILTER THEM
    if (items[currentFilter].list.length > 11) {
        filterItems();
    } else { //IF THERE AINT ITEMS LOADDED FOR THIS FILTER, REQUEST THEM
        getItems(currentFilter);
        filterItems();
    }
}

export let isLoading = false;
export function setIsLoading(status){
    isLoading = status;
}

document.addEventListener('DOMContentLoaded', () => {
    setCurrentFilter('contacts'); //ARBITRARY

    const contactsList = document.querySelector('.contacts-list');

    contactsList.addEventListener('scroll', () => {
        if (
            (!isLoading && contactsList.scrollTop + contactsList.clientHeight >= contactsList.scrollHeight - 100) && 
            items[currentFilter].allItemsLoaded == false
        ) {
            isLoading = true; //stop new calls

            getItems(currentFilter); //wait until it finishes
            // filterItems();  --> the getItems function, calls the filterItems() too, so the function filterItems() used to be called TWICE, and that was a problem
        }else{
            // console.log("DIDNT LOAD BECAUSE ITS ALL LOADED OR ITS ALREADY LOADING")
        }
    });
});

//CAPTURE AND REPORT ERRORS
window.onerror = function (message, source, lineno, colno, error) {
    reportErrorToBackend({
        type: 'error',
        message,
        source,
        lineno,
        colno,
        stack: error?.stack
    });
};

// CAPTURE UNHANDLED PROMISE REJECTIONS
window.addEventListener('unhandledrejection', function (event) {
    reportErrorToBackend({
        type: 'unhandledrejection',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack
    });
});