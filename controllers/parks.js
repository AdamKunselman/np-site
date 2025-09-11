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
    res.status(StatusCodes.BAD_REQUEST)
    console.log(error);
  }
}

async function getListData(req,res) {
  try {
    const {region, state, parkType} = req.query;
    const query = {}
    if(region) query.region = decodeURIComponent(region);
    if(state) query.state = decodeURIComponent(state);
    if(parkType) query.parkType = decodeURIComponent(parkType);
    const response = await Park.find(query)
      .setOptions({ sanitizeFilter: true }).select('parkName parkType region state unitCode images webImages')

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST)
    console.log(error);
  }
}

async function getParkNames(req,res) {
  try {
    const response = await Park.find().select('parkName');
    const names = response.map(name => name.parkName);
    res.status(StatusCodes.OK).send(names);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST)
    console.log(error);
  }
}

module.exports = {
    getParkData,
    getListData,
    getParkNames,
};