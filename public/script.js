import { items } from './socket.js'; // variables
import { updateBotStatus, getItemHistory, getItems } from './socket.js'; // functions
import { updateItemsList, createMessage } from './ui.js';

export let currentItemId = null; // Id of the item actived
export let currentFilter = null; // define (Chat or Comment)
let lastToggle = null; // referencia al ultimo toggle que hubo
let lastToggleHandler = null; // referencia al ultimo addEventListener que hubo (para borrarlo y no acumular eventos)


//THIS FILTERS ITEMS BY PLATFORM, TYPE(COMMENT OR MESSAGE), AND SORTS THEM
export function filterItems() {
    //PREVENT FURTHER FILTERING IF NO ITEMS
    if (!items[currentFilter]){
        console.error('items[currentFilter] is not initialized yet');
        return;
    }

    //IF BOT TOGGLE IS NOT VISIBLE, SHOW IT
    const botToggle = document.querySelector('.bot-toggle');
    const computedStyle = window.getComputedStyle(botToggle);
    if (computedStyle.display === 'none') botToggle.style.display = 'block';

    //FILTER THEM BY THE ACTIVATED PLATFORM TOGGLE
    const filteredItems = items[currentFilter].list.filter(item => {
        const platformToggle = document.querySelector(`.platform-toggle[data-platform="${item.platform}"]`);
        const matchesPlatform = platformToggle && platformToggle.checked;
        return matchesPlatform;
    });

    //SORT ITEMS BY LAST SORT ITEMS BY TIME IN DESCENDING ORDER (MOST RECENT FIRST)
    var entryKey = (currentFilter == "contacts") ? "messages" : (currentFilter == "comments") ? "comments" : null;
    filteredItems.sort((a, b) => {
        const timeA = new Date(a[entryKey][a[entryKey].length-1].time);
        const timeB = new Date(b[entryKey][b[entryKey].length-1].time);  
        return timeB - timeA;
    });

    //VERIFY IF CURRENTITEM IS VISIBLE AFTER FILTERING
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


//TO OPEN A NEW ITEM
export function openItem(itemId) {
    currentItemId = itemId;
    if (!currentItemId) return;


    const currentItem = items[currentFilter].list.find(item => item.id === currentItemId);
    if (!currentItem) return;

    document.querySelector('.chat-title').textContent = currentItem.name;

    //CLEAN MESSAGE CONTAINER BEFORE ADDING NEW MESSAGES
    const messagesContainer = document.querySelector('.messages');
    if (messagesContainer) {
        messagesContainer.innerHTML = '';
    }

    var entryKey = (currentFilter == "contacts") ? "messages" : (currentFilter == "comments") ? "comments" : null;
    if (currentItem[entryKey] && currentItem[entryKey].length > 0) {
        console.log('Cargando mensajes existentes para el item:', currentItemId);
        //TO HAVE TIME IN A HH:MM AM/PM FORMAT
        currentItem[entryKey].forEach(message => {
    
            const timeString = new Date(message.time).toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            const senderString = message.self === true ? 'bot' : "contact"; //if true, bot, else contact
            createMessage(message.content, timeString, senderString, message.type); //WILL CHANGE FOR EPOCH
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

let isLoading = false;

document.addEventListener('DOMContentLoaded', () => {
    setCurrentFilter('contacts'); //ARBITRARY

    const contactsList = document.querySelector('.contacts-list');

    contactsList.addEventListener('scroll', () => {
        if (
            (!isLoading && contactsList.scrollTop + contactsList.clientHeight >= contactsList.scrollHeight - 100) && 
            items[currentFilter].allItemsLoaded == false
        ) {
            isLoading = true; //stop new calls

            console.log('Loading more items...');
            getItems(currentFilter); //wait until it finishes
            filterItems();

            isLoading = false; //liberate to allow new requests
        }else{
            console.log("DIDNT LOAD BECAUSE ITS ALL LOADED OR ITS ALREADY LOADING")
        }
    });
});