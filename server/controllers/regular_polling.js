const path = require('path');

let request_count = 0;

const regular_polling_render_page = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/regularPolling/index.html'));
}

const regular_polling_index_js = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/regularPolling/index.js'));
}

const regular_polling_get = (req, res) => {
  request_count += 1;
  res.json({
    request_count,
  });
}

module.exports = {
  regular_polling_render_page,
  regular_polling_index_js,
  regular_polling_get,
};