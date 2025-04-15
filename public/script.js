import { socket, initSocket } from './socket.js';
import { createMessage, updateContactsList } from './ui.js';

let currentContactId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la conexión socket
    initSocket((data) => {
        console.log(data.contactId === currentContactId)
        if (data.contactId === currentContactId) {
            const { message } = data;
            createMessage(message.text, message.time, message.sender);
        }
    });

    // Escuchar los contactos iniciales
    socket.on('initialContacts', (contacts) => {
        updateContactsList(contacts);
    });

    // Escuchar nuevos contactos
    socket.on('newContact', (contact) => {
        const contactsList = document.querySelector('.contacts-list');
        const contactElement = document.createElement('div');
        contactElement.className = 'contact';
        contactElement.dataset.platform = contact.platform;
        contactElement.dataset.contactId = contact.id;

        const contactInfo = document.createElement('div');
        contactInfo.className = 'contact-info';

        const contactName = document.createElement('span');
        contactName.className = 'contact-name';
        contactName.textContent = contact.name;

        const platform = document.createElement('div');
        platform.className = 'platform';
        
        const platformName = document.createElement('span');
        platformName.textContent = contact.platform.charAt(0).toUpperCase() + contact.platform.slice(1);
        
        const platformIcon = document.createElement('i');
        platformIcon.className = `fab fa-${contact.platform} ${contact.platform}-icon`;

        const messageTime = document.createElement('span');
        messageTime.className = 'contact-message-time';
        messageTime.textContent = contact.lastMessageTime;

        platform.appendChild(platformName);
        platform.appendChild(platformIcon);
        contactInfo.appendChild(contactName);
        contactInfo.appendChild(platform);
        contactInfo.appendChild(messageTime);
        contactElement.appendChild(contactInfo);

        // Agregar evento de clic para cambiar de contacto
        contactElement.addEventListener('click', () => {
            document.querySelectorAll('.contact').forEach(c => c.classList.remove('active'));
            contactElement.classList.add('active');
            document.querySelector('.chat-title').textContent = contact.name;
            document.querySelector('.messages').innerHTML = '';
            setCurrentContact(contact.id);
        });

        contactsList.appendChild(contactElement);
    });

    // Manejar el envío de mensajes
    document.querySelector('.send-button').addEventListener('click', sendMessage);
    document.querySelector('.message-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

function sendMessage() {
    const input = document.querySelector('.message-input');
    const messageText = input.value.trim();
    if (!messageText || !currentContactId) return;

    // Obtener hora actual
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Crear el mensaje localmente
    createMessage(messageText, timeString, 'bot');

    // Enviar el mensaje al servidor
    socket.emit('sendMessage', {
        contactId: currentContactId,
        messageText: messageText
    });

    // Limpiar input
    input.value = '';

    // Scroll al final de los mensajes
    const messagesContainer = document.querySelector('.messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Exportar la función para cambiar el contacto actual
export function setCurrentContact(contactId) {
    currentContactId = contactId;
}