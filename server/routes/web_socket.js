const express = require('express');
const router = express.Router();

const web_socket_controller = require('../controllers/web_socket');

router.get('/', web_socket_controller.render_page);
router.get('/index.js', web_socket_controller.get_index_js);
// router.get('/subscribe', web_socket_controller.ws_subscribe);

module.exports = router;