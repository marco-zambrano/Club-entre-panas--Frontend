import { currentItemId, currentFilter } from "./script.js"; // Variables
import { openItem, setCurrentFilter, filterItems, initilizeBotToggle, handleNameUpdate } from "./script.js"; // Functions
import { sendManMessage, items, quickReps, getQuickReps, updateQuickReps, sendBotConf, getCustomPrompt, botPrompts, tokenUsage, reportErrorToBackend, sendDebugMessage, deleteItem } from './socket.js';

// DOM Elements
const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-button');
const attachButton = document.querySelector('.attach-button');
const imageFileInput = document.getElementById('image-file-input');
const messagesContainer = document.querySelector('.messages');
const messageInputContainer = document.querySelector('.message-input-container');
const stagedImagesGrid = document.getElementById('staged-images-grid');
// Se reemplaza `stagedImageFile` por un array para manejar múltiples archivos.
// Cada elemento del array será un objeto: { id: string, blob: Blob }
let stagedImageFiles = []; 
// Límite de imágenes que se pueden añadir y enviar a la vez.
const MAX_IMAGES = 3;

// --- Elements for Quick Reply Image Staging ---
const qrImageFileInput = document.getElementById('qr-image-file-input');
const qrAttachButton = document.querySelector('.qr-attach-button');
const qrStagedImagesGrid = document.getElementById('qr-staged-images-grid');
let stagedQuickReplyImages = []; // Holds blobs for the new QR being created

export const tagColors = {
    'Contraentrega': '#26d367',
    'RP': '#efb32f',
    'Delivery': '#57c9ff',
    'Terminado': '#c89ecc',
    'Servientrega': '#068c15ff',
    'Recibido': '#ee5252'
}

export function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Encuentra URLs en una cadena de texto y las convierte en elementos <a> clickeables.
 * El texto que no es URL se inserta como nodos de texto seguros.
 * @param {string} text - El contenido del mensaje.
 * @returns {DocumentFragment} Un fragmento de documento con el contenido procesado.
 */
function linkifyText(text) {
    const fragment = document.createDocumentFragment();
    // Expresión regular actualizada para detectar (1) http/https, (2) www. y (3) dominios.tld comunes
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\b[a-zA-Z0-9-]+\.(?:com|org|net|io|gov|edu|dev|app|co|es|mx|ar|cl)\b)/ig;

    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
        // Añadir el texto que viene ANTES del enlace
        if (match.index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
        }

        // Crear y añadir el elemento <a> para el enlace
        const url = match[0];
        // Asegurarse de que los enlaces 'www.' o 'dominio.com' funcionen correctamente, usando https por defecto
        const href = url.startsWith('http') ? url : `https://${url}`;
        
        const a = document.createElement('a');
        a.href = href;
        a.textContent = url;
        a.target = '_blank'; // Abrir en nueva pestaña
        a.rel = 'noopener noreferrer'; // Buena práctica de seguridad
        fragment.appendChild(a);

        lastIndex = urlRegex.lastIndex;
    }

    // Añadir el texto restante DESPUÉS del último enlace
    if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
    }

    return fragment;
}

export function createMessage(content, time, sender, type) {
    // create new message
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    // Se agrega el mensaje basado en el remitente usando su propiedad definida del css
    messageElement.classList.add(`${sender}-sender`)

    // Contenido del mensaje
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    // Si es una imagen, crear el elemento img
    if (type === 'image') {
        messageElement.classList.add(`image`); // Definimos que el mensaje va a ser un img
        const imageElement = document.createElement('img');
        imageElement.src = content;
        imageElement.alt = 'Imagen enviada';
        imageElement.className = 'message-image';
        imageElement.onload = () => {
            scrollToBottom();
        };
        imageElement.addEventListener('click', () => {
            openLightbox(content);
        });
        messageContent.appendChild(imageElement);
    } else if(type === "text"){
        // Si es texto normal, procesarlo para encontrar links de forma segura
        messageContent.appendChild(linkifyText(content));
    } else if (type === 'audio') {
        const audioAdvice = document.createElement('span');
        audioAdvice.className = 'message-audio';
        audioAdvice.textContent = 'audio.. 🔉';
        messageElement.appendChild(audioAdvice);
        messageContent.textContent = content;
    }

    // Span de tiempo
    const currentDate = new Date(time);
    // 00:00 
    let horas = currentDate.getHours();
    const minutos = currentDate.getMinutes();
    const ampm = horas >= 12 ? 'PM' : 'AM';
    const minutosFormateados = minutos < 10 ? '0' + minutos : minutos;
    horas = horas % 12;
    horas = horas ? horas : 12; // Si el resultado de % 12 es 0, significa que son las 12
    const dia = currentDate.getDate();
    const mes = currentDate.getMonth() + 1;
    const anio = currentDate.getFullYear();
    const tiempoFormateado = `${dia}/${mes}/${anio} ${horas}:${minutosFormateados} ${ampm}`;
    // Creamos el span de tiempo
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = tiempoFormateado;

    // Añadir mensaje al chat
    messageContent.appendChild(timeSpan);
    messageElement.appendChild(messageContent);
    // Agregar al main container
    messagesContainer.appendChild(messageElement);

    // Hacer scroll al final SOLO SI el usuario ya estaba cerca del final
    if (messagesContainer.scrollTop + messagesContainer.clientHeight >= messagesContainer.scrollHeight - 100) {
        scrollToBottom();
    }
}


// --- Lógica de Procesamiento y Staging de Múltiples Imágenes ---

/**
 * Renderiza las previsualizaciones de las imágenes en el array stagedImageFiles.
 * Se llama cada vez que el array de imágenes en staging cambia.
 */
function renderImagePreviews() {
    sendDebugMessage("Rendering image previews, count: " + stagedImageFiles.length);
    // Se obtiene la referencia al contenedor de la cuadrícula.
    const grid = document.getElementById('staged-images-grid');
    grid.innerHTML = ''; // Limpiar previsualizaciones antiguas para renderizar desde cero.

    // Si hay imágenes, se muestra la cuadrícula; si no, se oculta.
    if (stagedImageFiles.length > 0) {
        grid.style.display = 'flex';
        grid.style.padding = '8px';
    } else {
        grid.style.display = 'none';
        grid.style.padding = '0px';
    }

    // Por cada imagen en el estado, se crea su elemento de previsualización.
    stagedImageFiles.forEach(fileData => {
        const previewElement = document.createElement('div');
        previewElement.className = 'image-preview-thumbnail';
        // Se asigna un ID único al elemento para poder encontrarlo y eliminarlo después.
        previewElement.dataset.id = fileData.id;

        // Se crea el elemento <img> para la miniatura.
        const img = document.createElement('img');
        // Se usa URL.createObjectURL para mostrar la imagen local (en memoria) sin subirla.
        img.src = URL.createObjectURL(fileData.blob);
        // Cuando la imagen carga, se revoca el ObjectURL para liberar memoria.
        img.onload = () => URL.revokeObjectURL(img.src);

        // Se crea el botón de eliminar para esta miniatura.
        const removeBtn = document.createElement('button');
        removeBtn.className = 'image-preview-remove-btn';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        
        // Se añaden la imagen y el botón al contenedor de la previsualización.
        previewElement.appendChild(img);
        previewElement.appendChild(removeBtn);
        // Se añade la previsualización completa a la cuadrícula.
        grid.appendChild(previewElement);
    });

    // Se reajusta la altura del área de texto por si ha cambiado.
    autoResizeTextarea();
}

