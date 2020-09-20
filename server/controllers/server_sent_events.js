const path = require('path');

const clients = new Set();

const render_page = (req, res) => {
  res.sendFile(
    path.join(__dirname, '../../client/serverSentEvents/index.html')
  );
};

const get_index_js = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/serverSentEvents/index.js'));
};

const post_publish = (req, res) => {
  const jsonString = JSON.stringify({
    message: req.body.message,
  });
  clients.forEach(client => {
    client.write(`data: ${jsonString}\n\nretry: 10\n\n`);
  });
  res.send('OK');
};

const get_subscribe = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
  });
  clients.add(res);
};

module.exports = {
  render_page,
  get_index_js,
  post_publish,
  get_subscribe,
};
