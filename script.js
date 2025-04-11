document.addEventListener('DOMContentLoaded', function() {
    // functionality show / hide contacts in mobile
    document.querySelector('.toggle-contacts').addEventListener('click', function() {
        document.querySelector('.contacts-list').classList.toggle('show');
    });

    // functionality to select the contact
    document.querySelectorAll('.contact').forEach(contact => {
        contact.addEventListener('click', function() {
            // Actualizar contacto activo
            document.querySelectorAll('.contact').forEach(c => {
                c.classList.remove('active');
            });
            this.classList.add('active');
            
            // Actualizar título del chat
            const contactName = this.querySelector('.contact-name').textContent;
            document.querySelector('.chat-title').textContent = contactName;
            
            // En móvil, cerrar el panel de contactos al seleccionar uno
            if (window.innerWidth <= 768) {
                document.querySelector('.contacts-list').classList.remove('show');
            }
        });
    });

    // Funcionalidad para filtrar contactos por plataforma
    document.querySelectorAll('.platform-toggle').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const platform = this.getAttribute('data-platform');
            const isChecked = this.checked;
            
            // Mostrar u ocultar contactos según el filtro
            document.querySelectorAll(`.contact[data-platform="${platform}"]`).forEach(contact => {
                if (isChecked) {
                    contact.classList.remove('hidden');
                } else {
                    contact.classList.add('hidden');
                    
                    // Si el contacto activo se oculta, seleccionar otro visible
                    if (contact.classList.contains('active')) {
                        const firstVisibleContact = document.querySelector('.contact:not(.hidden):not(.empty)');
                        if (firstVisibleContact) {
                            firstVisibleContact.click();
                        }
                    }
                }
            });
        });
    });

    // Funcionalidad para sincronizar el toggle maestro de bots con los individuales
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