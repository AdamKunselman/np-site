const {StatusCodes} = require('http-status-codes');
const Park = require('../models/Park.js');
require('dotenv').config();

async function getParkData(req,res) {
  try {
      const parkData = await Park.findOne({parkName:req.params.parkName})
        .setOptions({ sanitizeFilter: true });
      if(parkData) {
        res.status(StatusCodes.OK).json(parkData);
      } else {
        res.status(StatusCodes.NOT_FOUND).send(`Cannot find park with parkName: ${req.params.parkName}`);
      }      
  } catch (error) {
    console.log(error);
  }
}

async function getListData(req,res) {
  try {
    const {region, state, parkType} = req.query;
    const query = {}
    if(region) query.region = region;
    if(state) query.state = state;
    if(parkType) query.parkType = parkType;
    const response = await Park.find(query)
      .setOptions({ sanitizeFilter: true }).select('parkName parkType region state')

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.log(error);
  }
}

async function getParkNames(req,res) {
  try {
    const response = await Park.find().select('parkName');
    const names = response.map(name => name.parkName);
    res.status(StatusCodes.OK).send(names);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
    getParkData,
    getListData,
    getParkNames
};