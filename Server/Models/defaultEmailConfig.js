const mongoose = require("mongoose")
const defaultEmailConfigSchema = mongoose.Schema({
    object:String,
    content:{type:String,required:true}
})

module.exports = mongoose.model("defaultEmailConfig",defaultEmailConfigSchema)