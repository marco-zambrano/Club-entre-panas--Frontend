import { items } from './socket.js'; // variables
import { updateBotStatus, getItemHistory, getItems, setViewedImgFalse } from './socket.js'; // functions
import { updateItemsList, createMessage } from './ui.js';

export let currentItemId = null; // Id of the item actived
export let currentFilter = null; // define (Chat or Comment)
let lastToggle = null; // referencia al ultimo toggle que hubo
let lastToggleHandler = null; // referencia al ultimo addEventListener que hubo (para borrarlo y no acumular eventos)


//THIS FILTERS ITEMS BY PLATFORM, TYPE(COMMENT OR MESSAGE), AND SORTS THEM
export function filterItems() {
    console.log('FILTRANDO.......')
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
        const msgsA = a[entryKey];
        const msgsB = b[entryKey];
        const lastA = msgsA.length ? msgsA[msgsA.length - 1].time : 0;
        const lastB = msgsB.length ? msgsB[msgsB.length - 1].time : 0;

        return lastB - lastA; // ← This reverses it (older to newer)
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
    
    // Cuando damos click a un item que tenga imagenes en los mensajes, ocultamos la notificacion de imagenes visualizadas
    // items[currentFilter].list.forEach(item => {
    //     if(item.id === currentItemId && item.imageVisualized === false) {
    //         const imageNotification = document.getElementById(`image-notification-${itemId}`);
    //         imageNotification.style.display = 'none'; // Hide the image notification
    //         item.imageVisualized = true; // Mark the image as visualized
    //     }
    // });

    if (!currentItem) return;

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

    // Si no hay ningun mensaje en el contenedor messages
    var entryKey = (currentFilter == "contacts") ? "messages" : (currentFilter == "comments") ? "comments" : null;
    if (currentItem[entryKey] && currentItem[entryKey].length > 0) {
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

            getItems(currentFilter); //wait until it finishes
            // filterItems();  --> the getItems function, calls the filterItems() too, so the function filterItems() used to be called TWICE, and that was a problem

            isLoading = false; //liberate to allow new requests
        }else{
            // console.log("DIDNT LOAD BECAUSE ITS ALL LOADED OR ITS ALREADY LOADING")
        }
    });
});