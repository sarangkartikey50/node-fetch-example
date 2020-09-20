const downloadButtonElement = document.querySelector('button');
const downloadedElement = document.querySelector('#downloaded');
downloadButtonElement.addEventListener('click', async (event) => {
  const response = await fetch('/download_progress/download');
  const totalResponseLength = response.headers.get('Content-Length');
  const reader = response.body.getReader();
  const chunks = [];
  let receivedResponseLength = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    receivedResponseLength += value.length;
    const downloadPercentage = (receivedResponseLength/totalResponseLength).toFixed(2)*100;
    console.log(downloadPercentage);
    downloadedElement.textContent = `downloaded: ${downloadPercentage}%`;
    chunks.push(value);
  }
  let stringChar = '';
  chunks.forEach((chunkArray) => {
    chunkArray.forEach(chunk => {
      stringChar += String.fromCharCode(chunk);
    });
  });
  const base64String = btoa(stringChar);
  const imageElement = document.createElement('img');
  imageElement.src = `data:image/jpg;base64, ${base64String}`;
  document.body.appendChild(imageElement);
});
