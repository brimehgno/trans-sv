const mongoose = require('mongoose')

const detailVideoSchema = mongoose.Schema({
    mainData : {
        type: String, 
        default: ""
    }, 
    mainAdminData:{
        type: String, 
        default: ""
    },
}, );
const detailVideo = mongoose.model("detailVideo", detailVideoSchema)
module.exports= detailVideo;