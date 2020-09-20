const path = require('path');

const render_page = (req, res) => {
  res.send(
    `
    <h1>node-fetch example</h1>
    <a href="/regular_polling">regular polling</a>
    <a href="/long_polling">long polling (try with multiple clients)</a>
    <a href="/web_socket">websocket (try with multiple clients)</a>
    <a href="/server_sent_events">server sent events (try with multiple clients)</a>
    `
  );
};

module.exports = {
  render_page,
};
