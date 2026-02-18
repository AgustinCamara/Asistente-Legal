/* ui.js
   las referencias al DOM y las funciones de ayuda para la interfaz.
   aca estan los getElementById de todo lo que se toca, el estado global
   (historial de conversacion y si esta escribiendo), y funciones como
   addMessage, scrollToBottom, showLoading, escapeHTML, markdownToHTML, etc.
   no depende de ningun otro js, solo del html. */

// referencias al dom
const queryForm   = document.getElementById('queryForm');
const queryInput  = document.getElementById('queryInput');
const sendBtn     = document.getElementById('sendBtn');
const messagesDiv = document.getElementById('messages');
const loadingDiv  = document.getElementById('loading');
const welcomeDiv  = document.getElementById('welcome');
const themeToggle = document.getElementById('themeToggle');

// estado global
let conversationHistory = [];
let isTyping = false;

// funciones de ui

/** oculta la pantalla de bienvenida */
function hideWelcome() {
  if (welcomeDiv) welcomeDiv.style.display = 'none';
}

/** agrega un mensaje al DOM (role = 'user' | 'ai') */
function addMessage(role, html) {
  const msg = document.createElement('div');
  msg.className = `message message--${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'message__avatar';
  avatar.textContent = role === 'user' ? 'Ud' : 'IA';

  const bubble = document.createElement('div');
  bubble.className = 'message__bubble';
  bubble.innerHTML = html;

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  messagesDiv.appendChild(msg);
  scrollToBottom();
}

/** baja el scroll hasta el ultimo mensaje */
function scrollToBottom() {
  const chat = document.querySelector('.chat');
  requestAnimationFrame(() => { chat.scrollTop = chat.scrollHeight; });
}

/** muestra u oculta el loader de "analizando..." */
function showLoading(show) {
  loadingDiv.classList.toggle('hidden', !show);
  if (show) scrollToBottom();
}

/** muestra un error temporal abajo del form */
function showInputError(text) {
  const prev = document.querySelector('.input-error');
  if (prev) prev.remove();
  const p = document.createElement('p');
  p.className = 'input-error';
  p.textContent = text;
  queryForm.appendChild(p);
  setTimeout(() => p.remove(), 4000);
}

/** escapa html para que no te metan xss */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/** pasa el markdown basico que devuelve el modelo a html */
function markdownToHTML(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^[-•] (.+)$/gm, '• $1')
    .replace(/^(\d+)\.\s+(.+)$/gm, '<strong>$1.</strong> $2')
    .replace(/\n/g, '<br>');
}
