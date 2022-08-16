require("dotenv").config()
const fs = require("fs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const converter = require("json-2-csv");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const AdminModel = require("./Models/admin");
const PopupModel = require("./Models/popup");
const UserModel = require("./Models/user");
const sendMail = require("./MailSender/email");
const DefaultEmailConfig = require("./Models/defaultEmailConfig");
const MailTemplate = require("./Models/emailTemplate");
// const Token = require("./JWT/token")

// GET ALL SENDING EMAIL STATUS
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const DOMAIN = process.env.DOMAIN;
const API_KEY = process.env.API_KEY
const app = express();

const cookie = require("cookie");
const { info } = require("console");

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.json({ limit: "5000kb" }));
app.use(express.urlencoded({ extended: true, limit: "5000kb" }));

// DATABASE CONNECTION HANDLE
async function connexion() {
  try {
    await mongoose.connect("mongodb://localhost:27017/Popups", {
      useNewUrlParser: true,
    });
    console.log("DB connected");
  } catch (e) {
    console.log(e.message);
  }
}
connexion();
// LOGIN FOR THE ADMINISTRATOR
app.post("/login", async (req, res) => {
  let admin = {};
  AdminModel.findOne(
    { username: req.body.username, password: req.body.password },
    async (error, result) => {
      if (error) throw error.message;
      console.log(result);
      if (result != null) {
        admin._id = result._id;
        admin.username = result.username;

        token = await jwt.sign(admin, "josue", { expiresIn: "60s" });

        // STORE THE TOKEN IN THE HTTPONLY COOKIE
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("x-auth-token", token, {
            httpOnly: true,
            maxAge: 60 * 5, // 5 mn
          })
        );
        admin.token = token;
        // if(typeof req.headers.cookie == "string")
        // console.log(cookie.parse(req.headers.cookie))
        res.json({
          _id: admin._id,
          username: admin.username,
          token: admin.token,
        });
      } else {
        res.end();
      }
    }
  );
});

// GET ALL POPUPS LIST AND THEIR CONFIGURATION
app.get("/getPopups", (req, res) => {
  const popup = PopupModel.find((err, result) => {
    if (err) throw err;
    res.json(result);
  });
});
// DASHBOARD INFORMATIONS (nombre des users, popups,receivers ...)
// And the default email config
app.get("/getDashboardInfo", async (req, res) => {
  const popups = await PopupModel.find();
  const users = await UserModel.find();
  // count the active user (represent the users who receive least one email)
  let activeUserCount = 0;
  users.forEach((user) => {
    if (user.counter > 0) {
      activeUserCount++;
    }
  });
  //
  // Get default email configuration
  let defaultE = {};
  const defaultEmailConfig = await DefaultEmailConfig.findOne();
  if (defaultEmailConfig)
    defaultE = {
      id: defaultEmailConfig._id,
      object: defaultEmailConfig.object,
      content: defaultEmailConfig.content,
    };

  let info = {
    nbreUser: users.length,
    nbrePopup: popups.length,
    nbreReceivers: activeUserCount,
    defaultEmailConfig: defaultE,
  };
  console.log(info);
  res.json(info);
});
// GET ALL POPUPS LIST AND THEIR CONFIGURATION
app.get("/getUsers", (req, res) => {
  UserModel.find((err, result) => {
    if (err) throw err;
    res.json(result);
  });
});


// GET ALL SENDING EMAIL STATUS

