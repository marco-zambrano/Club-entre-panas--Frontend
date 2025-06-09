import { currentFilter, currentItemId } from "./script.js"; // Variables
import { filterItems} from "./script.js"; // Functions
import { createMessage } from './ui.js'; // Function create message

export const socket = io();

const ITEMS_PER_PAGE = 20;

// MAY GOD BLESS THIS CODE
export var items = {
    contacts: {
        allItemsLoaded: false,
        list: [],
        contentLoaded: false
        // we use contentLoaded to define, that this kind of item is saved or not locally, porque habia un problema que cuando recien entrabas
        // y no habias los contactos aun, cuando llegaba un nuevo mensaje del evento newMessage, los comentarios igualmente se cargaban localmente
        // Lo que hacia que cuando ibas a los comentarios por primera vez, los que estaban ya previamente cargados localmente, aparecieran duplicados
    },
    comments: {
        allItemsLoaded: false,
        list: [],
        contentLoaded: false
    }
}

export let quickReps = [];


// AND YOU KNOW I'M THE LORD WHEN I SAY THIS
export function getItems(filter) { //must be "contacts" or "comments" PLURAL
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
        status: status
    });
}
//SEND MANUAL MESSAGE
export function sendManMessage(metaId, type, content, filter) {
    socket.emit('sendManMessage', {
        metaId: metaId,
        content: content,
        type: type,
        filter: filter
    });
}
//SEND WHICH ITEM IS OPENED
export function getItemHistory(itemId, filter) {
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

// Bot config
export var botPrompt = "";
export function getCustomPrompt() {
    return new Promise((resolve, reject) => {
        socket.emit('getCustomPrompt');
        socket.once('customPrompt', (text) => { // Listen for the server response only once
            botPrompt = text;
            console.log("Bot conf: ", botPrompt);
            resolve(text); // Resolve the promise with the server response
        });

        // Optional: Add a timeout to reject the promise if no response is received
        setTimeout(() => {
            reject(new Error("Timeout: No response from server for getCustomPrompt"));
        }, 10000); // Adjust timeout duration as needed
    });
}

export function sendBotConf(text) {
    socket.emit('updatePrompt', text);
}

//SEARCH CONTENT HISTORY FOR AN ITEM
socket.on('itemContentHistory', (entries) => {
    const currentItem = items[currentFilter].list.find( item => item.id === currentItemId);
    
    if (currentItem) {
        const sender = (entries[0].self) ? "bot" : (entries[0].self == false) ? "contact" : null;
        entries.forEach(entry => {
            var entryKey = (currentFilter == "contacts") ? "messages" : (currentFilter == "comments") ? "comments" : null;
            currentItem[entryKey].push(entry);
            const timeString = new Date(entry.time).toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            createMessage(entry.content, timeString, sender, entry.type);
        });
    }

        
    //SCROLL TO THE END (DEPRECATED?)
    const messagesContainer = document.querySelector('.messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
})

socket.on('newItems', (data) => { //RECEIVES LIST, TYPE, ALLITEMSLOADED.
    //IF DATA FILTER IS UNDEFINED, RETURN
    if (!items[data.filter]){
        console.log('Data.type undefined when sending newItems: ', data.filter);
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
            interest: data.interest,
            botEnabled: data.botEnabled,
            permalink: data.permalink,  // new property
            [listKey]: [] // Dynamically set the property (messages or comments)
        };

    } else if (itemType === 'contacts') {
        itemId = data.id // contact id
        //ITEM CONTACT
        newItem = {
            id: itemId,
            name: data.name,
            platform: data.platform,
            interest: data.interest,
            botEnabled: data.botEnabled,
            [listKey]: [] // Dynamically set the property (messages or comments)
        };
        
    }
    
    const item = items[itemType].list.find(item => item.id === itemId); // Find the item of the message sent, on the local list

    if (!item) { //IF IT AINT THERE PUSH THE NEW ITEM
        newItem[listKey].push(newEntry); // Add the new entry to the new item
        items[itemType].list.unshift(newItem); // Add THE NEW ITEM at the beginning of the list

    } else {
        // UPDATE THE EXISTING ITEM
        item.interest = data.interest;
        item.preview = item.preview || {};
        item.preview.content = data[dataKey].content;
        item.preview.timestamp = data[dataKey].time;

        if (newEntry.type === 'image') {
            item.imageVisualized = false; // Reset image visualized status for new images messages
        }

        item[listKey].push(newEntry); // Add the new entry to the existing item

        if(currentItemId === itemId) { //IF THE ITEM IS OPENED, SHOW THE MESSAGE
            const timeString = new Date(data[dataKey].time).toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            const senderString = data[dataKey].self === true ? 'bot' : "contact"; //if true, bot, else contact
            createMessage(data[dataKey].content, timeString, senderString, data[dataKey].type); //WILL CHANGE FOR EPOCH
        }
    }

    // console.log('new item arrived, show all items:')
    // console.log(items)

    filterItems(); // Filter the items and show them in front
});