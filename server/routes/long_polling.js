const express = require('express');
const { route } = require('.');
const { long_polling_get } = require('../controllers/long_polling');
const router = express.Router();

const long_polling_controller = require('../controllers/long_polling');

router.get('/', long_polling_controller.render_page);
router.get('/index.js', long_polling_controller.get_index_js);
router.get('/subscribe', long_polling_controller.get_subscribe);
router.post('/publish', long_polling_controller.post_publish);

module.exports = router;