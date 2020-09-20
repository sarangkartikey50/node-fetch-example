const fileElement = document.querySelector('input');
const progressElement = document.querySelector('#progress');

fileElement.addEventListener('change', event => {
  const file = event.target.files[0];
  const xhr = new XMLHttpRequest();
  xhr.upload.onloadstart = function() {
    console.log('upload started');
  }
  xhr.upload.onprogress = function(event) {
    const uploadPercentage = (event.loaded/event.total).toFixed(2)*100;
    console.log(`uploaded: ${uploadPercentage}`);
    progressElement.textContent = `uploaded: ${uploadPercentage}`;
  }
  xhr.upload.onloadend = function() {
    console.log('upload completed');
  }
  xhr.open('POST', 'http://localhost:3000/xhr_upload_progress/upload');
  const formData = new FormData();
  formData.append('hello', 'world');
  formData.append('file', file);
  xhr.send(formData);
});