app.get("/history", (req, res) => {
  const mailgun = new Mailgun(formData);

  const client = mailgun.client({ username: 'api', key: API_KEY || '' });
  (async () => {
    try {
      const date = new Date(2021, 10, 1, 0, 0, 0, 0); // Mon Nov 01 2021 00:00:00 GMT+0200
      const events = await client.events.get(DOMAIN, {
        begin: date.toGMTString(), // Sun, 31 Oct 2021 22:00:00 GMT
        ascending: 'yes',
        //   limit: 5
      });
      res.json(events)
    } catch (error) {
      console.error(error);
    }
  })();
})
// RESEND EMAIL FROM THE HISTORY
app.post("/resendMail", (req, res) => {
  // 
  let mailObject = req.body
  let firstPartOfUrl = ""
  let storageKey = ""
  // 
  const data = {
    to: mailObject.message.headers.to //  recipient
  };
  /*
  The domain of storage. Can be found in Sending -> logs on your dashboard.
  The needed value is the first part of storage.url
  */
  if (mailObject.storage.url) {
    let idxUrl = mailObject.storage.url ? mailObject.storage.url.indexOf(".net") : 0
    firstPartOfUrl = mailObject.storage.url.slice(0, idxUrl + 4) // +4 to include de '.net' string
  }
  /*
  The key of message in storage.
  Can be found in Sending -> logs on your dashboard
  The needed value is located in storage.key
*/
  if (mailObject.storage.key) {
    storageKey = mailObject.storage.key;
  }
  // 
  const options = {
    key: API_KEY,
    url: firstPartOfUrl,
    username: 'api',
  };
  // 
  (async () => {
    try {
      const mailgun = new Mailgun(formData);
      const client = mailgun.client(options);
      await client.request.postWithFD(`v3/domains/${DOMAIN}/messages/${storageKey}`, data);
      res.json("Succesfully resend email")
    } catch (error) {
      res.json({ error: error.status }); // set error code
    }
  })();
})
app.post("/deleteUser", (req, res) => {
  UserModel.deleteOne({ _id: req.body.id }, (err, doc) => {
    if (err) throw err;
    res.end("user deleted");
  });
});
app.get("/download/:type", async (req, res) => {
  const users = await UserModel.find();
  const pathToTheFile = path.join(__dirname, "File");
  const jsonContent = JSON.stringify(users);

  if (req.params.type == "json") {
    fs.writeFile(
      `${pathToTheFile}/users.json`,
      jsonContent,
      "utf8",
      function (err) {
        if (err) throw err;
        console.log("Succesfully export!");
        res.download(`${pathToTheFile}/users.json`, "Users.json");
      }
    );
  } else {
    converter.json2csv(users, (err, csv) => {
      if (err) throw err;
      else {
        fs.writeFile(`${pathToTheFile}/users.csv`, csv, "utf8", function (err) {
          if (err) throw err;
          console.log("Succesfully export!");
          res.download(`${pathToTheFile}/users.csv`, "Users.csv");
        });
      }
    });
  }
});
// UPDATE THE POPUP FROM CUSTOMIZER
app.post("/updatePopup", (req, res) => {
  let payload = req.body;
  PopupModel.findByIdAndUpdate(payload._id, payload, (err, doc) => {
    if (err) throw err;
    else {
      console.log(doc);
      res.json("successfuly update");
    }
  });
});
//
app.post("/updateDefaultEmailConfig", async (req, res) => {
  const defaultEmailConfig = await DefaultEmailConfig.findOne();
  if (defaultEmailConfig == null) {
    let Conf = new DefaultEmailConfig({
      object: req.body.object,
      content: req.body.content,
    });
    Conf.save();
    res.json("Successfully update DefaultEmailConfig");
  } else {
    let doc = await DefaultEmailConfig.findByIdAndUpdate(
      { _id: req.body.id },
      { object: req.body.object, content: req.body.content }
    );
    res.json("Successfully update DefaultEmailConfig");
  }
});

//
app.post("/addEmailTemplate", async (req, res) => {
  if (req.body.id) {
    let doc = await MailTemplate.findByIdAndUpdate(
      { _id: req.body.id },
      req.body
    );
    res.json("Successfully update email template");
  } else {
    let temp = new MailTemplate(req.body);
    temp.save();
    res.json("Successfully add email template");
  }
});
// Get all store email template
app.get("/getEmailTemplate", async (req, res) => {
  const templates = await MailTemplate.find();
  res.json(templates);
});
// REGISTER USER GETTING FROM POPUP
app.post("/registerUser", (req, res) => {
  let user = new UserModel(req.body);
  user.save((err, resp) => {
    if (err) throw err;
    else res.json(resp);
  });
});


// Send mail handler
app.post("/sendMail", async (req, res) => {
  let mailObject = req.body;
  // console.log(mailObject)
  if (typeof mailObject.receivers == "string")
    mailObject.receivers = mailObject.receivers.split(",");
  try {
    await sendMail(mailObject.receivers, mailObject.object, mailObject.content);
    // modification du compteur de email reçus
    try {
      mailObject.receivers.forEach((email) => {
        UserModel.updateMany(
          { email: email },
          { $inc: { counter: 1 } },
          (err, doc) => {
            if (err) throw err;
          }
        );
      });
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    res.json({ error: e.statusCode }); // set error code
    console.log(e.event + " error when sending email");
  }

  res.end();
});
// app.listen(port,()=>console.log(`Server started on ${port}`))
module.exports = app;
