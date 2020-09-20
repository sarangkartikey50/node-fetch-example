const express = require('express');
const router = express.Router();

const regular_polling_controller = require('../controllers/regular_polling');

router.get('/', regular_polling_controller.regular_polling_render_page);
router.get('/index.js', regular_polling_controller.regular_polling_index_js);
router.get('/request_count', regular_polling_controller.regular_polling_get);

module.exports = router;