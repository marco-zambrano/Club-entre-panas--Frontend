import { currentFilter, currentItemId } from "./script.js"; // VariablesMore actions
import { filterItems, isLoading, setIsLoading } from "./script.js"; // Functions
import { createMessage } from './ui.js'; // Function create message

const socket = io(window.APP_CONFIG.socketConfig.url, {
    ...window.APP_CONFIG.socketConfig.options,
});

// const ITEMS_PER_PAGE = 20;

// MAY GOD BLESS THIS CODE
export var items = {
    contacts: {
        allItemsLoaded: false,
        list: [],
        contentLoaded: false
    },
    comments: {
        allItemsLoaded: false,
        list: [],
        contentLoaded: false
    }
}

export let quickReps = [];

//SEND ERRORS TO BACKEND
export function reportErrorToBackend(error) {
    socket.emit('reportError', error);
}

// FOR DEBUGGING PURPOSES
export function sendDebugMessage(message) {
    socket.emit('debugMessage', message);
}

// GET ITEMS FROM THE BACKEND
export function getItems(filter) { //must be "contacts" or "comments" PLURAL
    sendDebugMessage(`GETTING ITEMS WITH PRELOADED LENGTH: ${items[filter].list.length}`)
    socket.emit('getItems', {
        filter: filter,
        count: items[filter].list.length // amount of items already loaded.
        //.length works good here because the backend uses arra.prototype.slice. So it's good that if the local array has [0, ...N] items
        //.length returns N+1. N+1 is exactly from where the backend should start returning the items.
        // then, when items has [0, ...N] items, the backend will return items from N+1 to N+20. So we have 20 new items.
        // in other words, 
    })
}

//SEND BOT STATUS
export function updateBotStatus(itemId, status) {
    socket.emit('botStatus', {
        itemId: itemId,
        status: status,
        filter: currentFilter
    });
}
//SEND MANUAL MESSAGE
export function sendManMessage(metaId, type, content, filter, platform) {
    socket.emit('sendManMessage', {
        metaId: metaId,
        content: content,
        type: type,
        filter: filter,
        platform: platform
    });
}

//GET ITEM MESSAGES HISTORY
export function getItemHistory(itemId, filter) {
    console.log('estamos');
    
    socket.emit('getItemHistory', {itemId, filter});
}

//QUICK REPLIES
export function getQuickReps(){
    socket.emit("getQuickReps"); //only for when the user just logs in
}
socket.on('quickReps', (qckRps) => { //WHEN THE SERVER SENDS THE SAVED QUICK REPLIES, UPDATE THE LOCAL ARRAY // recibimos [{id: , text:}]
    quickReps = [...qckRps];
})
export function updateQuickReps(arr){ // Actualizar QRs, tanto si eliminas o agregas una, si eliminas, el type es delete, si agregas, el type es create
    socket.emit("updateQuickReps", arr);
}

export let botPrompts = {};
export var tokenUsage = 0;

export function getCustomPrompt() {
    return new Promise((resolve, reject) => {
        // In case the server does not respond within 10 seconds, reject the promise
        let timeout = setTimeout(() => {
            reject(new Error("Timeout: No response from server"));
        }, 10000);

        // Request the custom prompt from the server
        socket.emit('getCustomPrompt');

        // Listen for the 'customPrompt' event from the server
        socket.once('customPrompt', (data) => {
            clearTimeout(timeout);
            if (data && typeof data === 'object') {
                // Validate the data structure is JSON compatible
                try {
                    JSON.parse(data.dataTable);
                } catch (e) {
                    console.error('El texto JSON entrante no es valido');
                    return;
                }

                // set the botPrompts object with the received data
                botPrompts = {
                    dataTable: data.dataTable,
                    prompt: data.prompt,
                    commentsPrompt: data.commentsPrompt
                };
                // Set the token usage
                tokenUsage = data.tokenUsage;
                resolve(data);
            } else {
                reject(new Error("Invalid data received from server"));
            }
        });
    });
}

export function sendBotConf(prompt, dataTable, commentsPrompt) {
    socket.emit('updatePrompt', prompt, dataTable, commentsPrompt);
}

// send the viewd image status to the backend
export function setViewedImgFalse(itemId, platform) {
    socket.emit('setViewedImgFalse', { itemId, platform });
}

//Set tags for contact
export function setTagBtnStatus(itemId, data) {
    socket.emit('setTagBtnStatus', itemId, data);
}

// Mark chat as read
export function readChat(itemId, filter) {
    socket.emit('readChat', { itemId, filter });
}

// Send the deleted item to the backend
export function deleteItem(itemId, filter) {
    socket.emit('deleteItem', {itemId, filter});
}

