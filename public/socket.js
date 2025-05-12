import { currentFilter, currentItemId } from "./script.js"; // Variables
import { filterItems, openItem, initilizeBotToggle } from "./script.js"; // Functions
import { createMessage } from './ui.js'; // Function create message

export const socket = io();

const ITEMS_PER_PAGE = 20;

let contentLoaded = {
    contacts: false,
    comments: false
};

// MAY GOD BLESS THIS CODE
export var items = {
    contacts: {
        allItemsLoaded: false,
        list: []
    },
    comments: {
        allItemsLoaded: false,
        list: []
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
    // console.log('item ID:', itemId);
    // console.log('checkeado:', status);
    
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
    console.log("GETTING ITEM HISTORY")
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
    console.log('Received history for item:', currentItemId, 'with messages:', entries);
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
        contentLoaded[data.filter] = true;
    } else if (data.filter === 'contacts') {
        contentLoaded[data.filter] = true;
    }

    console.log('data')
    console.log(data)
    console.log(items)


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

    if (!contentLoaded[itemType]) {
        return;
    }

    const { listKey, dataKey } = typeMapping[itemType]; // Get the list key and data key based on the item type
    
    let newItem = null; // when you have a new item
    let itemId = null;  // The id of the incoming item

    const newEntry = { // Create a new entry for the message/comment
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
            id: itemId,
            userId: data.userId,
            postId: data.postId,
            name: data.name,
            platform: data.platform,
            interest: data.interest,
            botEnabled: data.botEnabled,
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
    
    const item = items[itemType].list.find(item => item.id === itemId); // Find the item o the message sent, on the local list

    if (!item) { //IF IT AINT THERE PUSH THE NEW ITEM
        newItem[listKey].push(newEntry); // Add the new entry to the new item
        items[itemType].list.unshift(newItem); // Add THE NEW ITEM at the beginning of the list

    } else {
        // UPDATE THE EXISTING ITEM
        item.interest = data.interest;
        item.preview = item.preview || {};
        item.preview.content = data[dataKey].content;
        item.preview.timestamp = data[dataKey].time;

        item[listKey].push(newEntry); // Add the new entry to the existing item

        if(currentItemId === data.id) { //IF THE ITEM IS OPENED, SHOW THE MESSAGE
            const timeString = new Date(data[dataKey].time).toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            const senderString = data[dataKey].self === true ? 'bot' : "contact"; //if true, bot, else contact
            createMessage(data[dataKey].content, timeString, senderString, data[dataKey].type); //WILL CHANGE FOR EPOCH
        }
    }

    console.log(items)

    filterItems(); // Filter the items and show them in front
});


//THIS IS AN EXAMPLE DATA FOR THE SOCKET. THIS IS NOT USED
var newDATA = {
    itemId: "kKFDSlfdjs89989_32342432",
    username: "John Doe",
    platform: "whatsapp",
    interest: 1, // FROM 0 TO 10
    preview: {
        content: "example",
        timestamp: 1234567890
    },
    message: {
        id: "kKFDSlfdjs89989_32342432",
        content: "helo there",
        time: 1234567890,
        self: false,
        type: "text" //if type is image, the content is the url of the image
    }
}



var examplecontact = {
    id: "kKFDSlfdjs89989_32342432",
    name: "John Doe",
    platform: "whatsapp",
    interest: 1, // FROM 0 TO 10
    preview: {
        content: "example",
        timestamp: 1234567890
    },
    messages: [
        {
            content: "example",
            time: 1234567890,
            self: false,
            type: "text" //if type is image, the content is the url of the image
        }
    ]
}