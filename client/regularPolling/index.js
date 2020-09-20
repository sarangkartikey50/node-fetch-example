const poll = async ({ call, validate, interval, timeout, maxCount }) => {
  let count = 0;
  const initTime = new Date();
  const executePoll = async (resolve, reject) => {
    const response = await call();
    const diffMilliSeconds = (new Date()) - initTime;
    if(await validate(response)) {
      resolve(response);
    } else if(maxCount && count >= maxCount) {
      reject(new Error('Maximum poll count reached'));
    } else if(timeout && diffMilliSeconds > timeout) {
      reject(new Error('Poll timeout'));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };
  return new Promise(executePoll);
}

poll({
  call: () => fetch('/regular_polling/request_count'),
  validate: async (res) => {
    const json = await res.clone().json();
    const pollElement = document.querySelector('#poll');
    pollElement.textContent = `request count: ${json.request_count}`;
    return json.request_count%10 == 0;
  },
  interval: 1000,
  timeout: 5000,
  maxCount: 10,
})
.then(res => res.json())
.then(res => {
  const responseElement = document.querySelector('#response');
  responseElement.textContent = JSON.stringify(res, null, 2);
})
.catch(err => {
  const errorElement = document.querySelector('#error');
  errorElement.textContent = err.toString();
});