/**
 * Procesa una lista de archivos de imagen, los comprime y los añade al estado `stagedImageFiles`.
 * @param {FileList | File[]} files - La lista de archivos a procesar.
 */
function handleAndStageFiles(files) {
    sendDebugMessage("handleAndStageFiles called with files: " + files.length);
    const filesToProcess = Array.from(files);

    // Se comprueba que no se exceda el límite de imágenes permitidas.
    if (stagedImageFiles.length + filesToProcess.length > MAX_IMAGES) {
        alert(`No se pueden subir más de ${MAX_IMAGES} imágenes a la vez.`);
        return;
    }

    // Se crea un array de promesas, donde cada promesa es el procesamiento de una imagen.
    const processingPromises = filesToProcess.map(file => {
        return resizeAndCompressImage(file).then(blob => ({
            // Se genera un objeto con un ID único y el blob de la imagen procesada.
            id: `staged-${Date.now()}-${Math.random()}`,
            blob: blob
        })).catch(error => {
            // Si una imagen falla, se loguea el error y se devuelve null.
            console.error('Error procesando un archivo, se omitirá:', file.name, error);
            return null;
        });
    });

    // Promise.all espera a que todas las imágenes se procesen.
    Promise.all(processingPromises).then(processedFiles => {
        // Se filtran las imágenes que pudieron haber fallado (son null).
        const successfulFiles = processedFiles.filter(f => f !== null);
        // Se añaden las nuevas imágenes procesadas al array de estado.
        stagedImageFiles.push(...successfulFiles);
        // Se vuelve a renderizar la UI para mostrar las nuevas previsualizaciones.
        renderImagePreviews();
        // TODO: Ocultar el indicador visual de carga.
    });
}

/**
 * Redimensiona y comprime una imagen, con un enfoque condicional y eficiente.
 * Si la imagen es grande, usa búsqueda binaria para encontrar la mejor calidad
 * por debajo de un tamaño de archivo objetivo.
 * @param {File} file - El archivo de imagen original.
 * @param {number} [maxWidth=1280] - Ancho máximo de la imagen de salida.
 * @param {number} [maxHeight=1280] - Alto máximo de la imagen de salida.
 * @param {number} [targetSizeBytes=500000] - El tamaño objetivo en bytes (aprox. 500 KB).
 * @returns {Promise<Blob>} Una promesa que se resuelve con el Blob de la imagen procesada.
 */
function resizeAndCompressImage(file, maxWidth = 1280, maxHeight = 1280, targetSizeBytes = 500000) {
    sendDebugMessage("resizeAndCompressImage called for file: " + file.name);
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            return reject(new Error('El archivo no es una imagen.'));
        }

        // Se determina si el archivo ya es suficientemente pequeño.
        const isAlreadySmall = file.size < targetSizeBytes;

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(img.src); // Liberar memoria del ObjectURL.

            let width = img.width;
            let height = img.height;

            // Se calculan las nuevas dimensiones manteniendo la proporción.
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Si la imagen ya era pequeña, se hace una única compresión de alta calidad y se resuelve.
            if (isAlreadySmall) {
                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error('Canvas to Blob conversion failed for small image.'));
                    },
                    'image/jpeg',
                    0.92 // Calidad alta por defecto para imágenes ya pequeñas.
                );
                return;
            }

            // --- Búsqueda Binaria para Compresión Iterativa ---
            // Si la imagen es grande, se busca la calidad óptima para alcanzar el tamaño objetivo.
            let lowerBound = 0.0; // Límite inferior de calidad.
            let upperBound = 1.0; // Límite superior de calidad.
            const iterations = 7; // 7 iteraciones son suficientes para una gran precisión.
            let bestBlob = null; // Almacenará el mejor resultado que cumpla la condición.

            // Función recursiva para la búsqueda.
            const findBestQuality = (iteration) => {
                // Condición de parada: si se excede el número de iteraciones.
                if (iteration > iterations) {
                    // Si se encontró un blob válido, se resuelve con él.
                    if (bestBlob) {
                        resolve(bestBlob);
                    } else {
                        // Si no (muy improbable), se resuelve con una calidad media como fallback.
                        canvas.toBlob(resolve, 'image/jpeg', 0.5);
                    }
                    return;
                }

                // Se calcula el punto medio del rango de calidad actual.
                const quality = (lowerBound + upperBound) / 2;
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Canvas to Blob conversion failed during iteration.'));
                            return;
                        }

                        // Si el blob resultante es más grande que el objetivo...
                        if (blob.size > targetSizeBytes) {
                            // ...la calidad máxima posible está en la mitad inferior. Se ajusta el límite superior.
                            upperBound = quality;
                        } else {
                            // Si es más pequeño o igual, es un candidato válido.
                            // Se guarda como el mejor resultado hasta ahora.
                            bestBlob = blob;
                            // Se intenta buscar una calidad aún mejor en la mitad superior. Se ajusta el límite inferior.
                            lowerBound = quality;
                        }
                        // Se llama a la siguiente iteración.
                        findBestQuality(iteration + 1);
                    },
                    'image/jpeg',
                    quality
                );
            };

            findBestQuality(1); // Iniciar la búsqueda.
        };

        img.onerror = (error) => {
            URL.revokeObjectURL(img.src);
            reject(error);
        };
    });
}

/**
 * Envía un único blob de imagen procesada al backend.
 * @param {Blob} imageBlob - El blob de la imagen a enviar.
 */
function sendProcessedImage(imageBlob) {
    sendDebugMessage("sendProcessedImage called.");
    const reader = new FileReader();
    reader.onload = (e) => {
        const base64Image = e.target.result;
        const recipientPlatform = items[currentFilter].list.find(item => item.id === currentItemId)?.platform;
        if (!recipientPlatform) {
            console.error("No se pudo determinar la plataforma del destinatario para enviar la imagen.");
            return;
        }
        const messageTime = Date.now();

        // Se emite el evento de WebSocket con la imagen en Base64.
        sendManMessage(currentItemId, "image", base64Image, currentFilter, recipientPlatform);
        sendDebugMessage("Image sent to backend.");
        
        // Se crea el mensaje visualmente en el chat local de forma optimista.
        createMessage(base64Image, messageTime, 'bot', 'image');

        // Se guarda la entrada del mensaje en el estado local del item.
        const entry = { content: base64Image, time: messageTime, type: "image", self: true };
        const currentItem = items[currentFilter].list.find(item => item.id === currentItemId);
        if (currentItem) {
            const entryKey = (currentFilter === "contacts") ? "messages" : "comments";
            currentItem[entryKey].push(entry);
        }
    };
    reader.onerror = (error) => {
        console.error("FileReader error:", error);
        alert("No se pudo leer una de las imágenes procesadas. Por favor, inténtelo de nuevo.");
    };
    // Se lee el blob como una URL de datos (Base64).
    reader.readAsDataURL(imageBlob);
}


