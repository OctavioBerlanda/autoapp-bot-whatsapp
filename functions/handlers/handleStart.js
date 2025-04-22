const { sendMessage } = require('../responder'); // Importa la función desde responder.js
const admin = require('firebase-admin'); // Importamos Firebase Admin para acceder a Firestore

module.exports = async function handleStart(phone, email) {
  // Verificamos si el email ya existe en la base de datos
  const userRef = await admin.firestore().collection('users').where('email', '==', email).get();

  if (userRef.empty) {
    // Si no encontramos el email, pedimos que lo ingresen nuevamente o mostramos un mensaje de error
    await sendMessage(phone, "No encontramos tu email en nuestra base de datos. ¿Podrías intentar nuevamente?");
    return;
  }

  const user = userRef.docs[0].data(); // Obtenemos los datos del usuario
  const tipo = user.tipo; // Suponemos que en la colección 'users' tienes un campo 'tipo' que puede ser 'concesionario' o 'usuario'
  const nombre = user.nombre; // Obtener el nombre del usuario

  // Continuamos con el flujo dependiendo de si es concesionario o usuario
  let respuesta;
  if (tipo === 'concesionario') {
    respuesta = `Perfecto, ${nombre}. ¿En qué te puedo ayudar?\n1️⃣ Problemas para cargar subasta\n2️⃣ Consultas sobre pagos\n3️⃣ Otro`;
  } else {
    respuesta = `Genial, ${nombre}. ¿Qué necesitás?\n1️⃣ Info sobre subastas\n2️⃣ Soporte con la app\n3️⃣ Otro`;
  }

  // Enviamos el mensaje con las opciones correspondientes
  await sendMessage(phone, respuesta);
};
