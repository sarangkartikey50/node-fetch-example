const path = require('path');

const render_page = (req, res) => {
  res.send(
    `
    <h1>node-fetch example</h1>
    <a href="/regular_polling">regular polling</a>
    <a href="/long_polling">long polling (try with multiple clients)</a>
    <a href="/web_socket">websocket (try with multiple clients)</a>
    <a href="/server_sent_events">server sent events (try with multiple clients)</a>
    <a href="/download_progress">track download progress with fetch</a>
    <a href="/xhr_upload_progress">track upload progress with xhr (not supported fetch)</a>
    `
  );
};

module.exports = {
  render_page,
};