// Funciones para crear los items de comentarios y contactos
function createContactCard(contact) {
    // Container del contacto
    const contactElement = document.createElement('div');
    contactElement.className = `contact ${contact.id === currentItemId ? 'active' : ''}`;
    if (contact.read === "shutdown") { 
        contactElement.classList.add('shutdown');
    } else if (contact.read === "unread") { // Si el contacto no ha sido leido y no es el contacto activo
        contactElement.classList.add('unread');
    } //WHAT THIS DOES IS THAT IF THE CONTACT ID IS THE SAME AS THE CURRENT ITEM ID, IT WILL ADD THE CLASS ACTIVE
    contactElement.dataset.platform = contact.platform;
    contactElement.dataset.itemId = contact.id;
    contactElement.dataset.type = contact.type;

    // Three-dots menu
    const optionsMenu = document.createElement('div');
    optionsMenu.className = 'item-options-menu';
    optionsMenu.innerHTML = `
        <i class="fas fa-ellipsis-v"></i>
        <div class="options-popup">
            <button class="delete-item-btn" data-item-id="${contact.id}" data-item-name="${contact.name}">Eliminar</button>
        </div>
    `;
    contactElement.appendChild(optionsMenu);

    // Agregamos la etiqueta de categoría si existe
    if (contact.tag && contact.tag.length > 0) {
        const tagContainer = document.createElement('div');
        tagContainer.className = 'contact-tags-container';
        tagContainer.id = `contact-tags-${contact.id}`;

        contact.tag.forEach(tagName => {
            const tagElement = document.createElement('span');
            tagElement.className = 'contact-tag';
            tagElement.textContent = tagName;
            tagElement.style.backgroundColor = tagColors[tagName];
            tagContainer.appendChild(tagElement);
        });
        contactElement.appendChild(tagContainer);
    }

    if (contact.imgViewed === false) { // Si el contacto no ha visto la imagen, creamos un elemento de notificación de imagen
        //  SI ya existe el elemento de notificación de imagen, e imageVisualized es false, mostrar la notificación
        const currentImageNotification = document.getElementById(`image-notification-${contact.id}`);
        if (currentImageNotification) {
            currentImageNotification.style.display = 'block';
        } else {
            // Si no existe, creamos el elemento de notificación de imagen
            const imageNotificationElement = document.createElement('div');
            imageNotificationElement.className = 'image-notification';
            imageNotificationElement.id = `image-notification-${contact.id}`;
            imageNotificationElement.textContent = '🖼️';
            contactElement.appendChild(imageNotificationElement);
        }
    }

    // Preview
    const preView = document.createElement('span');
    preView.className = 'contact-preview';
    preView.textContent = contact.messages[contact.messages.length - 1].content; // Ultimo mensaje

    // Span del tiempo del ultimo mensaje
    const fecha = new Date(contact.messages[contact.messages.length -1].time);
    // dias
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // getMonth() devuelve 0-11, así que sumamos 1
    const year = fecha.getFullYear().toString().slice(-2);
    // horas
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const ampm = horas >= 12 ? 'PM' : 'AM';

    horas = horas % 12;
    horas = horas ? horas : 12; // Si el resultado de % 12 es 0, significa que son las 12

    // Aseguramos que el día, mes y minutos tengan dos dígitos (ej: 01, 05)
    const diaFormateado = dia < 10 ? '0' + dia : dia;
    const mesFormateado = mes < 10 ? '0' + mes : mes;
    const minutosFormateados = minutos < 10 ? '0' + minutos : minutos;

    const tiempoFormateado = `${diaFormateado}/${mesFormateado}/${year} - ${horas}:${minutosFormateados} ${ampm}`;
    // creamos el span de tiempo del ultimo mensaje
    const messageTime = document.createElement('span');
    messageTime.className = 'contact-message-time';
    messageTime.textContent = tiempoFormateado;

    // Container de la info del contacto
    const contactInfo = document.createElement('div');
    contactInfo.className = 'contact-info';

    // Nombre del contacto
    const contactName = document.createElement('span');
    contactName.className = 'contact-name';
    contactName.textContent = contact.name;

    // container for platform info
    const contactSide = document.createElement('div');
    contactSide.className = 'contact-side';

    // Container de la plataforma
    const platform = document.createElement('div');
    platform.className = 'platform';

    // Span de la plataforma
    const platformName = document.createElement('span');
    platformName.textContent = contact.platform.charAt(0).toUpperCase() + contact.platform.slice(1);

    // Icono de la plataforma
    const platformIcon = document.createElement('i');
    platformIcon.className = `fab fa-${contact.platform} ${contact.platform}-icon`;


    // Platform Container <--- nombre e icono
    platform.appendChild(platformName);
    platform.appendChild(platformIcon);

    // contact side <----- platform
    contactSide.appendChild(platform);

    // Contact info <--- nombre, plataforma, hora de ultimo mensaje
    contactInfo.appendChild(contactName);
    contactInfo.appendChild(messageTime);

    // Contact element <--- El preview y la informacion del contacto
    contactElement.appendChild(preView);
    contactElement.appendChild(contactInfo);
    contactElement.appendChild(contactSide);

    return contactElement; // Retornamos el contacto
}

function createCommentCard(comment) {
    // Container del comentario
    const commentElement = document.createElement('div');
    commentElement.className = `contact ${comment.id === currentItemId ? 'active' : ''}`;
    commentElement.dataset.platform = comment.platform;
    commentElement.dataset.itemId = comment.id;
    commentElement.dataset.type = comment.type;
    if (comment.read === "unread") { // Si el contacto no ha sido leido y no es el contacto activo
        commentElement.classList.add('unread');
    } 
    // Three-dots menu
    const optionsMenu = document.createElement('div');
    optionsMenu.className = 'item-options-menu';
    optionsMenu.innerHTML = `
        <i class="fas fa-ellipsis-v"></i>
        <div class="options-popup">
            <button class="delete-item-btn" data-item-id="${comment.id}" data-item-name="${comment.name}">Eliminar item</button>
        </div>
    `;
    commentElement.appendChild(optionsMenu);

    // Container del info del comentario (la clase dice contact-info porque son los mismos estilos)
    const commentInfo = document.createElement('div');
    commentInfo.className = 'contact-info';
    commentInfo.classList.add('comment');

    // Preview
    const preView = document.createElement('span');
    preView.className = 'contact-preview';
    preView.textContent = comment.comments[comment.comments.length - 1].content; // Ultimo mensaje

    // Header container
    const commentHeader = document.createElement('div');
    commentHeader.className = 'comment-header';

    // Logo con la C, para definir que es un comentario
    const typeIdentifier = document.createElement('span');
    typeIdentifier.className = 'type-identifier';
    typeIdentifier.textContent = 'C';

    // Nombre del user del comentario
    const commentName = document.createElement('span');
    commentName.className = 'contact-name';
    commentName.textContent = comment.name;

    // comments details container
    const commentDetails = document.createElement('div');
    commentDetails.classList.add('comment-details')

    // Platform container
    const platform = document.createElement('div');
    platform.className = 'platform';

    // Nombre de la plataforma de la que viene el comment
    const platformName = document.createElement('span');
    platformName.textContent = comment.platform.charAt(0).toUpperCase() + comment.platform.slice(1);

    // Logo de la plataforma
    const platformIcon = document.createElement('i');
    platformIcon.className = `fab fa-${comment.platform} ${comment.platform}-icon`;

    // Tiempo del ultimo mensaje enviado
    const fecha = new Date(comment.comments[comment.comments.length -1].time);
    // dias
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // getMonth() devuelve 0-11, así que sumamos 1
    const year = fecha.getFullYear().toString().slice(-2);
    // horas
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const ampm = horas >= 12 ? 'PM' : 'AM';

    horas = horas % 12;
    horas = horas ? horas : 12; // Si el resultado de % 12 es 0, significa que son las 12

    // Aseguramos que el día, mes y minutos tengan dos dígitos (ej: 01, 05)
    const diaFormateado = dia < 10 ? '0' + dia : dia;
    const mesFormateado = mes < 10 ? '0' + mes : mes;
    const minutosFormateados = minutos < 10 ? '0' + minutos : minutos;
    const tiempoFormateado = `${diaFormateado}/${mesFormateado}/${year} - ${horas}:${minutosFormateados} ${ampm}`;
    // Creamos span de tiempo 
    const messageTime = document.createElement('span');
    messageTime.className = 'contact-message-time';
    messageTime.textContent = tiempoFormateado;

    // commentHeader <--- logo de C y nonbre del user
    commentHeader.appendChild(typeIdentifier);
    commentHeader.appendChild(commentName);

    // platform container <--- nombre de la plataforma e icono
    platform.appendChild(platformName);
    platform.appendChild(platformIcon);

    // Detalles <--- preview del post, plataforma, tiempo del ultimo mensaje enviado
    commentDetails.appendChild(platform);
    commentDetails.appendChild(messageTime);

    // Informacion del comentario <--- header, detalles, info (todos contenedores)
    commentInfo.appendChild(preView);
    commentInfo.appendChild(commentHeader);
    commentInfo.appendChild(commentDetails)
    commentElement.appendChild(commentInfo);

    return commentElement; // Retornamos el comment
}


