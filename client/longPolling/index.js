const inputElement = document.querySelector('input#message');
const responseElement = document.querySelector('#response');

inputElement.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    fetch('/long_polling/publish', {
      method: 'POST',
      body: JSON.stringify({
        message: event.target.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
});

const subscribe = async () => {
  try {
    const response = await fetch('/long_polling/subscribe');
    if (response.status === 502) {
      console.log('Timeout. Connecting again...');
      await subscribe();
    } else if (response.status !== 200) {
      const div = document.createElement('div');
      const json = await response.json();
      responseElement.textContent = json.error;
      responseElement.appendChild(div);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await subscribe();
    } else {
      const json = await response.json();
      const div = document.createElement('div');
      div.textContent = json.message;
      responseElement.appendChild(div);
      await subscribe();
    }
  } catch (err) {
    console.error(err);
    await subscribe();
  }
};

subscribe();
