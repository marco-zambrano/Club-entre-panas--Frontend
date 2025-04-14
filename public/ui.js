export function createMessage(text, time, sender) {
    // Crear nuevo mensaje
    const messageElement = document.createElement('div');
    messageElement.className = 'message';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = text;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = time;

    // Se agrega el mensaje basado en el remitente usando su propiedad definida del css
    messageElement.classList.add(`${sender}-sender`)
    
    // Añadir mensaje al chat
    messageContent.appendChild(timeSpan);
    messageElement.appendChild(messageContent);
    document.querySelector('.messages').appendChild(messageElement);
    
    // Scroll al final de los mensajes
    const messagesContainer = document.querySelector('.messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

export function updateContactsList(contacts) {
    const contactsList = document.querySelector('.contacts-list');

    contacts.forEach((contact, index) => {
        const contactElement = document.createElement('div');
        contactElement.className = `contact ${index === 0 ? 'active' : ''}`;
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
        platformIcon.className = `fab fa-${contact.platform}-square ${contact.platform}-icon`;

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

    // Establecer el primer contacto como activo si existe
    if (contacts.length > 0) {
        setCurrentContact(contacts[0].id);
        document.querySelector('.chat-title').textContent = contacts[0].name;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // functionality show / hide contacts in mobile
    document.querySelector('.toggle-contacts').addEventListener('click', function() {
        document.querySelector('.contacts-list').classList.toggle('show');
    });
    
    // hide or show text input depending the individual bot toggle boolean value
    function handleInputVisibility(isChecked) {
        const messageInputContainer = document.querySelector('.message-input-container');
        messageInputContainer.style.display = isChecked ? 'none' : 'flex';
    }
    
    // Initialice the input appearence based on the initial toggle value state
    handleInputVisibility(document.querySelector('.individual-bot-toggle').checked);
    
    // listen changes in the toggle
    document.querySelector('.individual-bot-toggle').addEventListener('change', function() {
        handleInputVisibility(this.checked);
    });
    
    // filter contacts for each platform 
    document.querySelectorAll('.platform-toggle').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const platform = this.getAttribute('data-platform');
            const isChecked = this.checked;
            
            // show or hide the contacts based on the filter
            document.querySelectorAll(`.contact[data-platform="${platform}"]`).forEach(contact => {
                if (isChecked) {
                    contact.classList.remove('hidden');
                } else {
                    contact.classList.add('hidden');
                    
                    // if the contact is hidden by the filter, then find another contact and add it the class active
                    if (contact.classList.contains('active')) {
                        const firstVisibleContact = document.querySelector('.contact:not(.hidden)');
                        if (firstVisibleContact) {
                            firstVisibleContact.classList.add('active');
                            const contactName = firstVisibleContact.querySelector('.contact-name').textContent;
                            document.querySelector('.chat-title').textContent = contactName;
                            setCurrentContact(firstVisibleContact.dataset.contactId);
                        } else {
                            // In case there is no contact visible, set an adverstiment
                            document.querySelector('.chat-title').textContent = 'Selecciona un contacto';
                            document.querySelector('.messages').innerHTML = '';
                            document.querySelector('.bot-toggle').style.display = 'none';
                        }
                    }
                }
            });
        });
    });
    
    // Bot configuration modal functionality
    const botConfigButton = document.querySelector('.bot-config-button');
    const botConfigModal = document.querySelector('.bot-config-modal');
    const closeModalButton = document.querySelector('.close-modal');
    
    // Open modal
    botConfigButton.addEventListener('click', () => {
        botConfigModal.classList.add('show');
    });
    // Close modal with button
    closeModalButton.addEventListener('click', () => {
        botConfigModal.classList.remove('show');
    });
    // Close modal when clicking outside
    botConfigModal.addEventListener('click', (e) => {
        if (e.target === botConfigModal) {
            botConfigModal.classList.remove('show');
        }
    });
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && botConfigModal.classList.contains('show')) {
            botConfigModal.classList.remove('show');
        }
    });

    // Funcionalidad para enviar mensajes
    document.querySelector('.send-button').addEventListener('click', sendMessage);
    document.querySelector('.message-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const input = document.querySelector('.message-input');
        const messageText = input.value.trim();
        if (!messageText) return
        
        // Obtener hora actual
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        // create the message
        createMessage(messageText, timeString, 'bot');
        
        // Limpiar input
        input.value = '';
        
        // Scroll al final de los mensajes
        const messagesContainer = document.querySelector('.messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
})
