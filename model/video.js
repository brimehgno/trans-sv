const mongoose = require('mongoose')
const videoSchema = new mongoose.Schema({
    // Define your data fields here
    name: {
        type: String,
        
    },
    adminData: {
        type: String,
        default: "",
    },
    url: {
        type: String,
        required: true,
    },
    baseUrl:{
        type: String,
        default: ""
    },
    active:{
        type: Boolean, 
        default: false,
    },
    status:{
        type: String,
        default: "none" // none, reject, pending, accept, done
    } ,
    progress:{
        type: Number, 
        default: 0,
    },
    factorSpeed :{
        type: Number, 
        default : 0,
    },
    userOwner:{
        type: String, 
        default:"",
    },
    currentTranslate:{
        type: Number,
        default:0
    },
    time: {
        type: Date,
        default: Date.now()
      },
    money: {
        type: Number, 
        default: 0,
    },
    error:{
        type: String,
        default: ""
    },
    performance: {
        type: Number, 
        default: 1,
    },
    type:{
        type: String,
        default: "",
    },
    refVideo : {
        type: String,
        default: ""
    },
    detailVideo:{
        type: String, 
        default: ""
    }
    
  },{timestamps:true});
 const video  =  mongoose.model('Video', videoSchema);
 module.exports = video;