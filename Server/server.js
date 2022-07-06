require("dotenv").config()
const fs = require('fs');
const cors = require("cors")
const jwt = require("jsonwebtoken")
const converter = require("json-2-csv")
const port = process.env.PORT
const express = require("express")
const mongoose = require("mongoose")
const AdminModel = require("./Models/admin")
const PopupModel = require("./Models/popup")
const UserModel = require("./Models/user")
const Token = require("./JWT/token")
const app = express()

const cookie = require("cookie");
const { info } = require("console");

app.use(cors({
    credentials: true,
    origin: true,
}))
app.use(express.json({ limit: '5000kb' }))
app.use(express.urlencoded({extended:true, limit: '5000kb'}))

// DATABASE CONNECTION HANDLE
async function connexion(){
    try{
        await mongoose.connect("mongodb+srv://Josue:8Fto1kA9AdrseYv7@nuxt-josue.lh9lgtd.mongodb.net/Popups?retryWrites=true&w=majority")
        console.log("DB connected")
    }catch(e){
        console.log(e.message)
    }
}
connexion()
// LOGIN FOR THE ADMINISTRATOR
app.post("/login2",async(req,res)=>{
   let admin = {}
   AdminModel.findOne({username:req.body.username,password:req.body.password},async (error,result)=>{
        if(error) throw error.message
        console.log(result)
        if(result!=null)
        {
            admin._id = result._id;
            admin.username = result.username; 

            token = await jwt.sign(admin,"josue",{expiresIn:"60s"})
           
            // STORE THE TOKEN IN THE HTTPONLY COOKIE
            res.setHeader('Set-Cookie', cookie.serialize('x-auth-token', token, {
                httpOnly: true,
                maxAge: 60*5  // 5 mn
              }));
              admin.token = token
            // if(typeof req.headers.cookie == "string")
            // console.log(cookie.parse(req.headers.cookie))
            res.json({_id:admin._id,username:admin.username,token:admin.token})
        }else{
            res.end();
        }
    })
 
})

// GET ALL POPUPS LIST AND THEIR CONFIGURATION
app.get("/getPopups",(req,res)=>{
    const popup = PopupModel.find((err,result)=>{
        if(err) throw err;
        res.json(result)
    });
})
// DASHBOARD INFORMATIONS (nombre des users, popups,receivers ...)
app.get("/getDashboardInfo",async(req,res)=>{
    const popups = await PopupModel.find();
    const users = await UserModel.find();
    let info = {
        nbreUser: users.length,
        nbrePopup: popups.length
    }
    console.log(info)
    res.json(info)
})
// GET ALL POPUPS LIST AND THEIR CONFIGURATION
app.get("/getUsers",(req,res)=>{
    UserModel.find((err,result)=>{
        if(err) throw err;
        res.json(result)
    });
})
app.post("/deleteUser",(req,res)=>{
    UserModel.deleteOne({_id:req.body.id},(err,doc)=>{
        if(err) throw err
        res.end("user deleted")
    })
})
 
app.get("/download/:type",async (req,res)=>{
    const users = await UserModel.find();
   
    const jsonContent = JSON.stringify(users)

    if(req.params.type == "json"){
        fs.writeFile("./File/users.json", jsonContent, 'utf8', function (err) {
            if (err) throw err
            console.log("Succesfully export!");
            res.download("./File/users.json","Users.json")
        });
    }
    else{
        
        converter.json2csv(users,(err,csv)=>{
            if(err) throw err
            else{
                fs.writeFile("./File/users.csv", csv, 'utf8', function (err) {
                    if (err) throw err
                    console.log("Succesfully export!");
                    res.download("./File/users.csv","Users.csv")
                });
            }
        })
    }
})
// UPDATE THE POPUP FROM CUSTOMIZER
app.post("/updatePopup",(req,res)=>{    
  let payload = req.body
  PopupModel.findByIdAndUpdate(payload._id,payload,(err,doc)=>{
    if(err) throw err
    else{
        console.log(doc)
        res.json("successfuly update")
    }
  })
})

// REGISTER USER GETTING FROM POPUP
app.post("/registerUser",(req,res)=>{
    let user = new UserModel(req.body)
    user.save((err,resp)=>{
        if(err) throw err
        else
        res.json(resp)
    })
})
// app.listen(port,()=>console.log(`Server started on ${port}`))
module.exports = app