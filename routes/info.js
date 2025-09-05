const express = require('express');
const router = express.Router();

const { getCategoryList } = require('../controllers/info.js');

router.route('/category/:cat').get(getCategoryList);

module.exports = router;