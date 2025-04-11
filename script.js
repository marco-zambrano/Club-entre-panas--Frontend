document.addEventListener('DOMContentLoaded', () => {
    // functionality show / hide contacts in mobile
    document.querySelector('.toggle-contacts').addEventListener('click', function() {
        document.querySelector('.contacts-list').classList.toggle('show');
    });

    // Changes the title of te current chat
    const changeChatTitle = (text) => document.querySelector('.chat-title').textContent = text;

    // select the contact using event delegation 
    document.querySelector('.contacts-list').addEventListener('click', (e) => {
        // verify if any child was clicked
        const contactElement = e.target.closest('.contact');
        if (!contactElement) return // return in case a contact is not clicked

        // update the active contact
        document.querySelectorAll('.contact.active').forEach(c => c.classList.remove('active'));
        contactElement.classList.add('active');
        
        // update de chat title
        const contactName = contactElement.querySelector('.contact-name').textContent;
        changeChatTitle(contactName);
        checkIndividualToggle()
        
        // in mobile, it closes the contact panel in case you click one
        if (window.matchMedia('(max-width: 768px)').matches) {
            document.querySelector('.contacts-list').classList.remove('show');
        }
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
                            changeChatTitle(contactName);
                        } else {
                            // In case there is no contact visible, set an adverstiment
                            document.querySelector('.chat-title').textContent = 'Selecciona un contacto';
                            document.querySelector('.messages').innerHTML = '';
                        }
                    }
                }
            });
        });
    });
    
    // functionality to sync the master toggle with the individual bot toggles 
    const masterBotToggle = document.getElementById('master-bot-toggle');
    const individualBotToggles = document.querySelectorAll('.individual-bot-toggle');
    
    masterBotToggle.addEventListener('change', function() {
        const isChecked = this.checked;
        
        // Sincronizar todos los toggles individuales con el maestro
        individualBotToggles.forEach(toggle => {
            toggle.checked = !isChecked; // Invertimos porque "Desactivar todos los bots" significa checked = desactivado
        });
    });
    
    // Permitir control manual de los toggles individuales independientemente del maestro
    individualBotToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            // No es necesario sincronizar con el maestro cuando se cambia manualmente
        });
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
        
        if (messageText) {
            // Crear nuevo mensaje
            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.innerHTML = `<div class="message-content">${messageText}</div>`;
            
            // Añadir clase para alinear a la derecha (como si fuera enviado por el usuario)
            messageElement.style.alignSelf = 'flex-end';
            messageElement.querySelector('.message-content').style.backgroundColor = '#0b93f6';
            
            // Añadir mensaje al chat
            document.querySelector('.messages').appendChild(messageElement);
            
            // Limpiar input
            input.value = '';
            
            // Scroll al final de los mensajes
            const messagesContainer = document.querySelector('.messages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
});