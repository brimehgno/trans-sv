const mongoose = require("mongoose")

const billSchema = mongoose.Schema({
    user:{
        type: String, 
        required: true,
    },
    money:{
        type: Number,
    },
    date:{
        type: String,
    }
},{
    timestamps: true
})
const bill = mongoose.model("bill", billSchema);
module.exports = bill;