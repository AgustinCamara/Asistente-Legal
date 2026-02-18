/* config.js
   las constantes para conectar con groq (que es gratis y re rapido).
   la api key esta metida aca directo para que el usuario no tenga que
   configurar nada. si queres cambiar de modelo o proveedor, toca aca.
   este archivo tiene que cargarse antes que api.js y chat.js. */

const API_KEY = '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';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL   = 'llama-3.3-70b-versatile';
