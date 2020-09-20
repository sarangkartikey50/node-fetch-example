const path = require('path');
const webSocket = new require('ws');
const webSocketServer = new webSocket.Server({ port: 3001 });

const clients = new Set();

const render_page = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/webSocket/index.html'));
}

const get_index_js = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/webSocket/index.js'));
}

const onSocketConnect = (socket) => {
  clients.add(socket);
  socket.on('message', function(message) {
    clients.forEach(client => client !== socket && client.send(message));
  });
  socket.on('close', () => {
    clients.delete(socket);
  });
}

webSocketServer.on('connection', onSocketConnect);


module.exports = {
  render_page,
  get_index_js,
};