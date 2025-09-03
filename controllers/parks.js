const {StatusCodes} = require('http-status-codes');
const axios = require('axios');
const Park = require('../models/Park.js');
require('dotenv').config();

async function getParkData(req,res) {
    try {
        const parkData = await Park.findOne({parkName:req.params.parkName});
        if(parkData) {
          res.status(StatusCodes.OK).json(parkData);
        } else {
          res.status(StatusCodes.NOT_FOUND).send(`Cannot find park with parkName: ${req.params.parkName}`);
        }      
    } catch (error) {
      console.log(error);
    }
}

async function sendParkPage(req,res) {
  const unitCode = req.params.unitCode
  const url = `${process.env.URL}/api/v1/parkdata/${unitCode.toUpperCase()}`
  const response = await fetch(url);
  const data = await response.json();
  const page = renderParkPage(data);
  res.status(StatusCodes.OK).send(page);
}

async function getListData(req,res) {
  const {region, state, parkType} = req.query;
  const query = {}
  if(region) query.region = region;
  if(state) query.state = state;
  if(parkType) query.parkType = parkType;
  const response = await Park.find(query)
  .setOptions({ sanitizeFilter: true }).select('parkName parkType region state')

  res.json(response);
}

async function getParkNames(req,res) {
  const response = await Park.find().select('parkName');
  const names = response.map(name => name.parkName);
  res.status(StatusCodes.OK).send(names);
}

module.exports = {
    getParkData,
    sendParkPage,
    getListData,
    getParkNames
};