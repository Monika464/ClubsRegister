const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  const msg = {
    to: email,
    from: "muaythaikrakow@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

const sendCancelationEmail = (email, name) => {
  const msg = {
    to: email,
    from: "muaythaikrakow@gmail.com",
    subject: "Sorry to see you go!",
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};

// const msg = {
//   to: "mkubianka@gmail.com", // Change to your recipient
//   from: "muaythaikrakow@gmail.com", // Change to your verified sender
//   //from: "office@tajskiboks.best",
//   subject: "to jest testowy z Node numer 2",
//   text: "testowanie Node",
//   html: "<strong>Oto email</strong>",
// };

// sgMail
//   .send(msg)
//   .then(() => {
//     console.log("Email sent");
//   })
//   .catch((error) => {
//     console.error(error);
//   });
