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
    description: {
        type:String
    },
    url :{
        type:String
    },
    images: {
        type:Array
    },
    webImages: {
        type:Object,
        default: null
    },
    visitData: {
        type:Object
    }

});

module.exports = mongoose.model('Park', parkSchema);