// Actualizar la lista de items
export function updateItemsList(items, currentFilter) {
    if (!items) return;
    const itemsList = document.querySelector('.contacts-list');
    itemsList.innerHTML = ''; // limpiamos

    // Create contact or comment card defined by the currentFilter
    if (currentFilter === 'contacts') {
        items.forEach(item => {
            const itemElement = createContactCard(item); // Creamos contacto
            itemsList.appendChild(itemElement);
        })
    } else {
        items.forEach(item => {
            const itemElement = createCommentCard(item); // Creamos comentario
            itemsList.appendChild(itemElement);
        })
    }

    // Verifica si hay items activos
    const currentItem = items.find(item => item.id === currentItemId);
    // Si no hay items visibles, mostrar mensaje
    if (!currentItem && items.length === 0){
        document.querySelector('.chat-title').textContent = 'Selecciona un contacto o comentario';
        messagesContainer.innerHTML = '';
        document.querySelector('.bot-toggle').style.display = 'none';
        openItem(null);
    }
}

/**
 * Ajusta la altura del textarea para que crezca con el contenido.
 */
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    let scrollHeight = messageInput.scrollHeight;
    messageInput.style.height = scrollHeight + 'px';
}

document.addEventListener('DOMContentLoaded', () => {
    // When loading mobile screens, show contacts list by default
    const isMobileScreen = window.matchMedia('(max-width: 768px)').matches;
    if (isMobileScreen) {
        document.querySelector('#contacts-container').classList.add('show');
    }

    // event listener for the contact or comment list
    document.querySelector('.contacts-list').addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-item-btn');
        if (deleteButton) {
            const itemId = deleteButton.dataset.itemId;
            const itemName = deleteButton.dataset.itemName;
            showDeleteConfirmation(itemId, itemName);
            event.stopPropagation();
            return;
        }

        const itemOptions = event.target.closest('.item-options-menu');
        if (itemOptions) {
            const popup = itemOptions.querySelector('.options-popup');
            if (popup.style.display === 'block') {
                hideAllOptionsPopOuts();
            } else {
                hideAllOptionsPopOuts();
                popup.style.display = 'block';
            }
            event.stopPropagation();
            return;
        }

        const clicked = event.target.closest('.contact');
        if (!clicked) return;

        // Remover la clase active del elemento que la tenía previamente
        const previouslyActive = document.querySelector('.contact.active');
        if (previouslyActive) previouslyActive.classList.remove('active');

        // Activar el elemento clicked, ya sea comentario o contacto
        clicked.classList.add('active');
        openItem(clicked.dataset.itemId);

        // Actualizar el título del chat con el nombre del contacto/comentario
        const contactName = clicked.querySelector('.contact-name').textContent;
        document.querySelector('.chat-title').textContent = contactName;

        // ocultamos la item list, al darle click al item, en caso que estemos en vista de telefono
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        if (mediaQuery.matches) {
            document.querySelector('#contacts-container').classList.toggle('show');
        }

        //actualizar el bot toggle
        initilizeBotToggle();
    });

    function hideAllOptionsPopOuts() {
        document.querySelectorAll('.options-popup').forEach(popup => {
            popup.style.display = 'none';
        });
    }
    // Hide popup when clicking outside
    document.addEventListener('click', (event) => {
        document.querySelectorAll('.options-popup').forEach(popup => {
            if (!popup.contains(event.target)) {
                popup.style.display = 'none';
            }
        });
    });

    // Toggle tag filters on mobile
    const toggleTagFiltersBtn = document.querySelector('.toggle-tag-filters-btn');
    const tagFilters = document.querySelector('.tag-filters');

    toggleTagFiltersBtn.addEventListener('click', () => {
        tagFilters.classList.toggle('show');
        if (tagFilters.classList.contains('show')) {
            toggleTagFiltersBtn.textContent = 'Ocultar filtros de etiquetas';
        } else {
            toggleTagFiltersBtn.textContent = 'Mostrar filtros de etiquetas';
        }
    });


    // functionality show / hide contacts in mobile
    document.querySelector('.toggle-contacts').addEventListener('click', function() {
        document.querySelector('#contacts-container').classList.toggle('show');
    });


    // Handle the platform filters
    document.querySelectorAll('.platform-toggle').forEach(toggle => {
        toggle.addEventListener('change', filterItems);
    });

    const unreadFilterBtn = document.querySelector('.unread-filter-btn');
    unreadFilterBtn.addEventListener('click', () => {
        unreadFilterBtn.classList.toggle('unread');
        filterItems();
    });

    // Manejar el filtro de tipo (chat / comentario)
    const chatButton = document.querySelector('.item-chat');
    const commentButton = document.querySelector('.item-comment');
    const tagBtnsContainer = document.querySelector('.tag-btn-container');
    const whatsAppToggle = document.getElementById('whatsapp-toggle');
    const linkTag = document.querySelector('.post-link');

    // Función para actualizar el estado de los botones
    function updateFilterButtons() {
        chatButton.classList.toggle('active', currentFilter === 'contacts');
        commentButton.classList.toggle('active', currentFilter === 'comments');
        tagFilters.classList.toggle('hidden', currentFilter === 'comments');
        
        // Hide/show attach button based on filter
        if (currentFilter === 'comments') {
            messageInputContainer.classList.add('hide-attach');
            // Clear any staged images if switching to comments view
            stagedImageFiles = [];
            renderImagePreviews();
        } else {
            messageInputContainer.classList.remove('hide-attach');
        }
    }

    updateFilterButtons();
    // Event listeners para los botones de filtro
    chatButton.addEventListener('click', () => {
        if (currentFilter !== 'contacts') {
            setCurrentFilter('contacts');
            tagBtnsContainer.classList.toggle('active');
            whatsAppToggle.classList.toggle('active');
            linkTag.classList.toggle('active');
            updateFilterButtons();
            filterItems();
        }
    });
    commentButton.addEventListener('click', () => {
        if (currentFilter !== 'comments') {
            setCurrentFilter('comments');
            tagBtnsContainer.classList.toggle('active');
            whatsAppToggle.classList.toggle('active');
            linkTag.classList.toggle('active');
            updateFilterButtons();
            filterItems();
        }
    });

    document.querySelectorAll('.tag-toggle').forEach(toggle => {
        toggle.addEventListener('change', filterItems);
    });



    // --- Sending Logic ---

    /**
     * Envía un mensaje de texto.
     * @param {string} messageText El texto a enviar.
     */
    function sendTextMessage(messageText) {
        if (!messageText) return;

        const recipientPlatform = items[currentFilter].list.find(item => item.id === currentItemId)?.platform;
        if (!recipientPlatform) {
            console.error("No se pudo determinar la plataforma del destinatario para enviar el texto.");
            return;
        }
        
        const messageTime = Date.now();
        // Envía el mensaje de texto al backend.
        sendManMessage(currentItemId, "text", messageText, currentFilter, recipientPlatform);

        // Crea el mensaje en la UI local.
        createMessage(messageText, messageTime, 'bot', 'text');
        
        // Añade la entrada al estado local.
        const entry = { content: messageText, time: messageTime, type: "text", self: true };
        const currentItem = items[currentFilter].list.find(item => item.id === currentItemId);
        if (currentItem) {
            const entryKey = (currentFilter === "contacts") ? "messages" : "comments";
            currentItem[entryKey].push(entry);
        }

        scrollToBottom();
        filterItems();
    }

    /**
     * Orquesta el envío de texto y/o imágenes.
     * Se activa al pulsar el botón de enviar o presionar Enter.
     */
    function handleSendMessage() {
        const messageText = messageInput.value.trim();
        const imagesToSend = [...stagedImageFiles]; // Se crea una copia para evitar problemas de concurrencia.

        // No hacer nada si no hay ni texto ni imágenes.
        if (messageText === '' && imagesToSend.length === 0) {
            return;
        }

        // Limpiar el estado y la UI inmediatamente para una respuesta visual rápida.
        stagedImageFiles = [];
        renderImagePreviews();
        messageInput.value = '';
        autoResizeTextarea();

        // 1. Enviar el mensaje de texto PRIMERO, si existe.
        if (messageText) {
            sendTextMessage(messageText);
        }

        // 2. Enviar todas las imágenes en un bucle.
        imagesToSend.forEach(fileData => {
            sendDebugMessage("Sending image with ID: " + fileData.id);
            sendProcessedImage(fileData.blob);
        });
    }

    // Se asocia la nueva función de envío al botón.
    sendButton.addEventListener('click', handleSendMessage);

    const isMobile = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            if (!isMobile()) {
                e.preventDefault();
                handleSendMessage();
            }
        }
    });
    // Se asocia la nueva función de envío a la tecla Enter.
    messageInput.addEventListener('input', autoResizeTextarea);

    // --- Image Attachment and Interaction Logic ---
    attachButton.addEventListener('click', (e) => {
        e.preventDefault();
        imageFileInput.removeAttribute('capture'); // Se asegura de que abra el explorador de archivos.
        imageFileInput.click();
    });

    // Listener principal para cuando se seleccionan archivos.
    imageFileInput.addEventListener('change', (event) => {
        // Llama a la función que maneja y procesa los archivos seleccionados.
        handleAndStageFiles(event.target.files);
        // Se limpia el valor del input para permitir seleccionar los mismos archivos de nuevo si es necesario.
        event.target.value = '';
    });

    // Listener para eliminar imágenes desde la cuadrícula de previsualización.
    // Se usa delegación de eventos para eficiencia.
    document.getElementById('staged-images-grid').addEventListener('click', (event) => {
        // Se busca si el clic fue en un botón de eliminar.
        const removeBtn = event.target.closest('.image-preview-remove-btn');
        if (removeBtn) {
            const parentPreview = removeBtn.parentElement;
            const fileIdToRemove = parentPreview.dataset.id;
            
            // Se filtra el array, eliminando el archivo con el ID correspondiente.
            stagedImageFiles = stagedImageFiles.filter(file => file.id !== fileIdToRemove);
            // Se vuelve a renderizar la UI para reflejar el cambio.
            renderImagePreviews();
        }
    });

    // Se actualiza el listener de dragover.
    messageInputContainer.addEventListener('dragover', (event) => {
        event.preventDefault();
        if (currentFilter === 'contacts') {
            messageInputContainer.classList.add('drag-over');
        }
    });

    messageInputContainer.addEventListener('dragleave', (event) => {
        event.preventDefault();
        messageInputContainer.classList.remove('drag-over');
    });

    // Se actualiza el listener de drop para manejar múltiples archivos.
    messageInputContainer.addEventListener('drop', (event) => {
        event.preventDefault();
        messageInputContainer.classList.remove('drag-over');
        if (currentFilter === 'contacts') {
            handleAndStageFiles(event.dataTransfer.files);
        }
    });

    // Se actualiza el listener de paste para manejar múltiples archivos.
    messageInput.addEventListener('paste', (event) => {
        if (currentFilter === 'contacts') {
            // Se extraen los archivos de imagen del portapapeles.
            const files = Array.from(event.clipboardData?.items || [])
                .filter(item => item.kind === 'file' && item.type.startsWith('image/'))
                .map(item => item.getAsFile());
            
            if (files.length > 0) {
                event.preventDefault(); // Prevenir que se pegue la ruta del archivo como texto.
                handleAndStageFiles(files);
            }
        }
    });


    // --- MODALES Y BOTONES ---
    const $ = (se)=> document.querySelector(se)
    const botConfigButton = $('.bot-config-button'); // Boton de configuracion
    const openQuickRepliesConfig = $('#openQuickRepliesConfig'); // btn abrir qr modal

    // Bot Modal
    const botConfigModal = $('.bot-config-modal'); // Modal de configuracion del bot
    const closeModalButton = $('.close-modal'); // Cerrar modal del bot
    const cancelModalButtton = $('.cancel-button'); // Btn cancelar modificacion del bot
    const saveChangesBtn = $('.save-button'); // btn to save and update bot configuration
    const botTextArea = Array.from(document.querySelectorAll('.bot-textarea')); // Text areas values

    // QRs
    const quickRepliesModal = $('#quickRepliesModal'); // QR modal
    const closeQuickReplies = $('#closeQuickReplies'); // Cerrar QR modal 
    const openCreateQuickReply = $('#openCreateQuickReply'); // Abrir modal crear nueva reply
    // Modal crear nueva reply
    const createQuickReplyModal = $('#createQuickReplyModal'); // Modal de crear nueva QR
    const cancelCreateQuickReply = $('#cancelCreateQuickReply'); // Cancelar nueva QR
    const createReplyBtn = $('.save-create-quick-reply') // Crear nueva QR
    const quickRepliesContainer = $('.quick-replies-list');    // Quick reply items containers
    const newQrTextArea = $('.quick-reply-textarea');


    // --------- MODAL DEL BOT ----------
    function botModalConfiguration() {
        // Abrir modal de configuración del bot
        botConfigButton.addEventListener('click', async () => {
            botTextArea[0].value = 'Cargando...'; // cleaning the bot text area value
            botTextArea[1].value = 'Cargando...'; // cleaning the json table text area value
            botTextArea[2].value = 'Cargando...';
            botConfigModal.classList.add('show');
            await getCustomPrompt(); // Get the bot configuration
            botTextArea[0].value = botPrompts.prompt; // Set the bot configuration to the text area
            botTextArea[1].value = botPrompts.dataTable; // Set the bot configuration to the text area
            botTextArea[2].value = botPrompts.commentsPrompt; // Set the bot configuration to the text area
            const tokenUsageLabel = document.querySelector('.token-usage p');
            if (tokenUsageLabel) {
                tokenUsageLabel.textContent = `Uso total de tokens: ${tokenUsage}`;
            }
        });

        // Cerrar modal de configuración del bot
        closeModalButton.addEventListener('click', () => {
            botConfigModal.classList.remove('show');
        });
        cancelModalButtton.addEventListener('click', () => {
            botConfigModal.classList.remove('show');
        });
        botConfigModal.addEventListener('click', (e) => {
            if (e.target === botConfigModal) {
                botConfigModal.classList.remove('show');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && botConfigModal.classList.contains('show')) {
                botConfigModal.classList.remove('show');
            }
        });
        // update bot configuration
        saveChangesBtn.addEventListener('click', () => {
            const botPrompt = botTextArea[0].value.trim();
            const dataTable = botTextArea[1].value.trim();
            const commentsPrompt = botTextArea[2].value.trim();

            if (botPrompt && dataTable && commentsPrompt) {
                // Validacion de si dataTable es JSON o no
                try {
                    JSON.parse(dataTable);
                } catch (e) {
                    alert('Texto formato JSON inválido, por favor ingreselo nuevamente')
                    console.error('dataTable, no es un JSON valido');
                    return;
                }
                // enviamos la info del bot
                sendBotConf(botPrompt, dataTable, commentsPrompt);
                // Ocultamos el modal
                botConfigModal.classList.remove('show');
                console.log('sent to back: ', botTextArea[0].value.trim(), botTextArea[1].value.trim(), botTextArea[2].value.trim())
            } else {
                alert('No enviar contenido vacío, inténtelo nuevamente');
            }
        })
    }
    


    // ----- QR FUNCTIONS -----

    // --- Functions to handle QR image staging ---

    /**
     * Renderiza las miniaturas de las imágenes preparadas para respuestas rápidas.
     */
    function renderQuickReplyImagePreviews() {
        qrStagedImagesGrid.innerHTML = ''; // Clear old previews
        if (stagedQuickReplyImages.length > 0) {
            qrStagedImagesGrid.style.display = 'flex';
        } else {
            qrStagedImagesGrid.style.display = 'none';
        }

        stagedQuickReplyImages.forEach(fileData => {
            const previewElement = document.createElement('div');
            previewElement.className = 'image-preview-thumbnail';
            previewElement.dataset.id = fileData.id;

            const img = document.createElement('img');
            img.src = URL.createObjectURL(fileData.blob);
            img.onload = () => URL.revokeObjectURL(img.src);

            const removeBtn = document.createElement('button');
            removeBtn.className = 'image-preview-remove-btn';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            
            previewElement.appendChild(img);
            previewElement.appendChild(removeBtn);
            qrStagedImagesGrid.appendChild(previewElement);
        });
    }

    /**
     * Maneja y procesa los archivos seleccionados para respuestas rápidas.
     * @param {FileList} files Los archivos seleccionados.
     */
    function handleAndStageQRFiles(files) {
        const filesToProcess = Array.from(files);
        if (stagedQuickReplyImages.length + filesToProcess.length > MAX_IMAGES) {
            alert(`No se pueden subir más de ${MAX_IMAGES} imágenes a la vez.`);
            return;
        }

        const processingPromises = filesToProcess.map(file => {
            return resizeAndCompressImage(file).then(blob => ({
                id: `staged-qr-${Date.now()}-${Math.random()}`,
                blob: blob
            })).catch(error => {
                console.error('Error procesando un archivo para QR, se omitirá:', file.name, error);
                return null;
            });
        });

        Promise.all(processingPromises).then(processedFiles => {
            const successfulFiles = processedFiles.filter(f => f !== null);
            stagedQuickReplyImages.push(...successfulFiles);
            renderQuickReplyImagePreviews();
        });
    }

    // --- QR creation and usage logic ---
    /**
     * Refresca la lista de respuestas rápidas en la UI abriéndolas de nuevo una por una.
     */
    function refreshQuickRepliesList() {
        const quickRepliesContainer = document.querySelector('.quick-replies-list');
        quickRepliesContainer.innerHTML = '';
        quickReps.forEach(reply => {
            const replyObject = typeof reply === 'string' 
                ? { id: `temp-compat-${Math.random()}`, text: reply, images: [] } 
                : reply;
            createQuickReply(replyObject);
        });
    }

    /** Añade las respuestas rápidas individualmente a la UI.
     * Además, añade los event listeners apropiados para manejar la edición, eliminación y el envío de la respuesta rápida cuando se hace clic en ella.
     * @param {Object} reply Un objeto que representa la respuesta rápida, con propiedades id, text e images.
     */
    function createQuickReply(reply) { // reply is now an object { id, text, images }
        const newReply = document.createElement('div');
        newReply.classList.add('quick-reply-item');
        newReply.dataset.id = reply.id; // Store the unique ID

        // --- Main Content Wrapper (Left Column) ---
        const mainContentWrapper = document.createElement('div');
        mainContentWrapper.className = 'quick-reply-main-content';

        // Only create and append the text element if text exists
        if (reply.text) {
            const replyText = document.createElement('p');
            replyText.classList.add('quick-reply-text');
            replyText.textContent = reply.text;
            mainContentWrapper.appendChild(replyText);
        }

        // --- Images Container (inside Left Column) ---
        if (reply.images && reply.images.length > 0) {
            const imagesContainer = document.createElement('div');
            imagesContainer.className = 'quick-reply-item-images';
            reply.images.forEach(imgUrl => {
                const imgThumb = document.createElement('img');
                imgThumb.className = 'quick-reply-item-thumbnail';
                imgThumb.src = imgUrl;
                imgThumb.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent the main item click
                    openLightbox(imgUrl);
                });
                imagesContainer.appendChild(imgThumb);
            });
            mainContentWrapper.appendChild(imagesContainer);
        }

        // --- Action Icons (Right Column) ---
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'quick-reply-actions';

        const editIcon = document.createElement('i');
        editIcon.classList.add('fas', 'fa-edit');
        editIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            setupEditModal(reply);
        });

        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fas', 'fa-trash');
        trashIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the item click event from firing
            newReply.remove();
            const index = quickReps.findIndex(item => item.id === reply.id);
            if (index !== -1) quickReps.splice(index, 1);
            updateQuickReps(quickReps);
        });

        actionsContainer.appendChild(editIcon);
        actionsContainer.appendChild(trashIcon);

        // Append left column and right column to the main item
        newReply.appendChild(mainContentWrapper);
        newReply.appendChild(actionsContainer);

        // Add click listener to the whole item
        newReply.addEventListener('click', (e) => {
            // Prevent sending if the click was on an icon
            if (e.target.classList.contains('fas')) return;

            const clickedId = e.currentTarget.dataset.id;
            const replyToSend = quickReps.find(r => r.id == clickedId);

            if (!replyToSend) return;


            // Sequentially send each image
            if (replyToSend.images && replyToSend.images.length > 0) {
                const recipientPlatform = items[currentFilter].list.find(item => item.id === currentItemId)?.platform;
                if (!recipientPlatform) {
                    console.error("No se pudo determinar la plataforma del destinatario.");
                    return;
                }
                for (const imageUrl of replyToSend.images) {
                    const messageTime = Date.now();
                    // 1. Send to backend
                    sendManMessage(currentItemId, "image", imageUrl, currentFilter, recipientPlatform);
                    
                    // 2. Display locally
                    createMessage(imageUrl, messageTime, 'bot', 'image');

                    // 3. Save to local state for consistency
                    const entry = { content: imageUrl, time: messageTime, type: "image", self: true };
                    const currentItem = items[currentFilter].list.find(item => item.id === currentItemId);
                    if (currentItem) {
                        const entryKey = (currentFilter === "contacts") ? "messages" : "comments";
                        currentItem[entryKey].push(entry);
                    }
                }
            }
            // Send text if it exists
            if (replyToSend.text) {
                sendTextMessage(replyToSend.text);
            }

            
            quickRepliesModal.classList.remove('show');
        });

        quickRepliesContainer.appendChild(newReply);
    }

    /** 
     * Configura el modal para crear una nueva respuesta rápida.
     * Limpia los campos y prepara el modal para la creación.
     * Es preparatorio para la función createReplyModal.
     */
    function setupCreateModal() {
        const createQuickReplyModal = document.getElementById('createQuickReplyModal');
        const createReplyBtn = document.querySelector('.save-create-quick-reply');
        const newQrTextArea = document.querySelector('.quick-reply-textarea');

        delete createQuickReplyModal.dataset.editingId;
        createQuickReplyModal.querySelector('h3').textContent = 'Nueva respuesta rápida';
        createReplyBtn.textContent = 'Crear';
        
        newQrTextArea.value = '';
        stagedQuickReplyImages = [];
        renderQuickReplyImagePreviews();
        createQuickReplyModal.classList.add('show');
    }

    /**
     * Configura el modal para editar una respuesta rápida existente.
     * Rellena los campos con los datos actuales de la respuesta rápida.
     * @param {Object} reply El objeto de respuesta rápida a editar.
     * Es preparatorio para la función createReplyModal.
     */
    async function setupEditModal(reply) {
        const createQuickReplyModal = document.getElementById('createQuickReplyModal');
        const createReplyBtn = document.querySelector('.save-create-quick-reply');
        const newQrTextArea = document.querySelector('.quick-reply-textarea');

        createQuickReplyModal.dataset.editingId = reply.id;
        createQuickReplyModal.querySelector('h3').textContent = 'Modificar respuesta rápida';
        createReplyBtn.textContent = 'Guardar';

        newQrTextArea.value = reply.text || '';
        
        stagedQuickReplyImages = [];
        if (reply.images && reply.images.length > 0) {
            const imagePromises = reply.images.map(url => 
                fetch(url)
                    .then(res => res.blob())
                    .then(blob => ({
                        id: `staged-qr-${Date.now()}-${Math.random()}`,
                        blob: blob
                    }))
            );
            stagedQuickReplyImages = await Promise.all(imagePromises);
        }
        
        renderQuickReplyImagePreviews();
        createQuickReplyModal.classList.add('show');
    }

    /**
     * Configura el menú para poder crear o editar respuestas rápidas.
     * Incluye validaciones, conversión de imágenes a base64 y actualización del estado local.
     * También gestiona la apertura y cierre del modal, así como la interacción con los elementos de la interfaz.
     */
    function createReplyModal() {
        const createQuickReplyModal = document.getElementById('createQuickReplyModal');
        const openCreateQuickReply = document.getElementById('openCreateQuickReply');
        const cancelCreateQuickReply = document.getElementById('cancelCreateQuickReply');
        const createReplyBtn = document.querySelector('.save-create-quick-reply');
        const newQrTextArea = document.querySelector('.quick-reply-textarea');

        openCreateQuickReply.addEventListener('click', setupCreateModal);

        cancelCreateQuickReply.addEventListener('click', () => {
            createQuickReplyModal.classList.remove('show');
        });

        createReplyBtn.addEventListener('click', async () => {
            const textContent = newQrTextArea.value.trim();
            if (!textContent && stagedQuickReplyImages.length === 0) {
                alert("La respuesta rápida no puede estar vacía.");
                return;
            }

            const base64Promises = stagedQuickReplyImages.map(fileData => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(fileData.blob);
                });
            });
            const base64Images = await Promise.all(base64Promises);

            const editingId = createQuickReplyModal.dataset.editingId;

            if (editingId) { // --- EDIT MODE ---
                const replyToUpdate = quickReps.find(r => r.id == editingId);
                if (replyToUpdate) {
                    replyToUpdate.text = textContent;
                    replyToUpdate.images = base64Images;
                }
            } else { // --- CREATE MODE ---
                const newReplyObject = {
                    id: `temp-${Date.now()}`,
                    text: textContent,
                    images: base64Images
                };
                quickReps.push(newReplyObject);
            }

            updateQuickReps(quickReps);
            refreshQuickRepliesList();
            createQuickReplyModal.classList.remove('show');
        });

        createQuickReplyModal.addEventListener('click', (e) => {
            if (e.target === createQuickReplyModal) {
                createQuickReplyModal.classList.remove('show');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && createQuickReplyModal.classList.contains('show')) {
                createQuickReplyModal.classList.remove('show');
            }
        });

        // --- Event listeners for QR image attachment ---
        qrAttachButton.addEventListener('click', (e) => {
            e.preventDefault();
            qrImageFileInput.click();
        });

        qrImageFileInput.addEventListener('change', (event) => {
            handleAndStageQRFiles(event.target.files);
            event.target.value = ''; // Allow selecting the same file again
        });

        qrStagedImagesGrid.addEventListener('click', (event) => {
            const removeBtn = event.target.closest('.image-preview-remove-btn');
            if (removeBtn) {
                const parentPreview = removeBtn.parentElement;
                const fileIdToRemove = parentPreview.dataset.id;
                stagedQuickReplyImages = stagedQuickReplyImages.filter(file => file.id !== fileIdToRemove);
                renderQuickReplyImagePreviews();
            }
        });
    }

    /**
     * Configura el modal entero de respuestas rápidas para poder abrir y cerrar, junto con todo lo demás necesario.
     */
    function repliesModalConfiguration() {
        const quickRepliesModal = document.getElementById('quickRepliesModal');
        const openQuickRepliesConfig = document.getElementById('openQuickRepliesConfig');
        const closeQuickReplies = document.getElementById('closeQuickReplies');

        openQuickRepliesConfig.addEventListener('click', () => {
            quickRepliesModal.classList.add('show');
            refreshQuickRepliesList();
        });

        closeQuickReplies.addEventListener('click', () => {
            quickRepliesModal.classList.remove('show');
        });
        quickRepliesModal.addEventListener('click', (e) => {
            if (e.target === quickRepliesModal) {
                quickRepliesModal.classList.remove('show');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && quickRepliesModal.classList.contains('show')) {
                quickRepliesModal.classList.remove('show');
            }
        });

        getQuickReps();
    }

    botModalConfiguration();
    repliesModalConfiguration();
    createReplyModal();

    // Listen for the custom event dispatched when quick replies are updated from the server
    document.addEventListener('quickRepsUpdated', () => {
        const quickRepliesModal = document.getElementById('quickRepliesModal');
        // If the modal is currently open, refresh the list to show the changes immediately.
        if (quickRepliesModal && quickRepliesModal.classList.contains('show')) {
            refreshQuickRepliesList();
        }
    });


    // --------------- Delete confirmation modal logic ----------------
    const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const deleteConfirmationText = document.getElementById('deleteConfirmationText');
    let itemIdToDelete = null;

    function showDeleteConfirmation(itemId, itemName) {
        itemIdToDelete = itemId;
        deleteConfirmationText.textContent = `¿Seguro que quieres eliminar a ${itemName}?`;
        deleteConfirmationModal.classList.add('show');
    }

    function hideDeleteConfirmation() {
        deleteConfirmationModal.classList.remove('show');
    }

    confirmDeleteBtn.addEventListener('click', () => {
        if (itemIdToDelete) {
            // Eliminar el item del array local
            const itemIndex = items[currentFilter].list.findIndex(item => item.id === itemIdToDelete);
            if (itemIndex > -1) {
                items[currentFilter].list.splice(itemIndex, 1);
            }

            // Enviar la solicitud de eliminación al servidor
            deleteItem(itemIdToDelete, currentFilter);

            // Si el item eliminado era el que estaba abierto, limpiar la vista
            if (currentItemId === itemIdToDelete) {
                openItem(null);
            }

            // Actualizar la lista de items en la UI
            filterItems();
            
            hideDeleteConfirmation();
        }
    });

    cancelDeleteBtn.addEventListener('click', hideDeleteConfirmation);

    // --- Name-editing logic ---
    const editNameBtn = document.getElementById('edit-name-btn');
    const confirmNameBtn = document.getElementById('confirm-name-btn');
    const chatTitle = document.querySelector('.chat-title');
    const chatInfoContainer = document.querySelector('.chat-info-container');

    const toggleNameEditMode = (isEditing) => {
        const existingInput = chatInfoContainer.querySelector('.name-edit-input');

        if (isEditing) {
            // Don't do anything if we are already in edit mode
            if (existingInput) return;

            chatTitle.style.display = 'none';
            editNameBtn.style.display = 'none';

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'name-edit-input';
            input.value = chatTitle.textContent;
            
            // Insert input right after the h2 title
            chatTitle.after(input);
            input.focus();
            input.select();

            confirmNameBtn.style.display = 'inline-block';

            const confirmEdit = () => {
                const newName = input.value.trim();
                if (newName && newName !== chatTitle.textContent) {
                    handleNameUpdate(newName);
                    chatTitle.textContent = newName;
                }
                toggleNameEditMode(false);
            };

            const cancelEdit = () => {
                toggleNameEditMode(false);
            };

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    confirmEdit();
                } else if (e.key === 'Escape') {
                    cancelEdit();
                }
            });

            // Assign events to buttons
            confirmNameBtn.onclick = confirmEdit;
            // Add a listener to cancel if clicking outside
            setTimeout(() => {
                document.addEventListener('click', function onDocClick(e) {
                    if (!e.target.closest('.chat-info-container')) {
                        cancelEdit();
                        this.removeEventListener('click', onDocClick);
                    }
                });
            }, 0);

        } else {
            if (existingInput) {
                existingInput.remove();
            }
            chatTitle.style.display = 'block';
            confirmNameBtn.style.display = 'none';
            // Show edit button only if it's a contact
            if (currentFilter === 'contacts') {
                editNameBtn.style.display = 'inline-block';
            }
        }
    };

    editNameBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the document click listener from firing immediately
        toggleNameEditMode(true)
    });
})



