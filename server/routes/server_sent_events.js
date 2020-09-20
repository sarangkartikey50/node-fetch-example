const express = require('express');
const router = express.Router();

const server_sent_events_controller = require('../controllers/server_sent_events');

router.get('/', server_sent_events_controller.render_page);
router.get('/index.js', server_sent_events_controller.get_index_js);
router.post('/publish', server_sent_events_controller.post_publish);
router.get('/subscribe', server_sent_events_controller.get_subscribe);

module.exports = router;
