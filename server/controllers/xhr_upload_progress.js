const path = require('path');

const get_index_html = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/xhrUploadProgress/index.html'));
}

const get_index_js = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/xhrUploadProgress/index.js'));
}

const post_upload_file = (req, res) => {
  console.log(req.file, req.body);
  res.send('success');
}

module.exports = {
  get_index_html,
  get_index_js,
  post_upload_file,
};