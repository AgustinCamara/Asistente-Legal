/* api.js
   la funcion que habla con groq. mete el mensaje del usuario en el historial,
   arma el request con el system prompt y todo el historial, y manda el fetch.
   si algo sale mal (rate limit, red caida, respuesta vacia) devuelve un
   mensaje de error lindo en vez de romper todo.
   necesita config.js, prompt.js y ui.js. */

async function generateResponse(userMessage) {
  // agregar al historial
  conversationHistory.push({ role: 'user', content: userMessage });

  // no dejar que el historial crezca de mas (max 20 intercambios)
  if (conversationHistory.length > 40) {
    conversationHistory = conversationHistory.slice(-40);
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory
  ];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: messages,
        temperature: 0.4,
        max_tokens: 2048,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg  = errorData?.error?.message || `Error ${response.status}`;
      conversationHistory.pop();

      if (response.status === 429) {
        return '⏳ <strong>El servicio está temporalmente saturado.</strong> Esperá unos segundos e intentá de nuevo.';
      }
      return `❌ <strong>Error del servicio:</strong> ${escapeHTML(errorMsg)}<br>Intentá de nuevo en unos momentos.`;
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      conversationHistory.pop();
      return '⚠️ No se recibió una respuesta válida. Intentá de nuevo.';
    }

    conversationHistory.push({ role: 'assistant', content: assistantMessage });
    return markdownToHTML(assistantMessage);

  } catch (error) {
    console.error('Error al llamar a la API:', error);
    conversationHistory.pop();

    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return '🌐 <strong>Error de conexión.</strong> Verificá tu conexión a internet e intentá de nuevo.';
    }
    return `❌ <strong>Error inesperado:</strong> ${escapeHTML(error.message)}`;
  }
}
