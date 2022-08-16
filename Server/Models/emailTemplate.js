const mongoose = require("mongoose")
emailTemplateSchema = new mongoose.Schema({
    name:String,
    object:String,
    description:String,
    image:String,
    content:String
})

module.exports = mongoose.model("MailTemplate",emailTemplateSchema)