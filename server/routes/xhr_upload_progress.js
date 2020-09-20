const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer();
const xhr_upload_progress_controller = require('../controllers/xhr_upload_progress');

router.get('/', xhr_upload_progress_controller.get_index_html);
router.get('/index.js', xhr_upload_progress_controller.get_index_js);
router.post('/upload', upload.single('file'), xhr_upload_progress_controller.post_upload_file);

module.exports = router;