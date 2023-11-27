const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type: String, 
        required: true,
    }, 
    username: {
        type: String, 
        required: true
    },
    password:{
        type: String,
        required: true
    },
    active:{
        type: Boolean,
        default: false,
    },
    account:{
        type: Number, 
        default: 10000,
    },
    totalAccount :{
        type: Number, 
        default: 10000,
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },
    birthday:{
        type: String,
        default: ""
    },
    rank:{
        type: Number,
        default: 1,
    },
    family:{
        type: Boolean,
        default: false,
    },
    score:{
        type: Number,
        default: 0,
    },
    bankName:{
        type: String,
        default:"",
    },
    bankNumber:{
        type: String,
        default: "",
    },
    type:{
        type: String,
        default: ""
    },
    isRestrict:{
        type: Boolean,
        default: false,
    }
},{
    timestamps: true
});
const user = mongoose.model("user", userSchema);

module.exports = user;