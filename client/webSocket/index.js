const responseElement = document.querySelector('#response');
const statusElement = document.querySelector('#status');
const inputElement = document.querySelector('input');
const socket = new WebSocket('ws://localhost:3001/subscribe');

socket.onopen = function(event) {
  statusElement.textContent = 'status: connected';
}

socket.onmessage = function(event) {
  const div = document.createElement('div');
  div.textContent = event.data;
  responseElement.appendChild(div);
}

socket.onerror = function(error) {
  statusElement.textContent = `Error: ${error.message}`;
}

socket.onclose = function(event) {
  statusElement.textContent = 'status: closed';
}

inputElement.addEventListener('keyup', event => {
  if(event.key === 'Enter') socket.send(event.target.value);
});