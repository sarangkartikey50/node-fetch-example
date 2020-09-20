const statusElement = document.querySelector('#status');
const inputElement = document.querySelector('input');
const responseElement = document.querySelector('#response');
const eventSource = new EventSource('http://localhost:3000/server_sent_events/subscribe');

eventSource.onopen = function (event) {
  statusElement.textContent = 'status: connected';
};

eventSource.onmessage = function (event) {
  const json = JSON.parse(event.data);
  const div = document.createElement('div');
  div.textContent = json.message;
  responseElement.appendChild(div);
};

eventSource.onerror = function (error) {
  statusElement.textContent = `Error: ${error.message}`;
};

inputElement.addEventListener('keyup', (event) => {
  if (event.key === 'Enter')
    fetch('/server_sent_events/publish', {
      method: 'POST',
      body: JSON.stringify({
        message: event.target.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
});
