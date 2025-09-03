const mongoose = require('mongoose');

const parkSchema = new mongoose.Schema({
    parkName: {
        type:String
    },
    unitCode: {
        type:String
    },
    parkType: {
        type:String
    },
    region: {
        type:String
    },
    state: {
        type:String
    },
    summary: {
        type:String
    },
    visitData: {
        type:Object
    }

});

module.exports = mongoose.model('Park', parkSchema);