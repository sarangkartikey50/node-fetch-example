const path = require('path');

const subscribers = new Set();

const render_page = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/longPolling/index.html'));
};

const get_index_js = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/longPolling/index.js'));
};

const get_subscribe = (req, res) => {
  subscribers.add(res);
};

const post_publish = (req, res) => {
  subscribers.forEach(subscriber => {
    subscriber.json({
      message: req.body.message
    });
  });
  res.send('OK');
  subscribers.clear();
};

module.exports = {
  render_page,
  get_index_js,
  get_subscribe,
  post_publish,
};
