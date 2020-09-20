const express = require('express');
const router = express.Router();

const index_controller = require('../controllers/index');

router.get('/', index_controller.render_page);

module.exports = router;