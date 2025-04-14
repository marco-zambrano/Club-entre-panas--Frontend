document.addEventListener('DOMContentLoaded', () => {
    // functionality show / hide contacts in mobile
    document.querySelector('.toggle-contacts').addEventListener('click', function() {
        document.querySelector('.contacts-list').classList.toggle('show');
    });
    
    // Changes the title of te current chat
    const changeChatTitle = (text) => document.querySelector('.chat-title').textContent = text;
    
    
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
    
        // Actualizar visibilidad del input al cambiar de contacto
        handleInputVisibility(document.querySelector('.individual-bot-toggle').checked);
        
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
        
        // Crear nuevo mensaje
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <div class="message-content">
                ${messageText}
                <span class="message-time">${timeString}</span>
            </div>
        `;
        
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
})
