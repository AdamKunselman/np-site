const express = require('express');
const router = express.Router();
const {getParkData, getListData, getParkNames} = require('../controllers/parks.js');

router.route('/parkdata/:parkName').get(getParkData);
router.route('/list').get(getListData);
router.route('/names').get(getParkNames);

module.exports = router;