//CAPTURE AND REPORT ERRORS
window.onerror = function (message, source, lineno, colno, error) {
    reportErrorToBackend({
        type: 'error',
        message,
        source,
        lineno,
        colno,
        stack: error?.stack
    });
};

// CAPTURE UNHANDLED PROMISE REJECTIONS
window.addEventListener('unhandledrejection', function (event) {
    reportErrorToBackend({
        type: 'unhandledrejection',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack
    });
});




// --- LÓGICA DEL VISOR DE IMÁGENES (LIGHTBOX) ---
const lightbox = document.getElementById('image-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');

// --- Variables para el gesto de deslizar ---
let touchStartY = 0;
let touchMoveY = 0;
let isDragging = false;
const dragThreshold = 80; // Distancia en píxeles para cerrar

function openLightbox(src) {
    document.body.classList.add('lightbox-open'); // Bloquear scroll
    lightboxImage.src = src;
    lightbox.style.display = 'flex';
    // Resetear estilos por si se quedó a medio cerrar
    lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    lightboxImage.style.transform = 'translateY(0px)';
    lightboxImage.style.transition = 'transform 0.3s ease'; // Asegurar que la transición esté al abrir
}

function closeLightbox() {
    document.body.classList.remove('lightbox-open'); // Desbloquear scroll
    lightbox.style.display = 'none';
    lightboxImage.src = '';
}

