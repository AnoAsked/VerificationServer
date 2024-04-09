const app = require('express')();
const nodemailer = require('nodemailer'); // For sending emails
const port = 3000;

const bodyParser = require('express').json;
app.use(bodyParser());

function sendVerificationCode(email, code) {
  const mailOptions = {
    from: 'anoasked@gmail.com',
    to: email,
    subject: 'AnoAsked verification',
    text: `Your verification code is: ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return;
    }
    console.log('Verification code sent:', info.response);
  });
}

app.post('/verify', async (req, res) => {
    const { username, email } = req.body;

    // Generate random verification number and save on db
    // Send email to user
})

app.post('/confirm', async (req, res) => {
    const { username, code } = req.body;

    // Compare send verification code in db with current
})

app.post('/check', async (req, res) => {
    const { username } = req.body;

    // Check in db if user is verified
})

app.listen(port, () => console.log(`AnoAsked verification server running on port: ${port}`))