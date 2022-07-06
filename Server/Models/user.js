const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    popId:{type:mongoose.Types.ObjectId,required:true,unique:true},
    email:"String",
    name:"String",
    phone:"String"
})

module.exports = mongoose.model("user",userSchema);