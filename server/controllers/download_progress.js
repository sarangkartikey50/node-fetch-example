const path = require('path');

const get_index_html = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/downloadProgress/index.html'));
}

const get_index_js = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/downloadProgress/index.js'));
}

const get_download_file = (req, res) => {
  res.sendFile(path.join(__dirname, '../assets/7221.jpg'));
}

module.exports = {
  get_index_html,
  get_index_js,
  get_download_file,
};