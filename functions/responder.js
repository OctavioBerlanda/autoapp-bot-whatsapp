// Función básica para responder mensajes
async function sendMessage(phone, text) {
  const url = 'https://graph.facebook.com/v18.0/TU_NUMERO_ID/messages';
  const token = 'TU_TOKEN_ACCESO';

  await axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      to: phone,
      text: { body: text },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
}