const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (email, subject, text) => {
  console.log("sending...");
  const msg = {
    to: email,
    from: "biuro@tajskiboks.best",
    subject: subject,
    text: text,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error("email not sent", error);
    });
};

module.exports = { sendEmail };
