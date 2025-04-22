const admin = require('firebase-admin');
const serviceAccount = require('./ruta/al/serviceAccountKey.json'); // asegúrate de que esta ruta esté bien

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://tu-proyecto.firebaseio.com', // opcional si usás Realtime DB
});

module.exports = admin; // para usar en otros archivos
