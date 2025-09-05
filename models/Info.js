const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
  types:{
    type:Array
  },
  states:{
    type:Array
  },
  regions:{
    type:Array
  }

});

module.exports = mongoose.model('Info', infoSchema);