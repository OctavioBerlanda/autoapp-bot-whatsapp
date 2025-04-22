const functions = require('firebase-functions');
const axios = require('axios');
const handleStart = require('./handlers/handleStart');
const handleUserType = require('./handlers/handleUserType');

const admin = require('firebase-admin');
const { sendMessage } = require('./responder'); // Importamos la función para enviar mensajes

admin.initializeApp(); // Inicializa Firebase Admin

// Trigger para Firestore cuando se crea una nueva subasta
exports.notifyNewAuction = functions.firestore
  .document('auctions/{auctionId}')
  .onCreate(async (snap, context) => {
    const newAuction = snap.data();
    const usersSnapshot = await admin.firestore().collection('users').get();

    try {
      usersSnapshot.forEach(async (doc) => {
        const user = doc.data();
        const phone = user.phone;
        const message = `¡Nueva subasta disponible! 🏎️\n${newAuction.title}\nPrecio: ${newAuction.price}\nMás detalles en la app.`;

        // Intentamos enviar el mensaje
        try {
          await sendMessage(phone, message);
          console.log(`Mensaje enviado a ${phone}`);
        } catch (error) {
          console.error(`Error al enviar mensaje a ${phone}:`, error);
        }
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }

    console.log('Notificación de subasta enviada');
  });

exports.whatsappBot = functions.https.onRequest(async (req, res) => {
  // Verificamos si es un webhook de verificación (de Meta)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === 'TU_TOKEN_VERIFICACION') {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  // Procesamos mensajes entrantes
  if (req.method === 'POST') {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) return res.sendStatus(200); // No hay mensaje

    const phone = message.from;
    const normalizedText = (message.text?.body || '').trim().toLowerCase();

    // Si el mensaje es "hola", le pedimos el email
    if (['hola', 'hi', 'buenas'].includes(normalizedText)) {
      await sendMessage(phone, '¡Hola! 👋\nPara comenzar, por favor, ingresa tu correo electrónico.');
    }
    // Cuando recibimos el email, verificamos si es concesionario o usuario
    else if (normalizedText.includes('@')) {
      // Es un email, entonces lo buscamos en la base de datos
      await handleStart(phone, normalizedText); // Aquí pasamos el email para buscar en la base de datos
    }
    // Si el mensaje es 'concesionario' o 'usuario' después de recibir el email, lo procesamos
    else if (['concesionario', 'usuario'].includes(normalizedText)) {
      await handleUserType(phone, normalizedText);
    } else {
      await sendMessage(phone, 'Perdón, no entendí. Escribí "hola" para empezar.');
    }

    return res.sendStatus(200);
  }

  return res.sendStatus(405); // Método no permitido
});



