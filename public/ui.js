import { setCurrentItem, currentItemId } from "./script.js";

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

function createContactCard(contact) {
    const contactElement = document.createElement('div');
    contactElement.className = `contact ${contact.id === currentItemId ? 'active' : ''}`;
    contactElement.dataset.platform = contact.platform;
    contactElement.dataset.itemId = contact.id;
    contactElement.dataset.type = contact.type;

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

    return contactElement;
}

function createCommentCard(comment) {
    const commentElement = document.createElement('div');
    commentElement.className = `contact ${comment.id === currentItemId ? 'active' : ''}`;
    commentElement.dataset.platform = comment.platform;
    commentElement.dataset.itemId = comment.id;
    commentElement.dataset.type = comment.type;

    const commentInfo = document.createElement('div');
    commentInfo.className = 'contact-info';
    commentInfo.classList.add('comment');


    // header
    const commentHeader = document.createElement('div');
    commentHeader.className = 'comment-header';

    const commentName = document.createElement('span');
    commentName.className = 'contact-name';
    commentName.textContent = comment.name;

    const typeIdentifier = document.createElement('span');
    typeIdentifier.className = 'type-identifier';
    typeIdentifier.textContent = 'C';
    // header

    
    // comments details
    const commentDetails = document.createElement('div');
    commentDetails.classList.add('comment-details')
    
    const postTitle = document.createElement('span');
    postTitle.className = 'post-title';
    postTitle.textContent = comment.postTitle;

    // Platform container
    const platform = document.createElement('div');
    platform.className = 'platform';
    
    const platformName = document.createElement('span');
    platformName.textContent = comment.platform.charAt(0).toUpperCase() + comment.platform.slice(1);
    
    const platformIcon = document.createElement('i');
    platformIcon.className = `fab fa-${comment.platform} ${comment.platform}-icon`;
    
    const messageTime = document.createElement('span');
    messageTime.className = 'contact-message-time';
    messageTime.textContent = comment.lastMessageTime;
    // Platform container

    commentHeader.appendChild(typeIdentifier);
    commentHeader.appendChild(commentName);

    platform.appendChild(platformName);
    platform.appendChild(platformIcon);

    commentDetails.appendChild(postTitle);
    commentDetails.appendChild(platform);
    commentDetails.appendChild(messageTime);
    
    commentInfo.appendChild(commentHeader);
    commentInfo.appendChild(commentDetails)
    commentElement.appendChild(commentInfo);

    return commentElement;
}

export function updateItemsList(items, currentFilter) {
    const itemsList = document.querySelector('.contacts-list');
    itemsList.innerHTML = '';

    // Create contact or comment card
    if (currentFilter === 'contact') {
        items.forEach(item => {
            const itemElement = createContactCard(item);
            itemsList.appendChild(itemElement);
        })
    } else {
        items.forEach(item => {
            const itemElement = createCommentCard(item);
            itemsList.appendChild(itemElement);
        })
    }

    // Verifica si hay items activos
    const currentItem = items.find(item => item.id === currentItemId);
    // Si no hay items visibles, mostrar mensaje
    if (!currentItem && items.length === 0){
        document.querySelector('.chat-title').textContent = 'Selecciona un contacto o comentario';
        document.querySelector('.messages').innerHTML = '';
        document.querySelector('.bot-toggle').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // event listener for the contact or comment list
    document.querySelector('.contacts-list').addEventListener('click', (event) => {
        const clicked = event.target.closest('.contact');
        if (!clicked) return;

        // Remover la clase active del elemento que la tenía previamente
        const previouslyActive = document.querySelector('.contact.active');
        if (previouslyActive) previouslyActive.classList.remove('active');

        // Activar el elemento clicked, ya sea comentario o contacto
        clicked.classList.add('active');
        setCurrentItem(clicked.dataset.itemId);
        
        // Actualizar el título del chat con el nombre del contacto/comentario
        const contactName = clicked.querySelector('.contact-name').textContent;
        document.querySelector('.chat-title').textContent = contactName;
        // Borrar el content del chat anterior
        document.querySelector('.messages').innerHTML = '';
    });

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
    // listen changes in the toggle for the input appearance
    document.querySelector('.individual-bot-toggle').addEventListener('change', function() {
        handleInputVisibility(this.checked);
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
