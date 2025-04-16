import { socket, initSocket } from './socket.js';
import { createMessage, updateContactsList } from './ui.js';

export let currentContactId = null;
let allContacts = []; // Mantener todos los contactos en memoria

// Función para filtrar contactos basado en los toggles activos
function filterContacts() {
    console.log('Filtering contacts:', allContacts);
    document.querySelector('.bot-toggle').style.display = 'block';
    const filteredContacts = allContacts.filter(contact => {
        const platformToggle = document.querySelector(`.platform-toggle[data-platform="${contact.platform}"]`);
        return platformToggle && platformToggle.checked;
    });
    
    // Verificar si el contacto actual sigue visible después del filtrado
    const currentContactStillVisible = filteredContacts.some(contact => contact.id === currentContactId);
    
    // Si el contacto actual ya no es visible, seleccionar el primer contacto visible
    if (!currentContactStillVisible && filteredContacts.length > 0) {
        currentContactId = filteredContacts[0].id;
    }
    
    updateContactsList(filteredContacts);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    // Inicializar la conexión socket
    initSocket((data) => {
        if (data.contactId === currentContactId) {
            const { message } = data;
            createMessage(message.text, message.time, message.sender);
        }
    });

    // Escuchar los contactos iniciales
    socket.on('initialContacts', (contacts) => {
        console.log('Received initial contacts:', contacts);
        allContacts = contacts; // Guardar todos los contactos
        filterContacts(); // Aplicar filtros actuales
    });

    // Escuchar nuevos contactos
    socket.on('newContact', (contact) => {
        console.log('Received new contact:', contact);
        allContacts.push(contact); // Agregar nuevo contacto a la lista completa
        filterContacts(); // Actualizar la lista filtrada
    });

    // Manejar los filtros de plataforma
    document.querySelectorAll('.platform-toggle').forEach(toggle => {
        toggle.addEventListener('change', filterContacts);
    });
});

// Exportar la función para cambiar el contacto actual
export function setCurrentContact(contactId) {
    currentContactId = contactId;
    console.log('Current contact set to:', contactId);
}