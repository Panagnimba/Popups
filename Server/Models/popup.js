const mongoose = require("mongoose")

const popupSchema = mongoose.Schema({
    componentName:{type:String,required:true},
    _id:{type:mongoose.Types.ObjectId},
    config:{
        img:"String",
        description:"String",
        showPopup:"Boolean",
        showEmail:"Boolean",
        showName:"Boolean",
        showPhone:"Boolean",

        tr:"Boolean",
        tl:"Boolean",
        br:"Boolean",
        bl:"Boolean",
        ctr:"Boolean",

        min:"Boolean",
        moy:"Boolean",
        max:"Boolean",

        timeout:"String",
        submitText:{type:"String",default:"Envoyer"}
    }
})

module.exports = mongoose.model("popups",popupSchema)