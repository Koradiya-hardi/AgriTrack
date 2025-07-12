const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required: true
    },
    plantingDate: {
        type: Date,
        default: Date.now 
    },
    harvestDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Planted',"Growing", "Harvested"],
        default: 'Planted'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model("Crop", cropSchema);