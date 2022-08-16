// const nodemailer = require("nodemailer");

//  // create reusable transporter object using the default SMTP transport
//  let transporter = nodemailer.createTransport({
//   host: "smtp-relay.sendinblue.com",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: 'daltondjo1@gmail.com', // sender email configured in Sendinblue
//     pass: 'hq1JZ4mMyYPszf7I',        // Master password found in Sendinblue
//   },
// });

// async function sendMail(recipient,subject,content) {
 
//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: 'daltondjo1@gmail.com',  // sender email address
//     to: recipient,   // list of receivers
//     subject: subject, // Subject line
//     text: "Hello world?",                     // plain text body
//     html: content,              // html body
//   });
 
//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
// }

require("dotenv").config()
const mailgun = require("mailgun-js");
const DOMAIN = process.env.DOMAIN;
const api_key = process.env.API_KEY

const mg = mailgun({apiKey: api_key, domain: DOMAIN});

async function sendMail(recipient,subject,content){
  const data = {
        from: 'daltondjo1@gmail.com',  // sender email address
        to: recipient,   // list of receivers
        subject: subject, // Subject line
        text: "Hello world?", // plain text body
        html: content,   // html body
  };
  try{
    let resp = await mg.messages().send(data);
    console.log(resp)
  }catch(e){
    
    throw e
  }
}

module.exports = sendMail;