//SEARCH CONTENT MESSAGE HISTORY FOR AN ITEM
socket.on('itemContentHistory', (entries) => {
    const currentItem = items[currentFilter].list.find( item => item.id === currentItemId);

    if (currentItem) {
        const sender = (entries[0].self) ? "bot" : (entries[0].self == false) ? "contact" : null;
        entries.forEach(entry => {
            var entryKey = (currentFilter == "contacts") ? "messages" : (currentFilter == "comments") ? "comments" : null;
            currentItem[entryKey].push(entry);
            createMessage(entry.content, entry.time, sender, entry.type);
        });
    }

    //SCROLL TO THE END
    const messagesContainer = document.querySelector('.messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
})

socket.on('newItems', (data) => { //RECEIVES LIST, TYPE, ALLITEMSLOADED.
    //IF DATA FILTER IS UNDEFINED, RETURN
    if (!items[data.filter]){
        // console.log('Data.type undefined when sending newItems: ', data.filter);
        return;
    }

    // If the new item is comment, set them its respective ID in front
    if (data.filter === 'comments') {
        data.items.forEach(item => {
            item.id = `${item.userId}-${item.postId}`;
        });
    }

    // set that that that kind of item as loaded
    if (!items[data.filter].contentLoaded) items[data.filter].contentLoaded = true;

    //ADD THE ITEM TO THE FILTER LIST
    items[data.filter].list = [...items[data.filter].list, ...data.items];
    items[data.filter].allItemsLoaded = data.allItemsLoaded; //IF EVERYTHINGS BEEN LOADED

    //IF IT'S THE SAME AS THE ONES OPENED, UPDATE THE LIST
    if (currentFilter === data.filter) {
        filterItems();
    }

    setIsLoading(false);
});


socket.on('newMessage', (data) => {
    //JUST TO KNOW HOW TO DEAL WITH THE OBJECTS
    const typeMapping = {
        contacts: {
            listKey: 'messages',
            dataKey: 'message'
        },
        comments: {
            listKey: 'comments',
            dataKey: 'comment'
        }
    };
    const itemType = data.message ? 'contacts' : data.comment ? 'comments' : null; // SHOW ITEM TYPE

    if (!itemType) { //IF ITEMTYPE IS UNDEFINED SHOW ERROR
        console.log("Error: itemType unclear");
        return;
    }

    // If the data type is not loaded, do not allow to save it locally <new implementation>
    if (!items[itemType].contentLoaded) {
        return;
    }

    const { listKey, dataKey } = typeMapping[itemType]; // Get the list key and data key based on the item type

    let newItem = null; // when you have a new item
    let itemId = null;  // The id of the incoming item

    // Create a new entry for the message/comment
    const newEntry = { 
        id: data[dataKey].id,
        content: data[dataKey].content,
        type: data[dataKey].type,
        time: data[dataKey].time,
        self: data[dataKey].self
    };

    if (itemType === 'comments') {
        itemId = `${data.userId}-${data.postId}`; //comment id
        //ITEM COMMENT
        newItem = {
            id: itemId, // new property
            userId: data.userId,
            postId: data.postId,
            name: data.name,
            platform: data.platform,
            botEnabled: data.botEnabled,
            permalink: data.permalink,
            read: data.read,
            [listKey]: [] // Dynamically set the property (messages or comments)
        };

    } else if (itemType === 'contacts') {
        itemId = data.id // contact id
        //ITEM CONTACT
        newItem = {
            id: itemId,
            name: data.name,
            platform: data.platform,
            botEnabled: data.botEnabled,
            imgViewed: data.imgViewed,
            read: data.read,
            tag: [],
            [listKey]: [] // Dynamically set the property
        };
    }

    const item = items[itemType].list.find(item => item.id === itemId); // Find the item of the message sent, on the local list

    if (!item) { //IF IT AINT THERE PUSH THE NEW ITEM
        newItem[listKey].push(newEntry); // Add the new entry to the new item
        items[itemType].list.unshift(newItem); // Add THE NEW ITEM at the beginning of the list

    } else {
        // UPDATE THE EXISTING ITEM
        item.preview = item.preview || {};
        item.preview.content = data[dataKey].content;
        item.preview.timestamp = data[dataKey].time;

        if (newEntry.self === false) {
            item.read = data.read;
            if(newEntry.type === 'image') item.imgViewed = data.imgViewed; // Reset imgViewed status for new images messages
        }

        item[listKey].push(newEntry); // Add the new entry to the existing item

        if(currentItemId === itemId) { //IF THE ITEM IS OPENED, SHOW THE MESSAGE
            const senderString = data[dataKey].self === true ? 'bot' : "contact"; //if true, bot, else contact
            createMessage(data[dataKey].content, data[dataKey].time, senderString, data[dataKey].type);

            if(newEntry.self === false) { // If the message is from the contact, mark it as read
                item.read = "read"; // Mark the item as read
            }
        }
    }
    
    filterItems(); // Filter the items and show them in front
});