function handleTouchStart(event) {
    isDragging = true;
    touchStartY = event.touches[0].clientY;
    touchMoveY = touchStartY; // Inicializar moveY
    lightboxImage.style.transition = 'none'; // Quitar transición para un seguimiento directo
}

function handleTouchMove(event) {
    if (!isDragging) return;

    touchMoveY = event.touches[0].clientY;
    const deltaY = touchMoveY - touchStartY;

    // Mover la imagen verticalmente
    lightboxImage.style.transform = `translateY(${deltaY}px)`;
    
    // Hacer el fondo más transparente al deslizar (usando valor absoluto)
    const opacity = Math.max(0, 0.85 - (Math.abs(deltaY) / window.innerHeight) * 1.5);
    lightbox.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
}

function handleTouchEnd() {
    if (!isDragging) return;
    isDragging = false;
    
    const deltaY = touchMoveY - touchStartY;

    // Si se deslizó más allá del umbral (hacia arriba o abajo), cerrar. Si no, volver.
    if (Math.abs(deltaY) > dragThreshold) {
        closeLightbox();
    } else {
        // Volver a la posición original con animación
        lightboxImage.style.transition = 'transform 0.3s ease';
        lightboxImage.style.transform = 'translateY(0px)';
        lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    }
}


if (lightbox && lightboxImage && lightboxClose) {
    // Listeners para cerrar
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });

    // Listeners para el gesto táctil
    lightbox.addEventListener('touchstart', handleTouchStart);
    lightbox.addEventListener('touchmove', handleTouchMove);
    lightbox.addEventListener('touchend', handleTouchEnd);
}