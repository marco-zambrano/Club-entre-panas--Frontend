var items = {
    contacts: {
        allItemsLoaded: false,
        list: [
            {
                id: "a9f3c2d1e0b4",
                name: "John Smith",
                platform: "facebook",
                botEnabled: true,
                interest: 8,
                messages: [
                    { id: "m1a8d4c9b7f0", content: "salam aukjdfsajl", type: "audio", time: 123456000, self: false },
                    { id: "m4b7c2f1a3d9", content: "hello again", type: "text", time: 123456001, self: true }
                ]
            },
            {
                id: "e4c7a1b9f3d6",
                name: "John Doe",
                platform: "facebook",
                botEnabled: false,
                interest: 6,
                messages: [
                    { id: "m8e9a3b1f2d4", content: "example cnotent", time: 1234566777, self: false, type: "text" },
                    { id: "m0c2d5a7b3e1", content: "https://picsum.photos/300/200", type: "image", time: 1234567890, self: false },
                    { id: "m6b1f2e9a4d3", content: "ola si bolbiendo mireina", type: "text", time: 1234567890, self: false }
                ]
            },
            {
                id: "b1c4e8f9a2d7",
                name: "Alice Gomez",
                platform: "facebook",
                botEnabled: true,
                interest: 9,
                messages: [
                    { id: "m9a6b3c2f1e7", content: "hi alice", type: "text", time: 1666660000, self: true },
                    { id: "m4f8e1b9c3d2", content: "hello!", type: "text", time: 1666660001, self: false }
                ]
            },
            {
                id: "f2a3c9b1d6e0",
                name: "Mike Chan",
                platform: "instagram",
                botEnabled: false,
                interest: 4,
                messages: [
                    { id: "m3e2a9f6b0c1", content: "are you there?", type: "text", time: 1666662222, self: true },
                    { id: "m1c7b3e8a4f0", content: "yes I am", type: "text", time: 1666662230, self: false },
                    { id: "m2a0f9b6e1c5", content: "cool", type: "text", time: 1666662240, self: true }
                ]
            },
            {
                id: "d5f0a2c3e9b1",
                name: "Laura Fernández",
                platform: "facebook",
                botEnabled: true,
                interest: 7,
                messages: [
                    { id: "m8c3f1e0b7a2", content: "buenos días", type: "text", time: 1666663000, self: false },
                    { id: "m2b5e1f9a4c3", content: "¿cómo estás?", type: "text", time: 1666663010, self: false }
                ]
            },
            {
                id: "a7d9c0e1b3f4",
                name: "Carlos López",
                platform: "facebook",
                botEnabled: false,
                interest: 5,
                messages: [
                    { id: "m1f0a9c3e2b6", content: "me interesa mucho", type: "text", time: 1666664000, self: false }
                ]
            },
            {
                id: "e8f3a6c1b0d2",
                name: "Diana Salas",
                platform: "instagram",
                botEnabled: true,
                interest: 6,
                messages: [
                    { id: "m5e9a0f3c2b7", content: "¿está disponible aún?", type: "text", time: 1666665000, self: false },
                    { id: "m9b1f3a6c0e2", content: "sí, claro", type: "text", time: 1666665010, self: true }
                ]
            },
            {
                id: "b6f0e9c3a2d1",
                name: "Jorge Ramírez",
                platform: "facebook",
                botEnabled: false,
                interest: 2,
                messages: [
                    { id: "m3c9f1a0e2b4", content: "necesito más info", type: "text", time: 1666666000, self: false }
                ]
            },
            {
                id: "c9e2b0a1f3d6",
                name: "Andrea Méndez",
                platform: "facebook",
                botEnabled: true,
                interest: 8,
                messages: [
                    { id: "m0f1e3a9b6c4", content: "buenas noches", type: "text", time: 1666667000, self: false },
                    { id: "m0f1e3a9b423", content: "https://picsum.photos/400/300", type: "image", time: 1666667000, self: false },
                    { id: "m5a7c3f0e1b2", content: "igualmente", type: "text", time: 1666667010, self: true }
                ]
            },
            {
                id: "f1b3d0a2c9e7",
                name: "Luis Torres",
                platform: "instagram",
                botEnabled: false,
                interest: 3,
                messages: [
                    { id: "m6b2f3e1a0c7", content: "me puedes llamar?", type: "text", time: 1666668000, self: false }
                ]
            },
            {
                id: "a6c4b1e0f3d9",
                name: "Paula Rivera",
                platform: "facebook",
                botEnabled: true,
                interest: 7,
                messages: [
                    { id: "m1c9a3f2e0b7", content: "te mandé mensaje", type: "text", time: 1666669000, self: false },
                    { id: "m1c9a3san230", content: "https://picsum.photos/500/400", type: "image", time: 1666669000, self: false },
                    { id: "m4f1e2b3c7a9", content: "lo vi, gracias", type: "text", time: 1666669010, self: true }
                ]
            },
            {
                id: "d3b0f1a6e9c2",
                name: "Emilio Narváez",
                platform: "facebook",
                botEnabled: false,
                interest: 4,
                messages: [
                    { id: "m2a1c0f3e9b5", content: "listo para la reunión", type: "audio", time: 1666670000, self: false },
                    { id: "m6f3e1b2a9c0", content: "perfecto", type: "text", time: 1666670010, self: true },
                    { id: "fmdasj8s9293", content: "mock", type: "text", time: 1666671111, self: false },
                    { id: "fdsa89439530", content: "mocko", type: "text", time: 1666672222, self: true },
                    { id: "m8g9h1j2k3l4", content: "¿Llegarás a tiempo?", type: "text", time: 1666673333, self: false },
                    { id: "m1a2b3c4d5e6", content: "Sí, ya voy en camino", type: "text", time: 1666673340, self: true },
                    { id: "m7n8o9p0q1r2", content: "Genial, nos vemos pronto", type: "text", time: 1666673350, self: false },
                    { id: "m3s4t5u6v7w8", content: "Perfecto, gracias", type: "text", time: 1666673360, self: true }
                ]
            },
            {
                id: "c7f9e1b0a3d2",
                name: "María José",
                platform: "instagram",
                botEnabled: true,
                interest: 6,
                messages: [
                    { id: "m0e3f1a2c6b9", content: "me interesa el producto", type: "text", time: 1666671000, self: false }
                ]
            },
            {
                id: "f0e2c3a1b9d8",
                name: "Ramón Castillo",
                platform: "facebook",
                botEnabled: false,
                interest: 5,
                messages: [
                    { id: "m7a2c0e1f3b6", content: "gracias por responder", type: "audio", time: 1666672000, self: false },
                    { id: "m3b9f1e2a0c8", content: "a la orden", type: "text", time: 1666672010, self: true }
                ]
            },
            {
                id: "b8f2d3e1a0c6",
                name: "Fernanda Díaz",
                platform: "facebook",
                botEnabled: true,
                interest: 9,
                messages: [
                    { id: "m1e9a3f0b7c2", content: "hay descuento?", type: "text", time: 1666673000, self: false },
                    { id: "m4c0f1e2b6a3", content: "sí, del 10%", type: "text", time: 1666673010, self: true }
                ]
            },
            {
                id: "e1c0a9f2b3d7",
                name: "Sebastián León",
                platform: "instagram",
                botEnabled: false,
                interest: 4,
                messages: [
                    { id: "m3f9e1a0b2c6", content: "cuándo llega el pedido?", type: "audio", time: 1666674000, self: false }
                ]
            },
            {
                id: "a0e1b2c3f9d6",
                name: "Natalia Bravo",
                platform: "facebook",
                botEnabled: true,
                interest: 6,
                messages: [
                    { id: "m9c2b1f0e3a7", content: "recibí el producto", type: "text", time: 1666675000, self: false },
                    { id: "m2f0e3a6b1c9", content: "¡qué bueno!", type: "text", time: 1666675010, self: true }
                ]
            },
            {
                id: "1b3a7c9d2e0f",
                name: "Sofía Vargas",
                platform: "messenger",
                botEnabled: true,
                interest: 8,
                messages: [
                    { id: "m7d9e2c1b0a3", content: "hola, estoy interesada en el servicio", type: "text", time: 1666676000, self: false },
                    { id: "m0a3b7c2e9f1", content: "¡Hola! ¿En qué puedo ayudarte?", type: "text", time: 1666676010, self: true }
                ]
            },
            {
                id: "9f2e0a1c3b7d",
                name: "Javier Ponce",
                platform: "instagram",
                botEnabled: false,
                interest: 5,
                messages: [
                    { id: "m2c9f0a3e1b7", content: "tienes stock?", type: "text", time: 1666677000, self: false }
                ]
            },
            {
                id: "c6a1f3e0b9d2",
                name: "Isabela Castro",
                platform: "facebook",
                botEnabled: true,
                interest: 9,
                messages: [
                    { id: "m8b0d2e1f9a3", content: "gracias por la información", type: "text", time: 1666678000, self: false },
                    { id: "m1a9f3e0c2b8", content: "de nada!", type: "text", time: 1666678010, self: true }
                ]
            },
            {
                id: "3d9e1b7f0a2c",
                name: "Martín Rueda",
                platform: "whatsapp",
                botEnabled: false,
                interest: 3,
                messages: [
                    { id: "m5f0a2c9e1b3", content: "ok, entendido", type: "text", time: 1666679000, self: false }
                ]
            },
            {
                id: "e0b7d2a9f1c3",
                name: "Valeria Guzmán",
                platform: "facebook",
                botEnabled: true,
                interest: 7,
                messages: [
                    { id: "m9a1c3f0e2b7", content: "cuando envías?", type: "text", time: 1666680000, self: false },
                    { id: "m4e2b0a1f9c3", content: "mañana mismo", type: "text", time: 1666680010, self: true }
                ]
            },
            {
                id: "b2c6f0a1d9e3",
                name: "Andrés Vargas",
                platform: "instagram",
                botEnabled: false,
                interest: 6,
                messages: [
                    { id: "m1f9e3a0c2b6", content: "¿cómo hago el pago?", type: "text", time: 1666681000, self: false }
                ]
            },
            {
                id: "f3a9c2e1b0d7",
                name: "Carolina Paz",
                platform: "messenger",
                botEnabled: true,
                interest: 8,
                messages: [
                    { id: "m7c0b1f9e2a3", content: "me confirmas la dirección?", type: "text", time: 1666682000, self: false },
                    { id: "m0e2a9f3c1b7", content: "claro, es...", type: "text", time: 1666682010, self: true }
                ]
            },
            {
                id: "a1d7e0c9b3f2",
                name: "Diego Rojas",
                platform: "facebook",
                botEnabled: false,
                interest: 4,
                messages: [
                    { id: "m3b6f1e0a9c2", content: "gracias por tu tiempo", type: "text", time: 1666683000, self: false }
                ]
            },
            {
                id: "d8b3f2a1c0e9",
                name: "Elena Flores",
                platform: "whatsapp",
                botEnabled: true,
                interest: 9,
                messages: [
                    { id: "m6c9a0f3e1b2", content: "excelente servicio!", type: "text", time: 1666684000, self: false },
                    { id: "m2e1b7f0a9c3", content: "nos alegra mucho!", type: "text", time: 1666684010, self: true }
                ]
            },
            {
                id: "c0e9a1f2b3d8",
                name: "Gabriel Núñez",
                platform: "instagram",
                botEnabled: false,
                interest: 5,
                messages:
                [
                    { id: "m9f3e1b2a0c6", content: "tienen alguna promoción?", type: "text", time: 1666685000, self: false }
                ]
            },
            {
                id: "f2b7d0a1e9c3",
                name: "Jimena Suárez",
                platform: "facebook",
                botEnabled: true,
                interest: 7,
                messages: [
                    { id: "m1a0c6f9e2b3", content: "ya hice la transferencia", type: "text", time: 1666686000, self: false },
                    { id: "m4d9e3b1c0a2", content: "perfecto, lo reviso", type: "text", time: 1666686010, self: true }
                ]
            },
            {
                id: "a8c3f1e0b9d4",
                name: "Héctor Vargas",
                platform: "messenger",
                botEnabled: false,
                interest: 3,
                messages: [
                    { id: "m7e2b0a1f3c9", content: "necesito ayuda con la instalación", type: "text", time: 1666687000, self: false }
                ]
            },
            {
                id: "d1e9b0a2c3f7",
                name: "Liliana Castro",
                platform: "whatsapp",
                botEnabled: true,
                interest: 6,
                messages: [
                    { id: "m2c0f3a9e1b8", content: "me encantó el producto, gracias!", type: "text", time: 1666688000, self: false },
                    { id: "m5a8b1c0f3e2", content: "¡Qué bueno que te gustó!", type: "text", time: 1666688010, self: true }
                ]
            },
            {
                id: "b4f0a2c9e1d3",
                name: "Oscar Pérez",
                platform: "facebook",
                botEnabled: false,
                interest: 5,
                messages: [
                    { id: "m8e1c3f0a9b2", content: "cuando abren mañana?", type: "text", time: 1666689000, self: false }
                ]
            },
            {
                id: "e7c2a9f1b0d6",
                name: "Paola Ruiz",
                platform: "instagram",
                botEnabled: true,
                interest: 8,
                messages: [
                    { id: "m3a6f0e1c9b2", content: "tienen servicio a domicilio?", type: "text", time: 1666690000, self: false },
                    { id: "m6b9c2f1a0e3", content: "sí, con costo adicional", type: "text", time: 1666690010, self: true }
                ]
            },
            {
                id: "c9a3f0e1b2d7",
                name: "Raúl Flores",
                platform: "messenger",
                botEnabled: false,
                interest: 4,
                messages: [
                    { id: "m1b7d0a2c9f3", content: "no me llegó la confirmación", type: "text", time: 1666691000, self: false }
                ]
            },
            {
                id: "f0d6b1a2c9e3",
                name: "Silvia Guzmán",
                platform: "whatsapp",
                botEnabled: true,
                interest: 9,
                messages: [
                    { id: "m4a9c3f0e1b7", content: "todo perfecto, muchas gracias!", type: "text", time: 1666692000, self: false },
                    { id: "m7e1b0a2f9c3", content: "a ti por tu compra!", type: "text", time: 1666692010, self: true }
                ]
            },
            {
                id: "a2e7c0f1b3d9",
                name: "Tomás Pérez",
                platform: "facebook",
                botEnabled: false,
                interest: 2,
                messages: [
                    { id: "m9c3f0a1e2b7", content: "no entiendo cómo funciona", type: "text", time: 1666693000, self: false }
                ]
            },
            {
                id: "d5c9b1a0f3e8",
                name: "Ursula Ruiz",
                platform: "instagram",
                botEnabled: true,
                interest: 7,
                messages: [
                    { id: "m2f0e1b9c3a7", content: "puedo pagar con tarjeta?", type: "text", time: 1666694000, self: false },
                    { id: "m5b1c7f0a9e2", content: "sí, aceptamos tarjetas", type: "text", time: 1666694010, self: true }
                ]
            },
            {
                id: "b8a1f3e0c2d9",
                name: "Víctor Flores",
                platform: "messenger",
                botEnabled: false,
                interest: 6,
                messages: [
                    { id: "m1c0f9a3e2b7", content: "cuando tienen nuevos modelos?", type: "text", time: 1666695000, self: false }
                ]
            },
            {
                id: "e1f0a9c3b2d8",
                name: "Wendy Guzmán",
                platform: "whatsapp",
                botEnabled: true,
                interest: 8,
                messages: [
                    { id: "m4b7c0f1e9a2", content: "ya recomendé su página a mis amigos", type: "text", time: 1666696000, self: false },
                    { id: "m7a2f9e0c1b3", content: "¡Muchas gracias!", type: "text", time: 1666696010, self: true }
                ]
            },
            {
                id: "c3d8b1a0f2e9",
                name: "Xavier Pérez",
                platform: "facebook",
                botEnabled: false,
                interest: 4,
                messages: [
                    { id: "m9e2c0f1b7a3", content: "no me responden los mensajes", type: "text", time: 1666697000, self: false }
                ]
            },
            {
                id: "f9a2e0c1b3d8",
                name: "Yolanda Ruiz",
                platform: "instagram",
                botEnabled: true,
                interest: 9,
                messages: [
                    { id: "m2b7f0a1e9c3", content: "me llegó antes de lo esperado, genial!", type: "text", time: 1666698000, self: false },
                    { id: "m5c0a9f3e1b2", content: "¡Nos alegramos mucho!", type: "text", time: 1666698010, self: true }
                ]
            },
            {
                id: "a1b8d0c2e9f3",
                name: "Zacarias Flores",
                platform: "messenger",
                botEnabled: false,
                interest: 5,
                messages: [
                    { id: "m8f3e1b0a2c7", content: "tienen tienda física?", type: "text", time: 1666699000, self: false }
                ]
            }
        ]
    },
    comments: {
        allItemsLoaded: false,
        list: [
            {
                userId: "c2a0f3b1e8d6",
                postId: "sj1n1324nj2n",
                name: "Juan Perez",
                platform: "facebook",
                botEnabled: false,
                interest: 2,
                permalink: "https://www.linkfalso.com/sj1n1324nj2n", // new prperty for all comments
                comments: [
                    {
                        id: "cm1f0b3e2a9c",
                        content: "hola me interesa",
                        type: "text",
                        time: 1234567890,
                        self: false
                    },
                    {
                        id: "cm9a6c1f0b3e",
                        content: "todavía lo tienes?",
                        type: "text",
                        time: 1234567900,
                        self: false
                    }
                ]
            },
            {
                userId: "e7c1a3b0d9f5",
                postId: "dsasnajn1ijd",
                name: "Lucía Herrera",
                platform: "instagram",
                botEnabled: true,
                interest: 4,
                permalink: "https://www.linkfalso.com/dsasnajn1ijd",
                comments: [
                    {
                        id: "cm4f8a9b2c0e",
                        content: "precio?",
                        type: "text",
                        time: 1666676000,
                        self: false
                    },
                    {
                        id: "cm3b7f0e1a2c",
                        content: "¿envías a Quito?",
                        type: "text",
                        time: 1666676010,
                        self: false
                    }
                ]
            },
            {
                userId: "b9a2f0e1c6d3",
                postId: "24dewfe3fe2e",
                name: "Marco Aguirre",
                platform: "facebook",
                botEnabled: false,
                interest: 3,
                permalink: "https://www.linkfalso.com/24dewfe3fe2e",
                comments: [
                    {
                        id: "cm2e1a0f9b4c",
                        content: "¿tienes más colores?",
                        type: "text",
                        time: 1666676020,
                        self: false
                    }
                ]
            },
            {
                userId: "f0c9e3a2b1d6",
                postId: "f2f3f43f53f5",
                name: "Sofía Molina",
                platform: "instagram",
                botEnabled: true,
                interest: 5,
                permalink: "https://www.linkfalso.com/f2f3f43f53f5",
                comments: [
                    {
                        id: "cm0b1f3e6a2c",
                        content: "me encanta 😍",
                        type: "text",
                        time: 1666676030,
                        self: false
                    }
                ]
            },
            {
                userId: "a2f1e0b9c3d4",
                postId: "5343tf4gt5hh",
                name: "Daniel Ruiz",
                platform: "facebook",
                botEnabled: false,
                interest: 1,
                permalink: "https://www.linkfalso.com/5343tf4gt5hh",
                comments: [
                    {
                        id: "cm5a3e1b0f9c",
                        content: "quiero uno",
                        type: "text",
                        time: 1666676040,
                        self: false
                    },
                    {
                        id: "cm8c9f0a2e1b",
                        content: "responde porfa",
                        type: "text",
                        time: 1666676045,
                        self: false
                    }
                ]
            },
            {
                userId: "d1f3a6e0c9b2",
                postId: "121e21f5g65h",
                name: "Valentina Ríos",
                platform: "messenger",
                botEnabled: true,
                interest: 6,
                permalink: "https://www.linkfalso.com/121e21f5g65h",
                comments: [
                    {
                        id: "cm1b0c3f2a9e",
                        content: "¡Está hermoso!",
                        type: "text",
                        time: 1666676050,
                        self: false
                    },
                    {
                        id: "cm2c8e1f3a0b",
                        content: "¿aceptas transferencias?",
                        type: "text",
                        time: 1666676060,
                        self: false
                    }
                ]
            },
            {
                userId: "c3f9b0e1d6a2",
                postId: "2343232d32dd",
                name: "Luis Gómez",
                platform: "facebook",
                botEnabled: false,
                interest: 4,
                permalink: "https://www.linkfalso.com/2343232d32dd",
                comments: [
                    {
                        id: "cm7e2b9f0c1a",
                        content: "¿Dónde estás ubicado?",
                        type: "text",
                        time: 1666676070,
                        self: false
                    }
                ]
            },
            {
                userId: "e6a1c0f2b9d3",
                postId: "g76h76h87h7h",
                name: "Camila Torres",
                platform: "instagram",
                botEnabled: true,
                interest: 8,
                permalink: "https://www.linkfalso.com/g76h76h87h7h",
                comments: [
                    {
                        id: "cm3a6f1b0e9c",
                        content: "Me interesa para regalo",
                        type: "text",
                        time: 1666676080,
                        self: false
                    },
                    {
                        id: "cm6b0c1f2a9e",
                        content: "¿Tienes en otros tamaños?",
                        type: "text",
                        time: 1666676090,
                        self: false
                    }
                ]
            },
            {
                userId: "a3d2c1b9f0e6",
                postId: "dn29ud392dn9",
                name: "Mateo Sánchez",
                platform: "facebook",
                botEnabled: false,
                interest: 3,
                permalink: "https://www.linkfalso.com/dn29ud392dn9",
                comments: [
                    {
                        id: "cm9e1b0a2f3c",
                        content: "revisé mi inbox",
                        type: "text",
                        time: 1666676100,
                        self: false
                    }
                ]
            },
            {
                userId: "f9b0a2d1e6c3",
                postId: "juhgk90hkr0i",
                name: "Andrea Jaramillo",
                platform: "messenger",
                botEnabled: true,
                interest: 7,
                permalink: "https://www.linkfalso.com/juhgk90hkr0i",
                comments: [
                    {
                        id: "cm2f0e3a6b1c",
                        content: "te acabo de escribir",
                        type: "text",
                        time: 1666676110,
                        self: false
                    }
                ]
            },
            {
                userId: "1c9a7f3e0b2d",
                postId: "d2dn94r4rn44",
                name: "Pedro Guzmán",
                platform: "facebook",
                botEnabled: false,
                interest: 5,
                permalink: "https://www.linkfalso.com/d2dn94r4rn44",
                comments: [
                    {
                        id: "cm7d2e9f0a1b",
                        content: "se ve interesante",
                        type: "text",
                        time: 1666676120,
                        self: false
                    }
                ]
            },
            {
                userId: "9e2b0a1c3f7d",
                postId: "392rh392rn39",
                name: "Isabel Ríos",
                platform: "instagram",
                botEnabled: true,
                interest: 6,
                permalink: "https://www.linkfalso.com/392rh392rn39",
                comments: [
                    {
                        id: "cm3f0a2c9e1b",
                        content: "quiero saber más",
                        type: "text",
                        time: 1666676130,
                        self: false
                    },
                    {
                        id: "cm6a1c9f0b3e",
                        content: "algún número de contacto?",
                        type: "text",
                        time: 1666676140,
                        self: false
                    }
                ]
            },
            {
                userId: "c7f0a3b1e2d9",
                postId: "hf239f239f23",
                name: "Carlos Velez",
                platform: "messenger",
                botEnabled: false,
                interest: 2,
                permalink: "https://www.linkfalso.com/hf239f239f23",
                comments: [
                    {
                        id: "cm0b9f3e1a2c",
                        content: "no me convence mucho",
                        type: "text",
                        time: 1666676150,
                        self: false
                    }
                ]
            },
            {
                userId: "f3d9b0a1e2c6",
                postId: "121e32e32eff",
                name: "Elena Paz",
                platform: "facebook",
                botEnabled: true,
                interest: 7,
                permalink: "https://www.linkfalso.com/121e32e32eff",
                comments: [
                    {
                        id: "cm5e1a0f9b2c",
                        content: "gracias por la atención",
                        type: "text",
                        time: 1666676160,
                        self: false
                    }
                ]
            },
            {
                userId: "a0c6f9e1b3d2",
                postId: "f45h6h76h78j",
                name: "Javier Soto",
                platform: "instagram",
                botEnabled: false,
                interest: 4,
                permalink: "https://www.linkfalso.com/f45h6h76h78j",
                comments: [
                    {
                        id: "cm8b2f0e1a9c",
                        content: "necesito ver más fotos",
                        type: "text",
                        time: 1666676170,
                        self: false
                    }
                ]
            },
            {
                userId: "d2b9f0a1e3c7",
                postId: "j87j87j87j89",
                name: "Mariana León",
                platform: "messenger",
                botEnabled: true,
                interest: 9,
                permalink: "https://www.linkfalso.com/j87j87j87j89",
                comments: [
                    {
                        id: "cm1a6f3e0b2c",
                        content: "es justo lo que buscaba!",
                        type: "text",
                        time: 1666676180,
                        self: false
                    }
                ]
            },
            {
                userId: "b5f0a2c9e1d8",
                postId: "od0k0ed20d9f",
                name: "Roberto Castro",
                platform: "facebook",
                botEnabled: false,
                interest: 3,
                permalink: "https://www.linkfalso.com/od0k0ed20d9f",
                comments: [
                    {
                        id: "cm4c9f0a1e2b",
                        content: "algún video del producto?",
                        type: "text",
                        time: 1666676190,
                        self: false
                    }
                ]
            },
            {
                userId: "e8c1a3f0b9d2",
                postId: "f42j9f292j2f",
                name: "Silvia Vargas",
                platform: "instagram",
                botEnabled: true,
                interest: 6,
                permalink: "https://www.linkfalso.com/f42j9f292j2f",
                comments: [
                    {
                        id: "cm7f0a2c9e1b",
                        content: "me avisas si hay novedades",
                        type: "text",
                        time: 1666676200,
                        self: false
                    }
                ]
            },
            {
                userId: "c1a9f3e0b2d7",
                postId: "fff2f2f2f55f",
                name: "Andrés Ruiz",
                platform: "messenger",
                botEnabled: false,
                interest: 5,
                permalink: "https://www.linkfalso.com/fff2f2f2f55f",
                comments: [
                    {
                        id: "cm0e2b9f1a3c",
                        content: "gracias por la info!",
                        type: "text",
                        time: 1666676210,
                        self: false
                    }
                ]
            },
            {
                userId: "f7d2b0a1e9c3",
                postId: "54t5454g54g5",
                name: "Laura Soto",
                platform: "facebook",
                botEnabled: true,
                interest: 8,
                permalink: "https://www.linkfalso.com/54t5454g54g5",
                comments: [
                    {
                        id: "cm3a9f0e1c2b",
                        content: "ya compartí con mis amigos",
                        type: "text",
                        time: 1666676220,
                        self: false
                    }
                ]
            },
            {
                userId: "a4f0c9e1b2d6",
                postId: "llfds99ds0ff",
                name: "Diego Paz",
                platform: "instagram",
                botEnabled: false,
                interest: 2,
                permalink: "https://www.linkfalso.com/llfds99ds0ff",
                comments: [
                    {
                        id: "cm6c1f0a9e2b",
                        content: "no es lo que esperaba",
                        type: "text",
                        time: 1666676230,
                        self: false
                    }
                ]
            },
            {
                userId: "d9b2f0a1e3c8",
                postId: "fdsfdsn99191",
                name: "Valeria Castro",
                platform: "messenger",
                botEnabled: true,
                interest: 7,
                permalink: "https://www.linkfalso.com/fdsfdsn99191",
                comments: [
                    {
                        id: "cm9f0a2c1b3e",
                        content: "cuando llega mi pedido?",
                        type: "text",
                        time: 1666676240,
                        self: false
                    }
                ]
            },
            {
                userId: "b1c8f0a2e3d9",
                postId: "43r43rc3cvfg",
                name: "Martín León",
                platform: "facebook",
                botEnabled: false,
                interest: 4,
                permalink: "https://www.linkfalso.com/43r43rc3cvfg",
                comments: [
                    {
                        id: "cm2e0b9f1a3c",
                        content: "tienen alguna garantía?",
                        type: "text",
                        time: 1666676250,
                        self: false
                    }
                ]
            },
            {
                userId: "e0a3f9c1b2d7",
                postId: "y76b76u6bbbc",
                name: "Carolina Soto",
                platform: "instagram",
                botEnabled: true,
                interest: 9,
                permalink: "https://www.linkfalso.com/y76b76u6bbbc",
                comments: [
                    {
                        id: "cm5b1f0a2c9e",
                        content: "me encanta su atención!",
                        type: "text",
                        time: 1666676260,
                        self: false
                    }
                ]
            },
            {
                userId: "c6d9b0a1e2f3",
                postId: "1c21e21ce21e",
                name: "Gabriel Paz",
                platform: "messenger",
                botEnabled: false,
                interest: 3,
                permalink: "https://www.linkfalso.com/1c21e21ce21e",
                comments: [
                    {
                        id: "cm8a2f0e1b9c",
                        content: "no encuentro lo que busco",
                        type: "text",
                        time: 1666676270,
                        self: false
                    }
                ]
            },
            {
                userId: "f2a7c0e1b9d3",
                postId: "tc5t45c5tc5v",
                name: "Jimena Castro",
                platform: "facebook",
                botEnabled: true,
                interest: 6,
                permalink: "https://www.linkfalso.com/tc5t45c5tc5v",
                comments: [
                    {
                        id: "cm1c9f0a2e3b",
                        content: "ya les escribí al inbox",
                        type: "text",
                        time: 1666676280,
                        self: false
                    }
                ]
            },
            {
                userId: "a9e3b0c1f2d8",
                postId: "0d01j0dj0cj0",
                name: "Héctor León",
                platform: "instagram",
                botEnabled: false,
                interest: 5,
                permalink: "https://www.linkfalso.com/0d01j0dj0cj0",
                comments: [
                    {
                        id: "cm4f0a2c9b1e",
                        content: "tienen ofertas especiales?",
                        type: "text",
                        time: 1666676290,
                        self: false
                    }
                ]
            },
            {
                userId: "d1c7f0a2e3b9",
                postId: "c1jc0j29cn9d",
                name: "Liliana Soto",
                platform: "messenger",
                botEnabled: true,
                interest: 8,
                permalink: "https://www.linkfalso.com/c1jc0j29cn9d",
                comments: [
                    {
                        id: "cm7b2f0e1a9c",
                        content: "gracias por la ayuda!",
                        type: "text",
                        time: 1666676300,
                        self: false
                    }
                ]
            },
            {
                userId: "b4a0f9c1e2d3",
                postId: "cj19cd1nc91n",
                name: "Oscar Paz",
                platform: "facebook",
                botEnabled: false,
                interest: 2,
                permalink: "https://www.linkfalso.com/cj19cd1nc91n",
                comments: [
                    {
                        id: "cm0c9f1a2e3b",
                        content: "no me gustó mucho",
                        type: "text",
                        time: 1666676310,
                        self: false
                    }
                ]
            },
            {
                userId: "e7f3b0a1c2d9",
                postId: "fkpjfpdgj0fd",
                name: "Paola Castro",
                platform: "instagram",
                botEnabled: true,
                interest: 7,
                permalink: "https://www.linkfalso.com/fkpjfpdgj0fd",
                comments: [
                    {
                        id: "cm3a2f0e1b9c",
                        content: "cuando tienen nuevos productos?",
                        type: "text",
                        time: 1666676320,
                        self: false
                    }
                ]
            },
            {
                userId: "c0b9f1a2e3d6",
                postId: "f2jfj20fje0j",
                name: "Raúl León",
                platform: "messenger",
                botEnabled: false,
                interest: 4,
                permalink: "https://www.linkfalso.com/f2jfj20fje0j",
                comments: [
                    {
                        id: "cm6f0a2c9b1e",
                        content: "necesito factura",
                        type: "text",
                        time: 1666676330,
                        self: false
                    }
                ]
            },
            {
                userId: "f3c6a0e1b9d2",
                postId: "jfdsjd0s0vc0",
                name: "Silvia Soto",
                platform: "facebook",
                botEnabled: true,
                interest: 9,
                permalink: "https://www.linkfalso.com/jfdsjd0s0vc0",
                comments: [
                    {
                        id: "cm9b2f0e1a3c",
                        content: "son los mejores!",
                        type: "text",
                        time: 1666676340,
                        self: false
                    }
                ]
            },
            {
                userId: "a6d2b0c1f9e3",
                postId: "nbvnbvn33g33",
                name: "Tomás Paz",
                platform: "instagram",
                botEnabled: false,
                interest: 3,
                permalink: "https://www.linkfalso.com/nbvnbvn33g33",
                comments: [
                    {
                        id: "cm2c9f0a1e3b",
                        content: "no responden rápido",
                        type: "text",
                        time: 1666676350,
                        self: false
                    }
                ]
            },
            {
                userId: "d9a1f3e0c2b7",
                postId: "vcxvc2fef2f2",
                name: "Ursula Castro",
                platform: "messenger",
                botEnabled: true,
                interest: 6,
                permalink: "https://www.linkfalso.com/vcxvc2fef2f2",
                comments: [
                    {
                        id: "cm5f0a2c9b1e",
                        content: "me ayudan con una duda?",
                        type: "text",
                        time: 1666676360,
                        self: false
                    }
                ]
            },
            {
                userId: "b2e7c0f1a9d3",
                postId: "mvlfdmvfldm2",
                name: "Víctor León",
                platform: "facebook",
                botEnabled: false,
                interest: 5,
                permalink: "https://www.linkfalso.com/mvlfdmvfldm2",
                comments: [
                    {
                        id: "cm8c9f0a2e1b",
                        content: "tienen catálogo?",
                        type: "text",
                        time: 1666676370,
                        self: false
                    }
                ]
            },
            {
                userId: "e1c3a9f0b2d8",
                postId: "vmmvkowo2022",
                name: "Wendy Soto",
                platform: "instagram",
                botEnabled: true,
                interest: 8,
                permalink: "https://www.linkfalso.com/vmmvkowo2022",
                comments: [
                    {
                        id: "cm1b9f0a2c3e",
                        content: "excelente atención al cliente!",
                        type: "text",
                        time: 1666676380,
                        self: false
                    }
                ]
            },
            {
                userId: "c8f0a2e1b3d9",
                postId: "mfodsjofdso3",
                name: "Xavier Paz",
                platform: "messenger",
                botEnabled: false,
                interest: 2,
                permalink: "https://www.linkfalso.com/mfodsjofdso3",
                comments: [
                    {
                        id: "cm4e2b9f0a1c",
                        content: "no me funciona el link",
                        type: "text",
                        time: 1666676390,
                        self: false
                    }
                ]
            },
            {
                userId: "f5a1c9e0b2d3",
                postId: "mfkdsmodsn99",
                name: "Yolanda Castro",
                platform: "facebook",
                botEnabled: true,
                interest: 7,
                permalink: "https://www.linkfalso.com/mfkdsmodsn99",
                comments: [
                    {
                        id: "cm7a2f0e1b9c",
                        content: "gracias por su paciencia",
                        type: "text",
                        time: 1666676400,
                        self: false
                    }
                ]
            },
            {
                userId: "a2d8b0c1f9e6",
                postId: "217683biyfgb",
                name: "Zacarias León",
                platform: "instagram",
                botEnabled: false,
                interest: 4,
                permalink: "https://www.linkfalso.com/217683biyfgb",
                comments: [
                    {
                        id: "cm0f9a2c1b3e",
                        content: "tienen página web?",
                        type: "text",
                        time: 1666676410,
                        self: false
                    }
                ]
            }
        ]
    }
};



module.exports = items;