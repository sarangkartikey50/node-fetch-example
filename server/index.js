const express = require('express');
const path = require('path');

const app = express();

const index_route = require('./routes/index');
const regular_polling_route = require('./routes/regular_polling');
const long_polling_route = require('./routes/long_polling');
const web_socket_route = require('./routes/web_socket');
const server_sent_events_route = require('./routes/server_sent_events');
const download_progress_route = require('./routes/download_progress');
const xhr_upload_progress_route = require('./routes/xhr_upload_progress');

app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '/assets')));
app.use('/', index_route);
app.use('/regular_polling', regular_polling_route);
app.use('/long_polling', long_polling_route);
app.use('/web_socket', web_socket_route);
app.use('/server_sent_events', server_sent_events_route);
app.use('/download_progress', download_progress_route);
app.use('/xhr_upload_progress', xhr_upload_progress_route);


app.listen(3000, () => console.log('running @ http://localhost:3000/'));