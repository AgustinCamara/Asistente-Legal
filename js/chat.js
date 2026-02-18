/* chat.js
   la logica principal: handleQuery valida lo que escribio el usuario,
   lo manda a la api y muestra la respuesta. tambien estan los eventos
   del form (submit, enter), el boton de nuevo chat que limpia todo,
   los botones de sugerencia y el auto-resize del textarea.
   necesita ui.js y api.js. */

// funcion principal: procesar consulta
async function handleQuery(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    showInputError('Por favor, escriba una consulta legal antes de enviar.');
    return;
  }
  if (trimmed.length < 5) {
    showInputError('La consulta es demasiado corta. Intente ser más específico.');
    return;
  }
  if (isTyping) return;
  isTyping = true;

  hideWelcome();
  addMessage('user', escapeHTML(trimmed));

  queryInput.value = '';
  autoResizeTextarea();
  sendBtn.disabled = true;

  showLoading(true);
  const response = await generateResponse(trimmed);
  showLoading(false);

  addMessage('ai', response);

  isTyping = false;
  sendBtn.disabled = false;
  queryInput.focus();
}

// submit del form
queryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleQuery(queryInput.value);
});

// boton "nuevo chat" — resetea todo
document.getElementById('newChatBtn').addEventListener('click', () => {
  conversationHistory = [];
  messagesDiv.innerHTML = '';
  if (welcomeDiv) welcomeDiv.style.display = '';
  queryInput.value = '';
  autoResizeTextarea();
  queryInput.focus();
});

// botones de sugerencia
document.querySelectorAll('.suggestion').forEach(btn => {
  btn.addEventListener('click', () => {
    const q = btn.getAttribute('data-q');
    queryInput.value = q;
    handleQuery(q);
  });
});

// enter para enviar (shift+enter = nueva linea)
queryInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleQuery(queryInput.value);
  }
});

// auto-resize del textarea
function autoResizeTextarea() {
  queryInput.style.height = 'auto';
  queryInput.style.height = Math.min(queryInput.scrollHeight, 120) + 'px';
}
queryInput.addEventListener('input', autoResizeTextarea);
