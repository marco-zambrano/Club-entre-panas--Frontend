import { socket, initSocket } from './socket.js';
import {createMessage} from './ui.js'
const messagesContainer = document.querySelector('.messages');

document.addEventListener('DOMContentLoaded', () => {
    // Initialize socket connection and message handling
    initSocket((data) => {
        // create the messages
        const {contactName, messageText, messageTime, sender} = data;        
        createMessage(messageText, messageTime, sender);
    });

});