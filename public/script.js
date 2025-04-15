import { socket, initSocket } from './socket.js';
import { createMessage, updateContactsList } from './ui.js';

let currentContactId = null;
let allContacts = []; // Mantener todos los contactos en memoria

// Función para filtrar contactos basado en los toggles activos
function filterContacts() {
    const filteredContacts = allContacts.filter(contact => {
        const platformToggle = document.querySelector(`.platform-toggle[data-platform="${contact.platform}"]`);
        return platformToggle && platformToggle.checked;
    });
    updateContactsList(filteredContacts);
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la conexión socket
    initSocket((data) => {
        if (data.contactId === currentContactId) {
            const { message } = data;
            createMessage(message.text, message.time, message.sender);
        }
    });

    // Escuchar los contactos iniciales
    socket.on('initialContacts', (contacts) => {
        allContacts = contacts; // Guardar todos los contactos
        filterContacts(); // Aplicar filtros actuales
    });

    // Escuchar nuevos contactos
    socket.on('newContact', (contact) => {
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
}