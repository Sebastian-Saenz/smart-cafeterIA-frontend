const idAgente = encodeURIComponent(window.idAgente);
const chatBox = document.getElementById('chat-box');
const form = document.getElementById('chat-form');
const backendUrl = document.querySelector('meta[name="backend-url"]').content;

form.addEventListener('submit', async e => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const msg = input.value;
    appendMessage('user', msg);
    form.reset();

    try {
        const resp = await fetch(`${backendUrl}/client/agent?idagente=${encodeURIComponent(idAgente)}&msg=${encodeURIComponent(msg)}`); // Activador de LangChain
        const { reply } = await resp.json();
        appendMessage('bot', reply);
    } catch (error) {
        appendMessage('bot', 'Lo siento, hubo un error 😕');
    }
});

function appendMessage(role, text) {
    const p = document.createElement('p');
    const div = document.createElement('div');
    div.className = 'chat-msg ' + (role === 'user' ? 'chat-user' : 'chat-bot');
    div.innerText = text;
    p.appendChild(div);
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}
