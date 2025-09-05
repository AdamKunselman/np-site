const {StatusCodes} = require('http-status-codes');
const Info = require('../models/Info.js');
require('dotenv').config();

async function getCategoryList(req,res) {
  try {
    const query = req.params.cat;
    const response = await Info.find().setOptions({ sanitizeFilter: true });
    const data = response[0][query];
     res.status(StatusCodes.OK).json(data);
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getCategoryList
}