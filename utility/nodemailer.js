const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
module.exports.sendMail = async function sendMail(str, data) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "nileshgarg0023@gmail.com", // generated ethereal user
      pass: "hhqazkwfydxfzoti", // generated ethereal password
    },
  });

  var Osubject, Otext, Ohtml;

  if (str == "signup") {
    Osubject = `Thank you for signup ${data.name}`;
    Ohtml = `
    <h1>Welcome to foodApp.com</h1>
    Hope you have a good time
    Here are your details-
    Name- ${data.name}
    Email- ${data.email}
    `;
  } else if (str == "resetpassword") {
    Osubject = `Reset Password`;
    Ohtml = `
    <h1>foodApp.com</h1>
    Here is your link to reset your password ! ${data.resetPasswordLink}
    `;
  }

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"FoodApp" <nileshgarg0023@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: Osubject, // Subject line
    // plain text body
    html: Ohtml, // html body
  });

  console.log("Message sent: %s", info.messageId);
};
