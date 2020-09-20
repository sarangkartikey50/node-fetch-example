const express = require('express');
const router = express.Router();

const download_progress_controller = require('../controllers/download_progress');

router.get('/', download_progress_controller.get_index_html);
router.get('/index.js', download_progress_controller.get_index_js);
router.get('/download', download_progress_controller.get_download_file);

module.exports = router;